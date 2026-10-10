// Welcome screen of the admin: "Bonjour Elsa, que veux-tu modifier ?"
//
// Six large buttons, one per thing Elsa comes to do, each opening the right form directly.
// It is only a set of shortcuts laid over the admin: it reads nothing, writes nothing and needs no sign-in.
// The "Accueil" button (bottom left) brings it back at any time.
(() => {
  const ENTRY = "#/collections/_singletons/entries/";
  const CARDS = [
    { icon: "🏠", title: "Page d'accueil", text: "Le grand titre, les cartes, ton histoire en quelques lignes.", to: `${ENTRY}home` },
    { icon: "🤝", title: "Mes accompagnements", text: "Les offres, la méthode, les questions fréquentes.", to: `${ENTRY}services` },
    { icon: "👤", title: "À propos", text: "Ta présentation, ton parcours, tes diplômes.", to: `${ENTRY}about` },
    {
      icon: "📝",
      title: "Articles et ressources",
      text: "Écrire ou corriger un article.",
      to: "#/collections/blog",
      more: [{ label: "Textes du guide gratuit", to: `${ENTRY}resources` }],
    },
    {
      icon: "🖼️",
      title: "Photos et documents",
      text: "Changer une photo du site.",
      to: `${ENTRY}site_images`,
      more: [{ label: "Remplacer le guide gratuit (PDF)", to: `${ENTRY}guide` }],
    },
    { icon: "📞", title: "Coordonnées et réservation", text: "Tes liens Calendly, ton email, ton Instagram.", to: `${ENTRY}site` },
  ];
  const OTHER = [
    { label: "Menu et bas de page", to: `${ENTRY}shared` },
    { label: "Options avancées (Google)", to: `${ENTRY}meta` },
  ];

  const el = (tag, props = {}, children = []) => {
    const node = Object.assign(document.createElement(tag), props);
    children.forEach((c) => node.append(c));
    return node;
  };

  const style = el("style", {
    textContent: `
    #tcs-home { position: fixed; inset: 0; z-index: 2147482000; overflow-y: auto; background: #F4EBDD; color: #362E28; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    #tcs-home[hidden] { display: none; }
    #tcs-home .wrap { max-width: 980px; margin: 0 auto; padding: 40px 20px 110px; }
    #tcs-home h1 { margin: 0; font: 600 34px/1.15 Georgia, "Times New Roman", serif; color: #5C2B2B; }
    #tcs-home .lead { margin: 8px 0 28px; font-size: 20px; }
    #tcs-home .grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); }
    #tcs-home .card { display: flex; flex-direction: column; border: 1px solid #DCCDB8; border-radius: 20px; background: #FBF7EF; box-shadow: 0 2px 8px rgba(54,46,40,.06); }
    #tcs-home .card > a.main { display: flex; gap: 14px; align-items: flex-start; padding: 20px; min-height: 96px; color: inherit; text-decoration: none; border-radius: 20px; }
    #tcs-home .card > a.main:hover { background: #fff; }
    #tcs-home .ico { font-size: 30px; line-height: 1; flex: none; }
    #tcs-home .card strong { display: block; font-size: 19px; color: #362E28; }
    #tcs-home .card span.t { display: block; margin-top: 2px; color: #5d5049; font-size: 15px; }
    #tcs-home .more { margin: 0; padding: 0 20px 16px 64px; list-style: none; }
    #tcs-home a.link { display: inline-flex; align-items: center; min-height: 44px; color: #7C3C3C; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
    #tcs-home .other { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 4px 24px; align-items: center; color: #5d5049; }
    #tcs-home .steps { margin: 28px 0 0; padding: 18px 20px; border-radius: 16px; background: #362E28; color: #FBF7EF; }
    #tcs-home .steps ol { margin: 8px 0 0; padding-left: 22px; }
    #tcs-home .steps li { margin: 4px 0; }
    #tcs-home a:focus-visible, #tcs-home button:focus-visible, #tcs-home-open:focus-visible { outline: 3px solid #7C3C3C; outline-offset: 2px; }
    #tcs-home .close { position: absolute; top: 14px; right: 16px; min-height: 44px; padding: 8px 16px; border: 1px solid #DCCDB8; border-radius: 999px; background: #FBF7EF; color: #362E28; font: inherit; font-weight: 600; cursor: pointer; }
    #tcs-home-open { position: fixed; left: 12px; bottom: 12px; z-index: 2147483001; display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 16px; border: 0; border-radius: 999px; background: #7C3C3C; color: #FBF7EF; font: 600 14px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(54,46,40,.25); }
    #tcs-home-open[hidden] { display: none; }
    body.tcs-has-home #tcs-pub { left: 128px; }
    @media (max-width: 600px) { #tcs-home h1 { font-size: 28px; } #tcs-home .wrap { padding-top: 64px; } }
  `,
  });

  const go = (to) => (event) => {
    event.preventDefault();
    close();
    if (location.hash !== to) location.hash = to;
  };
  const link = (item, className) => {
    const a = el("a", { href: item.to, className, textContent: item.label || "" });
    a.addEventListener("click", go(item.to));
    return a;
  };

  const grid = el("div", { className: "grid" });
  for (const card of CARDS) {
    const main = link({ to: card.to }, "main");
    main.append(el("span", { className: "ico", textContent: card.icon, ariaHidden: "true" }), el("span", {}, [el("strong", { textContent: card.title }), el("span", { className: "t", textContent: card.text })]));
    const box = el("div", { className: "card" }, [main]);
    if (card.more) box.append(el("ul", { className: "more" }, card.more.map((m) => el("li", {}, [link(m, "link")]))));
    grid.append(box);
  }
  const other = el("p", { className: "other" }, [el("span", { textContent: "Plus rarement :" }), ...OTHER.map((o) => link(o, "link"))]);
  const steps = el("div", { className: "steps" }, [
    el("strong", { textContent: "Comment ça marche" }),
    el("ol", {}, [
      el("li", { textContent: "Tu modifies. Le français est à gauche, l'anglais à droite." }),
      el("li", { textContent: "Tu cliques sur « Enregistrer », en haut à droite." }),
      el("li", { textContent: "Le site se met à jour tout seul en 2 à 5 minutes. La pastille en bas de l'écran te dit quand c'est en ligne." }),
    ]),
  ]);
  const closeButton = el("button", { type: "button", className: "close", textContent: "Fermer" });
  const title = el("h1", { id: "tcs-home-title", textContent: "Bonjour Elsa" });
  const home = el("div", { id: "tcs-home", hidden: true }, [
    closeButton,
    el("div", { className: "wrap" }, [title, el("p", { className: "lead", textContent: "Que veux-tu modifier ?" }), grid, other, steps]),
  ]);
  home.setAttribute("role", "dialog");
  home.setAttribute("aria-modal", "true");
  home.setAttribute("aria-labelledby", "tcs-home-title");
  const openButton = el("button", { type: "button", id: "tcs-home-open", hidden: true }, [el("span", { textContent: "🏠", ariaHidden: "true" }), el("span", { textContent: "Accueil" })]);

  let lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    home.hidden = false;
    openButton.hidden = true;
    home.querySelector("a.main").focus();
  }
  function close() {
    home.hidden = true;
    openButton.hidden = false;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  closeButton.addEventListener("click", close);
  openButton.addEventListener("click", open);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !home.hidden) close();
  });

  // The admin is "open" once its side menu exists (before that, it is the sign-in screen).
  const signInScreen = () => [...document.querySelectorAll("button")].some((b) => /se connecter|sign in|dépôt local|local repository/i.test(b.textContent));
  const signedIn = () => !signInScreen() && (!!document.querySelector("nav.primary-sidebar, nav[class*='sidebar']") || /^#\/collections\//.test(location.hash));
  const onEntry = () => /\/entries\/|\/new$/.test(location.hash);
  let greeted = false;
  function sync() {
    const inside = signedIn();
    if (!inside) {
      home.hidden = true;
      openButton.hidden = true;
      greeted = false;
      return;
    }
    if (!greeted) {
      greeted = true;
      // Arriving on the admin: show the welcome screen, unless a precise form was asked for by its address.
      if (onEntry()) openButton.hidden = false;
      else open();
    } else if (home.hidden) openButton.hidden = false;
  }

  // The publication indicator moves aside when the "Accueil" button is shown.
  const place = () => document.body.classList.toggle("tcs-has-home", !openButton.hidden);

  const start = () => {
    document.head.append(style);
    document.body.append(home, openButton);
    const refresh = () => {
      sync();
      place();
    };
    new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", refresh);
    openButton.addEventListener("click", place);
    closeButton.addEventListener("click", place);
    home.addEventListener("click", () => setTimeout(place));
    document.addEventListener("keydown", () => setTimeout(place));
    refresh();
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
