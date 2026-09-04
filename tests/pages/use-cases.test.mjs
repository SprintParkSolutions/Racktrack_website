import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/use-cases.html";
const { document } = loadPage(REL_PATH);

test("use-cases.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("use-cases.html: header nav, dropdown icons/chevrons, Use Cases marked current", () => {
  assertHeaderNav(document, "Use Cases");
});

test("use-cases.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("use-cases.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("use-cases.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("use-cases.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("use-cases.html: top-level sections (opening, roles, close)", () => {
  assertTopLevelSections(document, [
    "section.uc-opening",
    "section.uc-roles",
    "section.uc-close",
  ]);
});

test("use-cases.html: role grid links to all 6 role detail pages", () => {
  const links = new Set(
    Array.from(document.querySelectorAll('.uc-grid a[href^="use-case-"]')).map((a) => a.getAttribute("href"))
  );
  assert.equal(links.size, 6, `expected 6 role detail links, found ${links.size}: ${[...links].join(", ")}`);
});

test("use-cases.html: hero has the 6 role tag chips foreshadowing the filmstrip", () => {
  const tags = document.querySelectorAll(".uc-opening-tag");
  assert.equal(tags.length, 6, `expected 6 opening tag chips, found ${tags.length}`);
});
