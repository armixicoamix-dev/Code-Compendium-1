import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { WriteFromScratchExercise } from "@/data/curriculum";
import { WEB_DOCS } from "@/data/web-curriculum";
import { HintBox } from "@/components/HintBox";
import { ExplanationBox } from "@/components/ExplanationBox";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, ArrowRight, PenTool, Info, Sparkles,
  BookOpen, ChevronDown, ChevronUp,
} from "lucide-react";

function buildPreviewDoc(html: string, css: string, js: string): string {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*,*::before,*::after{box-sizing:border-box}</style><style>${css}</style></head><body>${html}<script>(function(){var m=['log','warn','error','info'];m.forEach(function(k){var o=console[k].bind(console);console[k]=function(){var a=Array.prototype.slice.call(arguments).map(function(x){try{return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}});window.parent.postMessage({type:'console',method:k,args:a},'*');o.apply(console,arguments)}});window.addEventListener('error',function(e){window.parent.postMessage({type:'console',method:'error',args:[(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')]},'*')});window.addEventListener('unhandledrejection',function(e){window.parent.postMessage({type:'console',method:'error',args:['UnhandledRejection: '+(e.reason?.message||e.reason)]},'*')})})();<\/script><script>try{${js.replace(/<\/script>/gi, "<\\/script>")}}catch(e){window.parent.postMessage({type:'console',method:'error',args:[e.message]},'*')}<\/script></body></html>`;
}

type EditorTab = "html" | "css" | "js";

const TABS: { id: EditorTab; label: string; color: string; placeholder: string }[] = [
  { id: "html", label: "HTML", color: "#f97316", placeholder: "<!-- HTML-структура здесь -->" },
  { id: "css",  label: "CSS",  color: "#3b82f6", placeholder: "/* Стили здесь */" },
  { id: "js",   label: "JS",   color: "#eab308", placeholder: "// JavaScript здесь" },
];

// ── Smart multi-strategy keyword matcher ─────────────────────────────────────
function normalizeCSS(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, " ")   // strip block comments
    .replace(/\s*([:;{},>~+])\s*/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim();
}

// Synonym map: if required keyword is a key, any of its synonyms also counts as a match.
// Covers common JS/HTML/CSS patterns where multiple correct approaches exist.
const SYNONYMS: Record<string, string[]> = {
  // ── Variable declarations ──────────────────────────────────────────────
  "let ":         ["var ", "const "],
  "var ":         ["let ", "const "],
  "const ":       ["let ", "var "],

  // ── Text / innerHTML ───────────────────────────────────────────────────
  "textContent":  ["innerText", "innerHTML", ".text("],
  "innerText":    ["textContent", "innerHTML"],
  "innerHTML":    ["textContent", "innerText", "insertAdjacentHTML"],
  "insertAdjacentHTML": ["innerHTML +=", "innerHTML="],

  // ── DOM selection ──────────────────────────────────────────────────────
  "querySelector":        ["getElementById", "getElementsByClassName", "getElementsByTagName", "querySelectorAll", "getElement"],
  "querySelectorAll":     ["getElementsByClassName", "getElementsByTagName", "querySelector"],
  "getElementById":       ["querySelector", "querySelectorAll", "getElementsByName"],
  "getElementsByClassName": ["querySelector", "querySelectorAll"],
  "getElementsByTagName": ["querySelector", "querySelectorAll"],

  // ── Event handling ─────────────────────────────────────────────────────
  "addEventListener":     ["onclick", "onmousedown", "onkeydown", "onkeyup", "onkeypress", "on('click'", "on(\"click\"", "onchange", "onsubmit", "oninput"],
  "onclick":              ["addEventListener('click'", 'addEventListener("click"', "addEventListener(`click`"],
  "onchange":             ["addEventListener('change'", 'addEventListener("change"'],
  "onkeyup":              ["addEventListener('keyup'", 'addEventListener("keyup"', "addEventListener('keydown'"],
  "onkeydown":            ["addEventListener('keydown'", 'addEventListener("keydown"', "addEventListener('keyup'"],
  "onsubmit":             ["addEventListener('submit'", 'addEventListener("submit"'],
  "oninput":              ["addEventListener('input'", 'addEventListener("input"'],

  // ── Event object ───────────────────────────────────────────────────────
  "e.preventDefault":     ["event.preventDefault", "evt.preventDefault", "ev.preventDefault"],
  "e.target":             ["event.target", "evt.target", "this", "ev.target"],
  "e.key":                ["event.key", "event.keyCode", "e.keyCode"],
  "e.value":              ["event.target.value", "e.target.value"],
  "event.preventDefault": ["e.preventDefault", "evt.preventDefault"],
  "event.target":         ["e.target", "evt.target", "this"],

  // ── Named colors ↔ hex ↔ rgb ───────────────────────────────────────────
  "color:red":            ["color:#f00", "color:#ff0000", "color:rgb(255,0,0)", "color: red", "color: #f00", "color: #ff0000", "color: rgb(255,0,0)"],
  "color:blue":           ["color:#00f", "color:#0000ff", "color:rgb(0,0,255)", "color: blue", "color: #00f", "color: #0000ff"],
  "color:green":          ["color:#008000", "color:rgb(0,128,0)", "color: green", "color: #008000"],
  "color:white":          ["color:#fff", "color:#ffffff", "color:rgb(255,255,255)", "color: white", "color: #fff", "color: #ffffff"],
  "color:black":          ["color:#000", "color:#000000", "color:rgb(0,0,0)", "color: black", "color: #000", "color: #000000"],
  "color:yellow":         ["color:#ff0", "color:#ffff00", "color:rgb(255,255,0)", "color: yellow"],
  "color:orange":         ["color:#f90", "color:#ff9900", "color:rgb(255,153,0)", "color: orange"],
  "color:purple":         ["color:#800080", "color:rgb(128,0,128)", "color: purple"],
  "color:pink":           ["color:#ffc0cb", "color:rgb(255,192,203)", "color: pink"],
  "color:gray":           ["color:grey", "color: gray", "color: grey", "color:#808080"],
  "color:grey":           ["color:gray", "color: gray", "color: grey", "color:#808080"],

  // ── Background ────────────────────────────────────────────────────────
  "background-color":     ["background:"],
  "background:":          ["background-color:", "background :", "background-color :"],

  // ── JS style manipulation ──────────────────────────────────────────────
  "style.color":          ["style['color']", 'style["color"]', "style.backgroundColor"],
  "style.backgroundColor": ["style['backgroundColor']", 'style["backgroundColor"]', "style.background"],
  "style.display":        ["style['display']", 'style["display"]'],
  "style.fontSize":       ["style['fontSize']", 'style["fontSize"]', "style.font"],
  "style.width":          ["style['width']", 'style["width"]'],
  "style.height":         ["style['height']", 'style["height"]'],
  "style.visibility":     ["style['visibility']", 'style["visibility"]'],
  "style.opacity":        ["style['opacity']", 'style["opacity"]'],
  "style.transform":      ["style['transform']", 'style["transform"]'],

  // ── DOM creation/removal ───────────────────────────────────────────────
  "createElement":        ["innerHTML +=", "insertAdjacentHTML", "cloneNode"],
  "appendChild":          ["insertBefore", "prepend(", "append(", "innerHTML +="],
  "removeChild":          [".remove()", "parentNode.removeChild"],
  ".remove()":            ["removeChild", "parentElement.removeChild"],
  "prepend(":             ["insertBefore", "insertAdjacentHTML('afterbegin'"],
  "append(":              ["appendChild", "insertAdjacentHTML('beforeend'"],

  // ── Number conversion ──────────────────────────────────────────────────
  "parseInt":             ["Number(", "parseFloat", "+", "~~", "Math.floor(", "Math.round("],
  "parseFloat":           ["Number(", "parseInt", "+("],
  "Number(":              ["parseInt(", "parseFloat(", "+("],
  "isNaN(":               ["Number.isNaN(", "typeof"],
  "isFinite(":            ["Number.isFinite(", "!isNaN("],

  // ── Input value ────────────────────────────────────────────────────────
  ".value":               [".val()", ".getAttribute('value')", ".innerText"],
  "input.value":          ["e.target.value", "event.target.value", ".value"],
  "e.target.value":       ["event.target.value", "input.value"],

  // ── Array methods ──────────────────────────────────────────────────────
  "push(":                [".concat(", "= [...", "unshift(", "splice("],
  "pop()":                ["splice(-1", "slice(0,-1)"],
  "shift()":              ["splice(0,1)", "slice(1)"],
  "unshift(":             ["push(", "splice(0,0,"],
  "forEach":              ["for (", "for(", "for...of", "for (let"],
  "map(":                 ["forEach(", "for (", "[..."],
  "filter(":              ["forEach(", "for (", "reduce("],
  "reduce(":              ["forEach(", "for ("],
  "find(":                ["filter(", "findIndex("],
  "findIndex(":           ["indexOf(", "find("],
  "indexOf(":             ["includes(", "findIndex(", "search("],
  "includes(":            ["indexOf(", "has(", "in "],
  "some(":                ["find(", "every("],
  "every(":               ["some(", "find("],
  "splice(":              ["slice(", "push(", "pop("],
  "slice(":               ["splice(", "substring("],
  "sort(":                ["toSorted(", "localeCompare("],
  "reverse(":             ["toReversed("],
  "flat(":                ["flatMap(", "reduce("],
  "flatMap(":             ["flat(", "map("],
  "concat(":              ["push(", "spread", "[..."],
  "join(":                [".toString()", "reduce("],
  "Array.from(":          ["[..."],
  "Array.isArray(":       ["instanceof Array", "typeof"],

  // ── CSS display ───────────────────────────────────────────────────────
  "display:flex":         ["display:grid", "display: flex", "display: grid", "flex"],
  "display:grid":         ["display:flex", "display: grid", "display: flex"],
  "display:none":         ["visibility:hidden", "display: none", "visibility: hidden", "opacity:0"],
  "display:block":        ["display: block", "display:inline-block"],
  "display:inline":       ["display: inline", "display:inline-block"],
  "display:inline-block": ["display: inline-block", "display:inline"],

  // ── CSS flexbox ───────────────────────────────────────────────────────
  "flex-direction":       ["flex-flow", "flex-direction:"],
  "justify-content":      ["place-content", "justify-content:"],
  "align-items":          ["place-items", "place-content", "align-content"],
  "flex-wrap":            ["flex-flow", "wrap"],
  "flex-grow":            ["flex:", "flex-shrink"],
  "align-self":           ["align-items", "place-self"],
  "gap:":                 ["grid-gap:", "column-gap:", "row-gap:"],

  // ── CSS grid ──────────────────────────────────────────────────────────
  "grid-template-columns": ["grid-template:", "repeat(", "columns:"],
  "grid-template-rows":    ["grid-template:", "repeat("],
  "grid-template":         ["grid-template-columns", "grid-template-rows"],
  "grid-column":           ["grid-area:", "column-start"],
  "grid-row":              ["grid-area:", "row-start"],
  "grid-area":             ["grid-column", "grid-row"],

  // ── CSS positioning ───────────────────────────────────────────────────
  "position:absolute":    ["position: absolute"],
  "position:relative":    ["position: relative"],
  "position:fixed":       ["position: fixed"],
  "position:sticky":      ["position: sticky"],

  // ── CSS sizing ────────────────────────────────────────────────────────
  "width:":               ["width :", "max-width:", "min-width:"],
  "height:":              ["height :", "max-height:", "min-height:"],
  "max-width:":           ["width:", "min-width:"],
  "min-width:":           ["width:", "max-width:"],

  // ── CSS box model ─────────────────────────────────────────────────────
  "margin:":              ["margin :", "margin-top:", "margin-bottom:", "margin-left:", "margin-right:"],
  "padding:":             ["padding :", "padding-top:", "padding-bottom:", "padding-left:", "padding-right:"],
  "border:":              ["border :", "border-width:", "border-style:", "border-color:", "outline:"],
  "border-radius":        ["border-radius:", "rounded", "border-top-left-radius"],
  "box-shadow":           ["box-shadow:", "filter:drop-shadow", "text-shadow"],
  "outline:":             ["border:", "outline-style:"],
  "overflow:":            ["overflow-x:", "overflow-y:", "overflow: hidden"],

  // ── CSS typography ────────────────────────────────────────────────────
  "font-size:":           ["font:", "font-size :", "em", "rem"],
  "font-weight:":         ["font:", "font-weight :", "bold"],
  "font-family:":         ["font:", "font-family :", "typeface"],
  "text-align:":          ["text-align :", "text-align:center"],
  "line-height:":         ["line-height :", "leading"],
  "text-decoration":      ["text-decoration-line", "underline", "line-through"],
  "text-transform":       ["text-transform:", "uppercase", "lowercase", "capitalize"],
  "letter-spacing":       ["letter-spacing:", "word-spacing:"],

  // ── CSS visual ────────────────────────────────────────────────────────
  "opacity:":             ["opacity :", "rgba(", "visibility:"],
  "visibility:hidden":    ["display:none", "opacity:0"],
  "visibility:visible":   ["display:block", "opacity:1"],
  "cursor:pointer":       ["cursor: pointer"],
  "cursor:default":       ["cursor: default"],
  "cursor:not-allowed":   ["cursor: not-allowed", "pointer-events:none"],
  "pointer-events:none":  ["cursor:not-allowed"],
  "z-index:":             ["z-index :", "layer"],
  "transform:":           ["transform :", "translate(", "rotate(", "scale("],
  "transition:":          ["transition :", "animation:", "transition-duration:"],
  "animation:":           ["transition:", "@keyframes"],
  "@keyframes":           ["animation:", "transition:"],
  "filter:":              ["filter :", "blur(", "brightness(", "contrast("],
  "object-fit:":          ["object-fit :", "contain", "cover"],

  // ── CSS custom properties ─────────────────────────────────────────────
  "--":                   ["var(--", "css variable"],
  "var(--":               ["--"],

  // ── HTML form elements ────────────────────────────────────────────────
  "<form":                ["<Form", "<form "],
  "<input":               ["<Input", "<input "],
  "<button":              ["<Button", "<button "],
  "<select":              ["<Select", "<select "],
  "<option":              ["<Option", "<option "],
  "<textarea":            ["<Textarea", "<textarea "],
  "<label":               ["<Label", "<label "],
  "<fieldset":            ["<Fieldset", "<fieldset "],

  // ── HTML semantic elements ────────────────────────────────────────────
  "<main":                ["<div class=\"main\"", "<div id=\"main\"", "<div class='main'"],
  "<header":              ["<div class=\"header\"", "<div id=\"header\"", "<div class='header'"],
  "<footer":              ["<div class=\"footer\"", "<div id=\"footer\"", "<div class='footer'"],
  "<nav":                 ["<div class=\"nav\"", "<div id=\"nav\"", "<div class='nav'"],
  "<section":             ["<div class=\"section\"", "<article", "<div class='section'"],
  "<article":             ["<section", "<div class=\"article\"", "<div class='article'"],
  "<aside":               ["<div class=\"aside\"", "<div class='aside'"],
  "<figure":              ["<div class=\"figure\"", "<img"],
  "<figcaption":          ["<caption", "<p"],
  "<details":             ["<div class=\"details\""],
  "<summary":             ["<h3", "<p"],

  // ── HTML table ────────────────────────────────────────────────────────
  "<table":               ["<Table", "<table "],
  "<thead":               ["<tr class=\"header\"", "<th"],
  "<tbody":               ["<tr"],
  "<tr":                  ["<tr "],
  "<td":                  ["<td "],
  "<th":                  ["<th "],

  // ── HTML metadata ─────────────────────────────────────────────────────
  "<meta":                ["<meta "],
  "<link":                ["<link "],
  "<script":              ["<script "],
  "<style":               ["<style "],
  "<title":               ["<title>"],

  // ── Class manipulation ────────────────────────────────────────────────
  "classList.add":        ["className +=", "setAttribute('class'", "setAttribute(\"class\""],
  "classList.remove":     ["className.replace", "setAttribute('class'", "setAttribute(\"class\""],
  "classList.toggle":     ["classList.add", "classList.remove"],
  "classList.contains":   ["className.includes(", "getAttribute('class')"],
  "className":            ["getAttribute('class')", "classList.add"],
  "setAttribute":         ["classList.add", "dataset."],

  // ── Fetch / async ─────────────────────────────────────────────────────
  "async function":       ["function async", "const fn = async", "async () =>"],
  "async () =>":          ["async function", "function async"],
  "await fetch":          ["fetch(", ".then(", "axios.get"],
  "fetch(":              ["XMLHttpRequest", "axios.get", "await fetch", "axios.post"],
  ".then(":              ["await ", "async function"],
  ".catch(":             ["try {", "try{"],
  "Promise":             [".then(", "async function"],

  // ── localStorage / sessionStorage ─────────────────────────────────────
  "localStorage.setItem": ["localStorage.set", "localStorage[", "sessionStorage.setItem"],
  "localStorage.getItem": ["localStorage.get", "localStorage[", "sessionStorage.getItem"],
  "localStorage.removeItem": ["delete localStorage[", "sessionStorage.removeItem"],
  "localStorage.clear":   ["sessionStorage.clear"],
  "sessionStorage":       ["localStorage"],

  // ── Count / score variables ────────────────────────────────────────────
  "count":                ["counter", "clicks", "score", "n", "num", "total", "tally", "points", "value", "amount"],
  "counter":              ["count", "clicks", "score", "num", "total"],
  "clicks":               ["count", "counter", "score"],
  "score":                ["count", "counter", "points", "total"],

  // ── Template literals ─────────────────────────────────────────────────
  "`${":                  ['" + ', "' + "],
  "` ":                   ["\" + "],

  // ── Arrow functions ───────────────────────────────────────────────────
  "() =>":                ["function()", "function ()"],
  "(e) =>":               ["function(e)", "function (e)", "(event) =>", "e => "],
  "(event) =>":           ["function(event)", "(e) =>", "e => "],
  "(x) =>":               ["function(x)", "x => "],
  "(i) =>":               ["function(i)", "i => "],

  // ── String methods ────────────────────────────────────────────────────
  "trim()":               [".replace(/^\\s+|\\s+$/g,", ".trimStart()", ".trimEnd()"],
  "trimStart()":          ["trim()", ".replace(/^\\s+/"],
  "trimEnd()":            ["trim()", ".replace(/\\s+$/"],
  "startsWith(":          ["indexOf( === 0", "charAt(0)"],
  "endsWith(":            ["lastIndexOf(", "slice(-"],
  "replace(":             ["replaceAll(", "split(", "match("],
  "replaceAll(":          ["replace(", "split(", "matchAll("],
  "split(":               ["replace(", "match("],
  "substring(":           ["slice(", "substr("],
  "toUpperCase()":        ["toLocaleUpperCase()"],
  "toLowerCase()":        ["toLocaleLowerCase()"],
  "padStart(":            ["padEnd(", "repeat("],
  "padEnd(":              ["padStart(", "repeat("],
  "repeat(":              ["padStart(", "padEnd("],
  "charCodeAt(":          ["codePointAt("],
  "String.fromCharCode(": ["String.fromCodePoint("],

  // ── Math ──────────────────────────────────────────────────────────────
  "Math.floor(":          ["Math.round(", "Math.ceil(", "parseInt(", "~~"],
  "Math.round(":          ["Math.floor(", "Math.ceil(", "toFixed("],
  "Math.ceil(":           ["Math.floor(", "Math.round("],
  "Math.random()":        ["Math.floor(Math.random()", "crypto.getRandomValues"],
  "Math.abs(":            ["Math.sign("],
  "Math.max(":            ["Math.min(", "sort("],
  "Math.min(":            ["Math.max(", "sort("],
  "Math.pow(":            ["**", "Math.sqrt("],
  "Math.sqrt(":           ["Math.pow(", "**0.5"],

  // ── Objects ───────────────────────────────────────────────────────────
  "Object.keys(":         ["Object.values(", "Object.entries(", "for...in"],
  "Object.values(":       ["Object.keys(", "Object.entries("],
  "Object.entries(":      ["Object.keys(", "Object.values(", "for...in"],
  "Object.assign(":       ["{ ..."],
  "Object.freeze(":       ["Object.seal("],
  "JSON.stringify(":      ["JSON.parse("],
  "JSON.parse(":          ["JSON.stringify("],

  // ── Conditional ───────────────────────────────────────────────────────
  "? ":                   ["if (", "if("],
  "if (":                 ["if(", "switch ("],
  "switch (":             ["if (", "if("],

  // ── Timing ───────────────────────────────────────────────────────────
  "setTimeout":           ["setInterval", "requestAnimationFrame"],
  "setInterval":          ["setTimeout", "requestAnimationFrame"],
  "clearTimeout":         ["clearInterval"],
  "clearInterval":        ["clearTimeout"],
  "requestAnimationFrame": ["setInterval", "setTimeout"],

  // ── Dataset ───────────────────────────────────────────────────────────
  "dataset.":             [".getAttribute('data-", ".getAttribute(\"data-"],
  ".getAttribute(":       ["dataset.", ".dataset."],
  ".setAttribute(":       ["dataset.", ".dataset."],

  // ── Console ───────────────────────────────────────────────────────────
  "console.log(":         ["console.warn(", "console.error(", "console.info(", "alert(", "document.write("],
  "console.error(":       ["console.log(", "console.warn("],
  "console.warn(":        ["console.log(", "console.error("],

  // ── Document / window ─────────────────────────────────────────────────
  "document.getElementById": ["document.querySelector", "document.querySelectorAll"],
  "document.querySelector":  ["document.getElementById", "document.querySelectorAll"],
  "document.createElement":  ["document.querySelector", "innerHTML +="],
  "window.location":         ["location.href", "history.pushState"],
  "window.history":          ["history.back()", "history.pushState"],
  "window.scroll":           ["scrollTo(", "scrollBy("],
  "window.addEventListener": ["document.addEventListener"],
  "window.onload":           ["DOMContentLoaded", "window.addEventListener('load'"],
  "DOMContentLoaded":        ["window.onload", "window.addEventListener('load'"],

  // ── CSS media queries ─────────────────────────────────────────────────
  "@media":               ["@container", "matchMedia("],
  "max-width":            ["min-width", "@media", "clamp("],
  "min-width":            ["max-width", "@media"],

  // ── CSS pseudo-classes ────────────────────────────────────────────────
  ":hover":               [":focus", ":active", "mouseenter"],
  ":focus":               [":hover", ":focus-visible", ":focus-within"],
  ":active":              [":hover", ":focus"],
  ":nth-child":           [":nth-of-type", ":first-child", ":last-child"],
  ":first-child":         [":first-of-type", ":nth-child(1)"],
  ":last-child":          [":last-of-type", ":nth-child(last)"],
  ":not(":                [":is(", ":where("],
  "::before":             ["::after"],
  "::after":              ["::before"],

  // ── CSS variables / calc ──────────────────────────────────────────────
  "calc(":                ["min(", "max(", "clamp("],
  "clamp(":               ["calc(", "min(", "max("],
  "min(":                 ["max(", "clamp(", "calc("],
  "max(":                 ["min(", "clamp(", "calc("],
};

function smartMatch(combined: string, kw: string): boolean {
  // 1. Direct exact match (fastest)
  if (combined.includes(kw)) return true;

  // 2. Case-insensitive (HTML tags are case-insensitive, CSS property names too)
  const lcCode = combined.toLowerCase();
  const lcKw   = kw.toLowerCase();
  if (lcCode.includes(lcKw)) return true;

  // 3. CSS/HTML whitespace normalisation: remove spaces around : ; { } , > ~ +
  const normCode = normalizeCSS(combined);
  const normKw   = normalizeCSS(kw);
  if (normCode.includes(normKw)) return true;
  if (normCode.toLowerCase().includes(normKw.toLowerCase())) return true;

  // 4. Quote style variations: 'x' ↔ "x"
  const kwSingle = kw.replace(/"/g, "'");
  const kwDouble = kw.replace(/'/g, '"');
  if (kwSingle !== kw) {
    if (combined.includes(kwSingle)) return true;
    if (lcCode.includes(kwSingle.toLowerCase())) return true;
  }
  if (kwDouble !== kw) {
    if (combined.includes(kwDouble)) return true;
    if (lcCode.includes(kwDouble.toLowerCase())) return true;
  }

  // 5. Optional trailing semicolon (CSS/JS)
  if (kw.endsWith(";")) {
    const kwNoSemi = kw.slice(0, -1);
    if (combined.includes(kwNoSemi)) return true;
    if (lcCode.includes(kwNoSemi.toLowerCase())) return true;
    const normNoSemi = normalizeCSS(kwNoSemi);
    if (normCode.includes(normNoSemi)) return true;
    if (normCode.toLowerCase().includes(normNoSemi.toLowerCase())) return true;
  }

  // 6. Open tag matching: <div> should match <div class="...">, <div id="...">
  if (/^<[a-z][a-z0-9]*>$/i.test(kw)) {
    const tagName = kw.slice(1, -1);
    if (new RegExp(`<${tagName}[\\s>/]`, "i").test(combined)) return true;
  }

  // 7. CSS property check without value: e.g. "display" matches "display:flex"
  //    Only if kw is a bare word (no special chars)
  if (/^[a-z-]+$/.test(kw) && kw.length > 3) {
    // Match it as a CSS property name (preceded by newline/{ or ; and followed by :)
    if (new RegExp(`(?:^|[{;\\n])\\s*${lcKw}\\s*:`, "i").test(combined)) return true;
  }

  // 8. Numeric value flexibility: "16px" matches "16 px" and vice-versa
  const kwNoSpace = kw.replace(/(\d)\s+(px|em|rem|vh|vw|%)/gi, "$1$2");
  if (kwNoSpace !== kw && combined.includes(kwNoSpace)) return true;

  // 9. Synonym matching — check all synonyms for this keyword
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    // If the required kw matches the synonym key, check if any synonym appears in code
    if (lcKw.includes(key.toLowerCase()) || key.toLowerCase().includes(lcKw)) {
      for (const syn of syns) {
        if (lcCode.includes(syn.toLowerCase())) return true;
      }
    }
    // If the required kw IS one of the synonyms, check if the key appears in code
    if (syns.some((s) => s.toLowerCase() === lcKw)) {
      if (lcCode.includes(key.toLowerCase())) return true;
      for (const s of syns) {
        if (s.toLowerCase() !== lcKw && lcCode.includes(s.toLowerCase())) return true;
      }
    }
  }

  // 10. Flexible JS variable pattern: "let count" matches "let counter", "var count", "const clicks"
  //     Handles: the variable name may differ slightly (e.g. count vs counter vs clicks)
  const varMatch = kw.match(/^(let|var|const)\s+(\w+)$/i);
  if (varMatch) {
    const [, , varName] = varMatch;
    // Accept any var/let/const declaration with a similar name
    if (new RegExp(`(?:let|var|const)\\s+${varName}\\b`, "i").test(combined)) return true;
    // Also accept if the variable is used anywhere (it might be declared differently)
    if (new RegExp(`\\b${varName}\\b`, "i").test(combined) &&
        /(?:let|var|const)\s+\w+/.test(combined)) return true;
  }

  // 11. CSS value shorthand: "padding: 0" matches "padding:0", "padding: 0px", "padding:0px"
  const cssPropVal = kw.match(/^([\w-]+)\s*:\s*(.+)$/);
  if (cssPropVal) {
    const [, prop, val] = cssPropVal;
    const patterns = [
      `${prop}:${val}`,
      `${prop}: ${val}`,
      `${prop}:${val}px`,
      `${prop}: ${val}px`,
      `${prop}:${val}rem`,
      `${prop}: ${val}rem`,
    ];
    if (patterns.some((p) => lcCode.includes(p.toLowerCase()))) return true;
  }

  return false;
}

function gradeWeb(
  html: string, css: string, js: string, ex: WriteFromScratchExercise
) {
  const combined = [html, css, js].join("\n");
  const nonEmpty = combined
    .split("\n")
    .filter((l) => {
      const t = l.trim();
      return t && !t.startsWith("//") && !t.startsWith("/*") && !t.startsWith("*") && t !== "*/" && t !== "{" && t !== "}";
    })
    .length;
  const hits   = ex.required.filter((kw) => smartMatch(combined, kw));
  const missing = ex.required.filter((kw) => !smartMatch(combined, kw));
  return {
    earned: hits.length,
    maxScore: ex.required.length,
    hasMinLines: nonEmpty >= ex.minLines,
    nonEmpty,
    missing,
  };
}

function serialize(html: string, css: string, js: string): string {
  return JSON.stringify({ html, css, js });
}

function deserialize(s?: string): { html: string; css: string; js: string } {
  try {
    const v = JSON.parse(s ?? "{}");
    return { html: v.html ?? "", css: v.css ?? "", js: v.js ?? "" };
  } catch {
    return { html: "", css: "", js: "" };
  }
}

export function ExerciseWriteWeb({
  exercise,
  onComplete,
  initialCode,
  onInputChange,
}: {
  exercise: WriteFromScratchExercise;
  onComplete: (score: number, max: number, meta: { hintsRevealed: number; input?: string }) => void;
  initialCode?: string;
  onInputChange?: (code: string) => void;
}) {
  const init = deserialize(initialCode);
  const [html, setHtml] = useState(init.html);
  const [css, setCss]   = useState(init.css);
  const [js,  setJs]    = useState(init.js);
  const [activeTab, setActiveTab] = useState<EditorTab>("html");
  const [previewSrc, setPreviewSrc] = useState("");
  const [checked, setChecked] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showDoc, setShowDoc] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const docSection = useMemo(
    () => exercise.docRef ? WEB_DOCS.find((s) => s.id === exercise.docRef) ?? null : null,
    [exercise.docRef]
  );

  const refresh = useCallback(() => {
    setPreviewSrc(buildPreviewDoc(html, css, js));
  }, [html, css, js]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(refresh, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [html, css, js, refresh]);

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setCode = (tab: EditorTab, val: string) => {
    const nextHtml = tab === "html" ? val : html;
    const nextCss  = tab === "css"  ? val : css;
    const nextJs   = tab === "js"   ? val : js;
    if (tab === "html") setHtml(val);
    else if (tab === "css") setCss(val);
    else setJs(val);
    onInputChange?.(serialize(nextHtml, nextCss, nextJs));
    if (checked) setChecked(false);
  };

  const result = useMemo(
    () => (checked ? gradeWeb(html, css, js, exercise) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checked]
  );

  const onCheck = () => setChecked(true);

  const onNext = () => {
    const r = gradeWeb(html, css, js, exercise);
    onComplete(r.earned, r.maxScore, {
      hintsRevealed,
      input: serialize(html, css, js),
    });
  };

  const scoreColor = !result ? ""
    : result.earned === result.maxScore
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : result.earned >= Math.ceil(result.maxScore / 2)
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-rose-500/10 text-rose-400 border-rose-500/30";

  const currentCode = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const currentTab  = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-orange-500/15 text-orange-400 grid place-items-center flex-shrink-0">
          <PenTool className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-orange-400 mb-1">
            Напиши с нуля — HTML · CSS · JS
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
          {exercise.task}
        </p>

        {exercise.required.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-orange-400" />
              В решении должно быть:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.required.map((kw) => (
                <code
                  key={kw}
                  className={`px-2 py-0.5 rounded text-xs border font-mono transition-colors ${
                    checked && result
                      ? result.missing.includes(kw)
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  }`}
                >
                  {kw}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* ── docRef methodology panel ── */}
        {docSection && (
          <div className="border-t border-border/50 pt-3">
            <button
              onClick={() => setShowDoc((p) => !p)}
              className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
              📖 Методичка: {docSection.title}
              {showDoc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {showDoc && (
              <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                {(() => {
                  const lines = docSection.body.split("\n");
                  const els: React.ReactNode[] = [];
                  let inCode = false;
                  let codeLines: string[] = [];
                  lines.forEach((line, i) => {
                    if (line.startsWith("```")) {
                      if (!inCode) { inCode = true; codeLines = []; }
                      else {
                        els.push(
                          <pre key={i} className="bg-black/40 rounded-lg p-3 overflow-x-auto text-xs font-mono text-emerald-300 my-1">
                            <code>{codeLines.join("\n")}</code>
                          </pre>
                        );
                        inCode = false; codeLines = [];
                      }
                      return;
                    }
                    if (inCode) { codeLines.push(line); return; }
                    if (line.startsWith("━") || line.trim() === "") { els.push(<br key={i} />); return; }
                    if (line.startsWith("• ")) {
                      els.push(<li key={i} className="ml-4 list-disc">{line.slice(2)}</li>);
                      return;
                    }
                    if (/^[❌✅💡🔍👂➕🚀🐛📦🎨🌈🔄🔢🧹🐞📋✏️👂━]/.test(line) && line.length < 80) {
                      els.push(<p key={i} className="font-semibold text-foreground mt-3">{line}</p>);
                      return;
                    }
                    els.push(<p key={i}>{line}</p>);
                  });
                  return els;
                })()}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          Пиши в вкладках HTML / CSS / JS. Предпросмотр справа обновляется в реальном времени.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl border border-border overflow-hidden flex flex-col"
          style={{ minHeight: 360 }}
        >
          <div className="flex bg-muted/30 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 px-3 py-2 text-sm font-mono font-semibold transition-colors border-b-2 ${
                  activeTab === t.id
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
                style={{ borderBottomColor: activeTab === t.id ? t.color : "transparent" }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            value={currentCode}
            onChange={(e) => setCode(activeTab, e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={currentTab.placeholder}
            className="flex-1 bg-[#0d1117] text-[#e6edf3] font-mono text-sm p-4 resize-none outline-none w-full"
            style={{ minHeight: 320, tabSize: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const ta = e.currentTarget;
                const s = ta.selectionStart;
                const end = ta.selectionEnd;
                const nv = currentCode.slice(0, s) + "  " + currentCode.slice(end);
                setCode(activeTab, nv);
                requestAnimationFrame(() => {
                  ta.selectionStart = ta.selectionEnd = s + 2;
                });
              }
            }}
          />
        </div>

        <div
          className="rounded-xl border border-border overflow-hidden flex flex-col"
          style={{ minHeight: 360 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Живой предпросмотр
          </div>
          <iframe
            srcDoc={previewSrc}
            sandbox="allow-scripts"
            className="flex-1 w-full bg-white"
            style={{ minHeight: 320, border: "none" }}
            title="preview"
          />
        </div>
      </div>

      <HintBox
        hints={exercise.hints}
        label="Подсказки"
        onHintReveal={(n) => setHintsRevealed(n)}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={onCheck} data-testid="button-check-write">
          Проверить
        </Button>

        {checked && result && (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${scoreColor}`}
            >
              {result.earned === result.maxScore ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {result.earned} / {result.maxScore} ключевых слов
            </div>
            <Button onClick={onCheck} variant="outline" size="sm">
              Перепроверить
            </Button>
            <Button onClick={onNext} data-testid="button-next-write">
              Дальше <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {checked && result && result.missing.length > 0 && (
        <div className="rounded-xl border bg-muted/20 px-4 py-3 text-sm">
          <div className="text-xs text-muted-foreground mb-2">Не найдено в коде:</div>
          <div className="flex flex-wrap gap-1.5">
            {result.missing.map((kw) => (
              <code
                key={kw}
                className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-mono"
              >
                {kw}
              </code>
            ))}
          </div>
          {!result.hasMinLines && (
            <p className="mt-2 text-xs text-muted-foreground">
              Строк кода: {result.nonEmpty} (рекомендуется ≥ {exercise.minLines})
            </p>
          )}
        </div>
      )}

      {checked && exercise.explanation && (
        <ExplanationBox explanation={exercise.explanation} />
      )}
    </div>
  );
}
