// "Is my change online?" indicator for the admin.
//
// Saving in the admin only records the change in the project's history; the site is rebuilt and put
// online by an automatic job a few minutes later. This small panel compares the two and never says
// "online" before the published site really carries the last recorded change.
//
// It only reads public information (no sign-in, no token): the version file published with the site
// and the public GitHub pages of the project.
(() => {
  const SITE_ROOT = new URL("../", document.baseURI).href; // the site this admin belongs to
  const IS_LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
  const API = "https://api.github.com/repos/";
  const FAST = 20_000; // while a publication is running
  const SLOW = 180_000; // the rest of the time (GitHub allows 60 anonymous requests per hour)
  let repo = "";
  let branch = "main";
  let timer = 0;
  let fastUntil = 0;

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
    @media (max-width: 600px) { #tcs-pub .label-long { display: none; } }
  `,
  });

  const label = el("span");
  const pill = el("button", { type: "button", className: "pill" }, [el("span", { className: "dot" }), label]);
  pill.setAttribute("aria-expanded", "false");
  pill.setAttribute("aria-controls", "tcs-pub-panel");
  const panel = el("div", { className: "panel", id: "tcs-pub-panel", hidden: true });
  const root = el("div", { id: "tcs-pub" }, [panel, pill]);
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");

  pill.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    pill.setAttribute("aria-expanded", String(!panel.hidden));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) pill.click();
  });

  function show(state, short, lines) {
    root.dataset.state = state;
    label.textContent = short;
    panel.replaceChildren(
      ...lines.map((line) => (typeof line === "string" ? el("p", { textContent: line }) : line)),
      el("p", {}, [el("a", { href: SITE_ROOT, target: "_blank", rel: "noopener", textContent: "Voir le site" })])
    );
  }

  async function json(url) {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  async function check() {
    clearTimeout(timer);
    let next = SLOW;
    try {
      if (IS_LOCAL) {
        show("idle", "Essai en local", ["Tu es sur une copie d'essai : rien n'est envoyé sur le vrai site."]);
        return;
      }
      if (!repo) {
        const config = await (await fetch("./config.yml", { cache: "no-store" })).text();
        repo = (config.match(/^\s*repo:\s*([\w.-]+\/[\w.-]+)\s*$/m) || [])[1] || "";
        branch = (config.match(/^\s*branch:\s*([\w./-]+)\s*$/m) || [])[1] || "main";
      }
      const [published, latest] = await Promise.all([
        fetch(`${SITE_ROOT}version.json?t=${Date.now()}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
        json(`${API}${repo}/commits/${branch}`),
      ]);
      const lastChange = when(latest.commit.committer.date);
      if (published && published.commit === latest.sha) {
        show("online", "Le site est à jour", [`Ta dernière modification est en ligne.`, el("p", { className: "muted", textContent: `Dernière mise en ligne : ${when(published.builtAt)}.` })]);
        fastUntil = 0;
      } else {
        const runs = await json(`${API}${repo}/actions/runs?branch=${branch}&head_sha=${latest.sha}&per_page=1`);
        const run = runs.workflow_runs && runs.workflow_runs[0];
        if (run && run.status === "completed" && run.conclusion !== "success") {
          show("failed", "Mise en ligne échouée", [
            "Ta modification est bien enregistrée, mais elle n'a pas pu être mise en ligne. Le site affiche encore la version précédente.",
            "Rien n'est perdu. Préviens Florent : il verra tout de suite ce qui bloque.",
            el("p", { className: "muted", textContent: `Modification du ${lastChange}.` }),
          ]);
        } else {
          show("pending", "Mise en ligne en cours…", [
            "Ta modification est enregistrée. Le site se met à jour tout seul : compte 2 à 5 minutes.",
            "Tu peux continuer à travailler ou fermer cette page, cela ne change rien.",
            el("p", { className: "muted", textContent: `Modification du ${lastChange}.` }),
          ]);
          next = FAST;
        }
      }
    } catch (error) {
      show("idle", "État de la mise en ligne inconnu", [
        "Impossible de vérifier pour le moment (connexion, ou trop de vérifications en peu de temps).",
        "Tes modifications enregistrées ne sont pas concernées. Ouvre le site dans quelques minutes pour vérifier.",
      ]);
    }
    if (Date.now() < fastUntil) next = FAST;
    timer = setTimeout(check, next);
  }

  // After a click on the save button, look more often for a few minutes.
  document.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest && event.target.closest("button");
      if (button && /^(enregistrer|publier|save|publish)/i.test(button.textContent.trim())) {
        fastUntil = Date.now() + 8 * 60_000;
        clearTimeout(timer);
        timer = setTimeout(check, 6000);
      }
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
