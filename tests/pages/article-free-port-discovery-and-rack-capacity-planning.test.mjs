import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/article-free-port-discovery-and-rack-capacity-planning.html";
const { document } = loadPage(REL_PATH);

test("article-free-port-discovery-and-rack-capacity-planning.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: header nav, dropdown icons/chevrons, Resources marked current", () => {
  assertHeaderNav(document, "Resources");
});

test("article-free-port-discovery-and-rack-capacity-planning.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: top-level sections (hero, hero photo, article body, cta)", () => {
  assertTopLevelSections(document, [
    "section.art-hero",
    "figure.art-hero-fig",
    "article",
    "section.rs-cta",
  ]);
});

test("article-free-port-discovery-and-rack-capacity-planning.html: has an all-articles back link to the Resources hub", () => {
  const back = document.querySelector(".art-back");
  assert.ok(back, "article must have a back link to Resources");
  assert.equal(back.getAttribute("href"), "resources.html");
});

test("article-free-port-discovery-and-rack-capacity-planning.html: has related-article links", () => {
  const related = document.querySelectorAll(".art-more-item");
  assert.ok(related.length > 0, "article must link to at least one related piece");
});
