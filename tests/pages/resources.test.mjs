import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/resources.html";
const { document } = loadPage(REL_PATH);

test("resources.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("resources.html: header nav, dropdown icons/chevrons, Resources marked current", () => {
  assertHeaderNav(document, "Resources");
});

test("resources.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("resources.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("resources.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("resources.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("resources.html: top-level sections (hero, featured, catalog, cta)", () => {
  assertTopLevelSections(document, [
    "section.rs-hero",
    "section.rs-featured",
    "section.rs-catalog",
    "section.rs-cta",
  ]);
});

// The hub deliberately carries only the four articles the Resources nav
// dropdown promotes, rather than every article file. The lead story appears
// twice on purpose — once in the featured band, once in the library — so the
// library itself lists all four. The other five articles stay reachable
// through the related-article lists at the foot of each article page.
test("resources.html: the hub carries exactly the four articles the navbar promotes", () => {
  const navArticles = Array.from(
    document.querySelectorAll('.nav-item .nav-dropdown a[href^="article-"]')
  ).map((a) => a.getAttribute("href"));
  assert.equal(navArticles.length, 4, "expected 4 articles in the Resources nav dropdown");

  const featured = document.querySelector(".rs-feat-h a").getAttribute("href");
  const library = Array.from(document.querySelectorAll(".rs-index-card h3 a")).map((a) =>
    a.getAttribute("href")
  );
  assert.deepEqual(
    [...new Set([featured, ...library])].sort(),
    [...navArticles].sort(),
    "featured + library articles must match the navbar dropdown exactly"
  );
  assert.deepEqual(
    [...library].sort(),
    [...navArticles].sort(),
    "the library must list all four navbar articles, the featured one included"
  );
});

test("resources.html: category filters cover exactly the categories present", () => {
  const filters = Array.from(document.querySelectorAll(".rs-tab")).map((t) => t.dataset.filter);
  const categories = new Set(
    Array.from(document.querySelectorAll(".rs-index-card")).map((c) => c.dataset.category)
  );
  assert.deepEqual(filters, ["all", ...[...categories]], "filters must be 'all' plus each category once");
  assert.match(
    document.querySelector("#rs-count").textContent,
    new RegExp(`^${document.querySelectorAll(".rs-index-card").length} articles? shown$`),
    "the count badge must state the real number of library rows"
  );
});
