import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "../helpers/dom.mjs";
import {
  assertBasicMeta, assertHeaderNav, assertFooter,
  assertImagesHaveAlt, assertLocalLinksResolve,
  assertTopLevelSections, assertCacheBustedStylesheet,
} from "../helpers/assertions.mjs";

const REL_PATH = "pages/use-case-m-a-migration-teams.html";
const { document } = loadPage(REL_PATH);

test("use-case-m-a-migration-teams.html: basic meta (title, description, single h1)", () => {
  assertBasicMeta(document);
});

test("use-case-m-a-migration-teams.html: header nav, dropdown icons/chevrons, Use Cases marked current", () => {
  assertHeaderNav(document, "Use Cases");
});

test("use-case-m-a-migration-teams.html: footer present with Platform/Company/Contact columns", () => {
  assertFooter(document);
});

test("use-case-m-a-migration-teams.html: every image has an alt attribute", () => {
  assertImagesHaveAlt(document);
});

test("use-case-m-a-migration-teams.html: every local href/src resolves to a real file", () => {
  assertLocalLinksResolve(document, REL_PATH);
});

test("use-case-m-a-migration-teams.html: stylesheet is cache-busted", () => {
  assertCacheBustedStylesheet(document);
});

test("use-case-m-a-migration-teams.html: top-level sections (hero, article, closing band, cta)", () => {
  assertTopLevelSections(document, [
    "section.cd-hero",
    "article.cd-article",
    "figure.cd-close",
    "section.cd-cta",
  ]);
});

test("use-case-m-a-migration-teams.html: sidebar links to the other 5 role pages, not itself", () => {
  const links = Array.from(document.querySelectorAll(".cd-aside a")).map((a) => a.getAttribute("href"));
  assert.equal(links.length, 5, `expected 5 other-role links, found ${links.length}: ${links.join(", ")}`);
  assert.ok(!links.includes("use-case-m-a-migration-teams.html"), "sidebar must not link to its own page");
});

test("use-case-m-a-migration-teams.html: how-it-works steps list has 5 entries", () => {
  const steps = document.querySelectorAll(".cd-steps li");
  assert.equal(steps.length, 5, `expected 5 steps, found ${steps.length}`);
});
