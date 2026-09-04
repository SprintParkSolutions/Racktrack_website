import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/article-dcim-vs-physical-reality-why-the-gap-matters.html";
const { document } = loadPage(REL_PATH);

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: header nav, dropdown icons/chevrons, Resources marked current", () => {
  assertHeaderNav(document, "Resources");
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: top-level sections (hero, hero photo, article body, cta)", () => {
  assertTopLevelSections(document, [
    "section.art-hero",
    "figure.art-hero-fig",
    "article",
    "section.rs-cta",
  ]);
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: has an all-articles back link to the Resources hub", () => {
  const back = document.querySelector(".art-back");
  assert.ok(back, "article must have a back link to Resources");
  assert.equal(back.getAttribute("href"), "resources.html");
});

test("article-dcim-vs-physical-reality-why-the-gap-matters.html: has related-article links", () => {
  const related = document.querySelectorAll(".art-more-item");
  assert.ok(related.length > 0, "article must link to at least one related piece");
});
