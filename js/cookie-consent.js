const STORAGE_KEY = "rt-cookie-choice";

function init() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const onPagesDir = location.pathname.includes("/pages/");
  const trustHref = onPagesDir ? "trust-security.html" : "pages/trust-security.html";

  const banner = document.createElement("div");
  banner.className = "cookie-consent";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `
    <p>
      We use cookies for website analytics and to understand how visitors use RackTrack.
      More information is available in our <a href="${trustHref}">Trust &amp; Security</a> page.
    </p>
    <p>If you decline, we'll only store a single cookie to remember your choice.</p>
    <div class="cookie-consent-actions">
      <a class="cookie-consent-settings" href="${trustHref}">Cookie settings</a>
      <button type="button" class="cookie-consent-decline">Decline</button>
      <button type="button" class="cookie-consent-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  requestAnimationFrame(() => banner.classList.add("is-visible"));

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove("is-visible");
    banner.addEventListener("transitionend", () => banner.remove(), { once: true });
  }

  banner.querySelector(".cookie-consent-accept").addEventListener("click", () => dismiss("accepted"));
  banner.querySelector(".cookie-consent-decline").addEventListener("click", () => dismiss("declined"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
