// "Is my change online?" indicator for the admin.
//
// Saving in the admin only records the change in the project's history; the site is rebuilt and put
// online by an automatic job a few minutes later. This small panel compares the two and never says
// "online" before the published site really carries the last recorded change.
//
// It only reads public information (no sign-in, no token): the version file published with the site
// and the public GitHub pages of the project. GitHub allows 60 anonymous requests per hour, so the
// site's own version file (free) is polled often and GitHub rarely.
(() => {
  const SITE_ROOT = new URL("../", document.baseURI).href; // the site this admin belongs to
  const IS_LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
  const API = "https://api.github.com/repos/";
  const WORKFLOW = "deploy.yml";
  const SITE_POLL = 20_000; // published version file, while a publication is running
  const SAVE_POLL = 10_000; // right after a click on the save button
  const IDLE_POLL = 300_000; // GitHub, when nothing is expected (12 requests per hour)
  const PENDING_GITHUB_EVERY = 90_000; // GitHub, while a publication is running
  const AFTER_SAVE = [8_000, 20_000, 40_000, 70_000, 110_000]; // GitHub, looking for the change just saved
  const PENDING_MAX = 15 * 60_000;

  let repo = "";
  let branch = "main";
  let timer = 0;
  let head = null; // last recorded change known: { sha, date }
  let run = null; // its publication job, when known
  let lastGithub = 0;
  let pendingSince = 0;
  let save = null; // { headBefore, at, step } after a click on the save button
  let shown = "";

  const el = (tag, props = {}, children = []) => {
    const node = Object.assign(document.createElement(tag), props);
    children.forEach((c) => node.append(c));
    return node;
  };
  const when = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  };

  const style = el("style", {
    textContent: `
    #tcs-pub { position: fixed; left: 12px; bottom: 12px; z-index: 2147483000; font: 14px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; color: #362E28; }
    #tcs-pub button.pill { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 14px; border: 1px solid #DCCDB8; border-radius: 999px; background: #FBF7EF; color: inherit; font: inherit; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(54,46,40,.18); }
    #tcs-pub button.pill:focus-visible, #tcs-pub a:focus-visible { outline: 3px solid #7C3C3C; outline-offset: 2px; }
    #tcs-pub .dot { width: 10px; height: 10px; border-radius: 50%; background: #8a7d75; flex: none; }
    #tcs-pub[data-state="online"] .dot { background: #2e7d4f; }
    #tcs-pub[data-state="pending"] .dot { background: #c77a12; animation: tcs-pulse 1.2s ease-in-out infinite; }
    #tcs-pub[data-state="failed"] .dot { background: #b3261e; }
    #tcs-pub .panel { margin-bottom: 8px; max-width: min(340px, calc(100vw - 24px)); padding: 14px 16px; border: 1px solid #DCCDB8; border-radius: 16px; background: #FBF7EF; box-shadow: 0 8px 24px rgba(54,46,40,.22); }
    #tcs-pub .panel p { margin: 0 0 8px; }
    #tcs-pub .panel p:last-child { margin: 0; }
    #tcs-pub .panel a { color: #7C3C3C; font-weight: 600; }
    #tcs-pub .muted { color: #5d5049; font-size: 13px; }
    @keyframes tcs-pulse { 50% { opacity: .35; } }
    @media (prefers-reduced-motion: reduce) { #tcs-pub[data-state="pending"] .dot { animation: none; } }
  `,
  });

  const label = el("span");
  label.setAttribute("role", "status"); // only the short label is announced, and only when it changes
  const pill = el("button", { type: "button", className: "pill" }, [el("span", { className: "dot" }), label]);
  pill.setAttribute("aria-expanded", "false");
  pill.setAttribute("aria-controls", "tcs-pub-panel");
  const panel = el("div", { className: "panel", id: "tcs-pub-panel", hidden: true });
  const root = el("div", { id: "tcs-pub" }, [panel, pill]);

  pill.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    pill.setAttribute("aria-expanded", String(!panel.hidden));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) pill.click();
  });

  function show(state, short, lines) {
    const key = JSON.stringify([state, short, lines]);
    if (key === shown) return; // nothing new: do not touch the page (no repeated announcement)
    shown = key;
    root.dataset.state = state;
    label.textContent = short;
    panel.replaceChildren(
      ...lines.map((line) => el("p", { textContent: line.replace(/^~/, ""), className: line.startsWith("~") ? "muted" : "" })),
      el("p", {}, [el("a", { href: SITE_ROOT, target: "_blank", rel: "noopener", textContent: "Voir le site" })])
    );
  }

  async function github(path) {
    lastGithub = Date.now();
    const res = await fetch(`${API}${repo}/${path}`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }
  const published = () =>
    fetch(`${SITE_ROOT}version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

  async function check() {
    clearTimeout(timer);
    if (IS_LOCAL) return show("idle", "Essai en local", ["Tu es sur une copie d'essai : rien n'est envoyé sur le vrai site."]);
    if (document.hidden) return; // resumes when the page is looked at again
    let next = IDLE_POLL;
    try {
      if (!repo) {
        const config = await (await fetch("./config.yml", { cache: "no-store" })).text();
        repo = (config.match(/^\s*repo:\s*([\w.-]+\/[\w.-]+)\s*$/m) || [])[1] || "";
        branch = (config.match(/^\s*branch:\s*([\w./-]+)\s*$/m) || [])[1] || "main";
      }
      const now = Date.now();
      const site = await published();
      const isOnline = () => site && head && site.commit === head.sha;

      // When to ask GitHub: at start, on the idle rhythm, on the "just saved" rhythm, or now and then while pending.
      let ask = !head || now - lastGithub >= IDLE_POLL;
      if (save && now - save.at >= AFTER_SAVE[save.step]) ask = true;
      if (!save && head && !isOnline() && now - lastGithub >= PENDING_GITHUB_EVERY) ask = true;
      if (ask) {
        const latest = await github(`commits/${branch}`);
        if (!head || latest.sha !== head.sha) run = null;
        head = { sha: latest.sha, date: latest.commit.committer.date };
        if (save) {
          if (head.sha !== save.headBefore) save = null; // the change just saved is recorded
          else if (++save.step >= AFTER_SAVE.length) save = null; // nothing was recorded (nothing to save, or refused)
        }
        if (!isOnline()) {
          const runs = await github(`actions/workflows/${WORKFLOW}/runs?branch=${branch}&head_sha=${head.sha}&per_page=1`);
          run = (runs.workflow_runs && runs.workflow_runs[0]) || null;
        }
      }

      const failed = run && run.status === "completed" && ["failure", "timed_out", "startup_failure"].includes(run.conclusion);
      if (save) {
        // A save was just asked for: never answer "online" from what was known before it.
        show("pending", "Enregistrement…", ["Ta modification est en cours d'enregistrement.", "Si un message rouge est apparu sous un champ, corrige-le puis enregistre de nouveau."]);
        next = SAVE_POLL;
      } else if (isOnline()) {
        pendingSince = 0;
        show("online", "Le site est à jour", ["Ta dernière modification est en ligne.", `~Dernière mise en ligne : ${when(site.builtAt)}.`]);
      } else if (failed) {
        pendingSince = 0;
        show("failed", "Mise en ligne échouée", [
          "Ta modification est bien enregistrée, mais elle n'a pas pu être mise en ligne. Le site affiche encore la version précédente.",
          "Rien n'est perdu. Préviens Florent : il verra tout de suite ce qui bloque.",
          `~Modification du ${when(head.date)}.`,
        ]);
      } else {
        pendingSince = pendingSince || now;
        const long = now - pendingSince > PENDING_MAX;
        show("pending", "Mise en ligne en cours…", [
          "Ta modification est enregistrée. Le site se met à jour tout seul : compte 2 à 5 minutes.",
          long ? "C'est plus long que d'habitude. Si rien ne change d'ici une heure, préviens Florent." : "Tu peux continuer à travailler ou fermer cette page, cela ne change rien.",
          `~Modification du ${when(head.date)}.`,
        ]);
        next = long ? IDLE_POLL : SITE_POLL;
      }
    } catch (error) {
      save = null;
      show("idle", "État de la mise en ligne inconnu", [
        "Impossible de vérifier pour le moment (connexion, ou trop de vérifications en peu de temps).",
        "Tes modifications enregistrées ne sont pas concernées. Ouvre le site dans quelques minutes pour vérifier.",
      ]);
    }
    timer = setTimeout(check, next);
  }

  // A save (button or Ctrl+S), a deletion: look for the new change during the next two minutes.
  function expectChange() {
    if (IS_LOCAL) return;
    save = { headBefore: head ? head.sha : null, at: Date.now(), step: 0 };
    clearTimeout(timer);
    timer = setTimeout(check, 1500);
  }
  document.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest && event.target.closest("button");
      if (button && !root.contains(button) && /^(enregistrer|publier|supprimer|save|publish|delete)/i.test(button.textContent.trim())) expectChange();
    },
    true
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") expectChange();
    },
    true
  );
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) check();
  });

  const start = () => {
    document.head.append(style);
    document.body.append(root);
    show("idle", "Vérification…", ["Vérification de l'état du site…"]);
    check();
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
