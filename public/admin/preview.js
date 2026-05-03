/* Decap CMS — Custom preview templates + responsive viewport selector.
 *
 * Loaded after the Decap CMS bundle by admin/index.html. Defensive: if any
 * Decap global is missing (API drift between versions), we silently bail
 * rather than break the admin.
 *
 * What it does:
 *  - Registers /admin/preview.css as the brand styling for previews.
 *  - Registers a custom preview template for the `blog` collection: hero
 *    (date + title + excerpt + tool-marker placeholder) above the rendered
 *    markdown body, all wrapped in a frame whose max-width is switchable
 *    between Mobile (375), Tablet (768) and Desktop (1200).
 *  - The other collections (settings, seo, en, fr) keep their native form
 *    (no preview pane) since they are bag-of-keys JSON, not page content.
 */

(function () {
  if (typeof window === "undefined" || typeof window.CMS === "undefined") return;
  var CMS = window.CMS;

  // 1) Brand styling for the preview iframe.
  if (typeof CMS.registerPreviewStyle === "function") {
    CMS.registerPreviewStyle("/admin/preview.css");
  }

  // 2) Custom preview template for the blog collection.
  // Decap exposes React + createElement (`h`) on globals when its bundle loads.
  var R = window.React || (CMS && CMS.React);
  var h = window.h || (R && R.createElement);
  var useState = R && R.useState;

  if (!h || !useState || typeof CMS.registerPreviewTemplate !== "function") {
    // Decap API surface differs — skip the custom template, default preview
    // (just the rendered markdown with the brand CSS) still loads fine.
    return;
  }

  var WIDTHS = { mobile: 375, tablet: 768, desktop: 1200 };
  var WIDTH_LABELS = {
    mobile: "📱 Mobile",
    tablet: "💻 Tablet",
    desktop: "🖥 Desktop",
  };

  function formatDate(value, lang) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString(
        lang === "fr" ? "fr-FR" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }
      );
    } catch (e) {
      return String(value);
    }
  }

  function BlogPreview(props) {
    var entry = props.entry;
    var title = entry.getIn(["data", "title"]);
    var excerpt = entry.getIn(["data", "excerpt"]);
    var date = entry.getIn(["data", "date"]);
    var tool = entry.getIn(["data", "tool"]);
    var lang = entry.getIn(["data", "lang"]) || "en";

    var widthState = useState("desktop");
    var width = widthState[0];
    var setWidth = widthState[1];
    var maxWidth = WIDTHS[width] || WIDTHS.desktop;
    var dateStr = formatDate(date, lang);

    return h(
      "div",
      { className: "preview-shell" },
      h(
        "div",
        { className: "preview-toolbar", role: "tablist", "aria-label": "Aperçu responsive" },
        ["mobile", "tablet", "desktop"].map(function (w) {
          return h(
            "button",
            {
              key: w,
              type: "button",
              role: "tab",
              "aria-selected": w === width,
              className: "preview-tab" + (w === width ? " is-active" : ""),
              onClick: function () { setWidth(w); },
            },
            WIDTH_LABELS[w] + "  (" + WIDTHS[w] + "px)"
          );
        })
      ),
      h(
        "div",
        { className: "preview-frame", style: { maxWidth: maxWidth + "px" } },
        h(
          "article",
          { className: "preview-article" },
          dateStr && !tool
            ? h("p", { className: "preview-date" }, dateStr.toUpperCase())
            : null,
          h("h1", null, title || "(sans titre)"),
          excerpt ? h("p", { className: "preview-excerpt" }, excerpt) : null,
          tool
            ? h(
                "div",
                { className: "preview-tool-placeholder" },
                h("strong", null, "↳ Outil interactif inséré ici"),
                "à la position du marqueur ",
                h("code", null, "<!-- calculator -->"),
                " (rendu uniquement sur le site)."
              )
            : null,
          h("hr"),
          h("div", { className: "preview-body" }, props.widgetFor("body"))
        )
      )
    );
  }

  CMS.registerPreviewTemplate("blog", BlogPreview);
})();
