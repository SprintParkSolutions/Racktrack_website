import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/article-why-infrastructure-records-are-wrong.html";
const { document } = loadPage(REL_PATH);

test("article-why-infrastructure-records-are-wrong.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("article-why-infrastructure-records-are-wrong.html: header nav, dropdown icons/chevrons, Resources marked current", () => {
  assertHeaderNav(document, "Resources");
});

test("article-why-infrastructure-records-are-wrong.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("article-why-infrastructure-records-are-wrong.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("article-why-infrastructure-records-are-wrong.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("article-why-infrastructure-records-are-wrong.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("article-why-infrastructure-records-are-wrong.html: top-level sections (article body, cta)", () => {
  assertTopLevelSections(document, [
    "article.ap-article",
    "section.rs-cta",
  ]);
});

test("article-why-infrastructure-records-are-wrong.html: table of contents is present", () => {
  assert.ok(document.querySelector(".ap-toc"), "article must have a table of contents");
});

test("article-why-infrastructure-records-are-wrong.html: has related-article links", () => {
  const related = document.querySelectorAll(".ap-related-grid a");
  assert.ok(related.length > 0, "article must link to at least one related piece");
});
