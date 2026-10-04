// pages/createUi.jsx
// Presentational building blocks for the guided timetable setup.
// No data logic lives here — see Create.jsx for the wizard state machine.
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {AnimatePresence, motion, useReducedMotion} from "framer-motion";
import {ArrowLeft, ArrowRight, Check, Pencil, Plus, X} from "lucide-react";

// ─── Tokens (JS side; CSS tokens live in CREATE_CSS) ─────────────────────────
export const EASE = [0.22, 1, 0.36, 1];
export const MOTION = {
  enter: 0.34,
  exit: 0.18,
  micro: 0.16,
  offsetIn: 36,
  offsetOut: 28,
};
export const WHY_ID = "cr-why";
export const TITLE_ID = "cr-title";

export const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ─── Styles ──────────────────────────────────────────────────────────────────
export const CREATE_CSS = `
  .cr {
    --cr-bg: var(--ui-bg);
    --cr-surface: var(--ui-surface);
    --cr-rail: var(--ui-surface-muted);
    --cr-ink: var(--ui-text);
    --cr-ink-2: var(--ui-text-muted);
    --cr-ink-3: var(--ui-text-subtle);
    --cr-line: var(--ui-border);
    --cr-line-strong: var(--ui-border-strong);
    --cr-field: var(--ui-surface);
    --cr-accent: var(--ui-secondary-hover);
    --cr-accent-hover: var(--ui-secondary);
    --cr-accent-soft: var(--ui-secondary-soft);
    --cr-danger: #C93B2F;
    --cr-danger-soft: rgba(201, 59, 47, 0.12);
    --cr-ok: #1F7A4D;
    --cr-input-h: 72px;
    --cr-radius: 14px;
    --cr-radius-sm: 10px;

    /* Vertical + horizontal centering with graceful overflow */
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    padding: 48px 24px;
    background: var(--cr-bg);
    color: var(--cr-ink);
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .cr *, .cr *::before, .cr *::after { box-sizing: border-box; }
  .cr button { font-family: inherit; }

  .cr__sr {
    position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }

  /* ── The card ─────────────────────────────────────────────────────── */
  /* margin: auto on a flex child centres on both axes AND lets the card
     grow past the viewport gracefully when content is tall. */
  .cr__shell {
    margin: auto;
    width: 100%;
    max-width: 1040px;
    min-height: min(640px, calc(100dvh - 96px));
    display: grid;
    grid-template-columns: 288px minmax(0, 1fr);
    background: var(--cr-surface);
    border: 1px solid var(--cr-line);
    border-radius: 20px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 24px 56px -16px rgba(0, 0, 0, 0.10);
    overflow: hidden;
  }

  /* ── Rail (desktop) ────────────────────────────────────────────────── */
  .cr__rail {
    display: flex; flex-direction: column; gap: 36px;
    padding: 40px 28px 32px;
    background: var(--cr-rail);
    border-right: 1px solid var(--cr-line);
  }
  .cr__rail-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--cr-ink);
  }
  .cr__rail-sub {
    margin: 4px 0 0;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--cr-ink-3);
  }

  .cr__steps { list-style: none; margin: 0; padding: 0; }
  .cr__stepitem {
    position: relative; display: flex; align-items: center; gap: 14px;
    min-height: 36px; padding-bottom: 24px;
  }
  .cr__stepitem:last-child { padding-bottom: 0; }
  .cr__stepitem::before {
    content: ""; position: absolute; left: 17px; top: 40px; bottom: 4px;
    width: 2px; background: var(--cr-line); transition: background 0.3s ease;
  }
  .cr__stepitem:last-child::before { display: none; }
  .cr__stepitem[data-state="done"]::before { background: var(--cr-ink); }

  .cr__dot {
    display: grid; place-items: center; flex-shrink: 0;
    width: 36px; height: 36px; border-radius: 50%;
    background: #EAEAED; color: var(--cr-ink-3);
    font-size: 12px; font-weight: 600;
    transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  }
  .cr__stepitem[data-state="done"] .cr__dot { background: var(--cr-ink); color: #fff; }
  .cr__stepitem[data-state="current"] .cr__dot {
    background: #fff; color: var(--cr-accent); box-shadow: 0 0 0 2px var(--cr-accent);
  }
  .cr__steplabel {
    font-size: 14px; font-weight: 500; color: var(--cr-ink-3);
    transition: color 0.25s ease;
  }
  .cr__stepitem[data-state="done"] .cr__steplabel { color: var(--cr-ink-2); }
  .cr__stepitem[data-state="current"] .cr__steplabel { color: var(--cr-ink); font-weight: 600; }

  .cr__rail-foot {
    margin-top: auto; display: flex; flex-direction: column;
    gap: 10px; align-items: flex-start;
  }

  .cr__save {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12.5px; color: var(--cr-ink-3); line-height: 1.4;
  }
  .cr__save[data-state="saved"] { color: var(--cr-ok); font-weight: 500; }
  .cr__save[data-state="error"] { color: var(--cr-danger); font-weight: 500; flex-wrap: wrap; }
  .cr__link {
    background: none; border: 0; padding: 0; min-height: 28px;
    font-size: 12.5px; font-weight: 600; color: var(--cr-ink-2);
    text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
  }
  .cr__link:hover { color: var(--cr-ink); }

  /* ── Main column ───────────────────────────────────────────────────── */
  .cr__main {
    position: relative; min-width: 0;
    display: flex; flex-direction: column;
    padding: 56px clamp(36px, 6vw, 72px);
  }
  .cr__top { display: none; }
  .cr__stage {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    width: 100%; max-width: 680px; margin: 0 auto; min-width: 0;
  }

  .cr__notice {
    display: flex; align-items: center; gap: 8px;
    margin: 0 0 20px; padding: 10px 14px;
    font-size: 13.5px; color: var(--cr-ink-2);
    background: var(--cr-rail); border: 1px solid var(--cr-line);
    border-radius: var(--cr-radius-sm);
  }

  /* ── Step content — typography hierarchy ───────────────────────────── */
  .cr__eyebrow-row {
    display: flex; align-items: center; flex-wrap: wrap; gap: 8px 14px;
    min-height: 24px; margin-bottom: 18px;
  }
  .cr__eyebrow {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: var(--cr-accent);
  }
  .cr__opt {
    padding: 3px 10px; border-radius: 999px;
    background: #F0F0F2;
    font-size: 11px; font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--cr-ink-2);
  }
  .cr__saved {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12.5px; font-weight: 500; color: var(--cr-ok);
  }
  .cr__saved-dot {
    display: grid; place-items: center; width: 16px; height: 16px;
    border-radius: 50%; background: var(--cr-ok); color: #fff;
  }
  .cr__title {
    margin: 0 0 14px; outline: none;
    font-size: clamp(28px, 3.8vw, 42px);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.035em;
    color: var(--cr-ink);
    text-wrap: balance;
    max-width: 22ch;
  }
  .cr__lead {
    margin: 0 0 34px; max-width: 52ch;
    font-size: 16.5px; line-height: 1.6;
    color: var(--cr-ink-2);
    text-wrap: pretty;
  }

  /* ── Large input ───────────────────────────────────────────────────── */
  .cr__field { position: relative; width: 100%; }
  .cr__input {
    display: block; width: 100%; height: var(--cr-input-h); padding: 0 24px;
    font: inherit; font-size: 24px; font-weight: 500; letter-spacing: -0.015em;
    color: var(--cr-ink); background: var(--cr-field);
    border: 1px solid var(--cr-line-strong); border-radius: var(--cr-radius);
    outline: none; -webkit-appearance: none; appearance: none;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  }
  .cr__input::placeholder { color: #B4B4BA; font-weight: 400; }
  .cr__input:hover { border-color: #B8B8BF; }
  .cr__input:focus {
    background: #fff; border-color: var(--cr-accent);
    box-shadow: 0 0 0 4px rgba(11, 105, 255, 0.12), 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  .cr__input[aria-invalid="true"] { border-color: var(--cr-danger); }
  .cr__input[aria-invalid="true"]:focus {
    box-shadow: 0 0 0 4px var(--cr-danger-soft), 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  .cr__input--tag { padding-right: 104px; }
  .cr__add {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    display: inline-flex; align-items: center; gap: 6px;
    height: 44px; padding: 0 16px; border: 0; border-radius: var(--cr-radius-sm);
    background: var(--cr-ink); color: #fff;
    font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .cr__error {
    display: flex; gap: 8px; margin: 10px 2px 0;
    font-size: 14px; font-weight: 500; line-height: 1.4; color: var(--cr-danger);
  }
  .cr__hint { margin: 10px 2px 0; font-size: 13px; color: var(--cr-ink-3); }

  /* ── Tags (typed items) ────────────────────────────────────────────── */
  .cr__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .cr__tag {
    display: inline-flex; align-items: center; gap: 4px;
    min-height: 40px; padding: 0 6px 0 14px; border-radius: var(--cr-radius-sm);
    background: #F1F1F3; border: 1px solid var(--cr-line);
    font-size: 15px; font-weight: 500; max-width: 100%;
  }
  .cr__tag-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cr__tag-x {
    position: relative; display: grid; place-items: center; flex-shrink: 0;
    width: 28px; height: 28px; border: 0; border-radius: 8px;
    background: transparent; color: var(--cr-ink-3); cursor: pointer;
  }
  .cr__tag-x::after { content: ""; position: absolute; inset: -8px; }
  .cr__tag-x:hover { background: rgba(0, 0, 0, 0.06); color: var(--cr-ink); }

  /* ── Choice cards (radio) ──────────────────────────────────────────── */
  .cr__fieldset { margin: 0; padding: 0; border: 0; min-width: 0; outline: none; }
  .cr__choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .cr__choice { position: relative; display: block; }
  .cr__choice input {
    position: absolute; inset: 0; width: 100%; height: 100%; margin: 0;
    opacity: 0; cursor: pointer;
  }
  .cr__choice-ui {
    position: relative; display: flex; flex-direction: column;
    justify-content: center; gap: 4px;
    min-height: 92px; padding: 18px 22px;
    background: var(--cr-field);
    border: 1px solid var(--cr-line-strong);
    border-radius: var(--cr-radius);
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  }
  .cr__choice:hover .cr__choice-ui { border-color: #B8B8BF; }
  .cr__choice input:checked + .cr__choice-ui {
    background: #fff; border-color: var(--cr-ink); box-shadow: 0 0 0 1px var(--cr-ink);
  }
  .cr__choice input:focus-visible + .cr__choice-ui {
    outline: 2px solid var(--cr-accent); outline-offset: 3px;
  }
  .cr__choice-name { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
  .cr__choice-sub { font-size: 13px; color: var(--cr-ink-3); }
  .cr__choice-check {
    position: absolute; top: 14px; right: 14px; display: grid; place-items: center;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--cr-ink); color: #fff;
  }

  /* ── Chip picker (multi-select) ────────────────────────────────────── */
  .cr__picker-tools { display: flex; gap: 16px; margin: 0 0 10px; }
  .cr__picker {
    max-height: min(40vh, 340px); overflow-y: auto;
    padding: 3px; margin: -3px;
    overscroll-behavior: contain; outline: none;
  }
  .cr__chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .cr__chip {
    display: inline-flex; align-items: center; gap: 8px;
    min-height: 44px; padding: 0 16px;
    border-radius: var(--cr-radius-sm);
    background: #fff;
    border: 1px solid var(--cr-line-strong);
    color: var(--cr-ink);
    font-size: 15px; font-weight: 500; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease;
  }
  .cr__chip:hover { border-color: #B0B0B8; }
  .cr__chip[aria-pressed="true"] {
    background: var(--cr-ink); border-color: var(--cr-ink); color: #fff;
  }
  .cr__empty {
    margin: 0; padding: 16px; font-size: 14px; color: var(--cr-ink-2);
    background: var(--cr-field);
    border: 1px dashed var(--cr-line-strong);
    border-radius: var(--cr-radius-sm);
  }

  /* ── Class preview ─────────────────────────────────────────────────── */
  .cr__preview { margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--cr-line); }
  .cr__preview-head { margin: 0 0 12px; font-size: 13px; font-weight: 600; color: var(--cr-ink); }
  .cr__preview-head span { font-weight: 400; color: var(--cr-ink-3); }
  .cr__cls {
    padding: 5px 10px; border-radius: 8px;
    background: #F4F4F5; border: 1px solid var(--cr-line);
    font-size: 13px; font-weight: 500; color: var(--cr-ink);
  }
  .cr__cls--more { background: transparent; border-color: transparent; color: var(--cr-ink-3); }

  /* ── Why block ─────────────────────────────────────────────────────── */
  .cr__why {
    margin: 32px 0 0; padding-left: 16px;
    border-left: 2px solid var(--cr-line); max-width: 56ch;
  }
  .cr__why-label {
    margin: 0 0 4px; font-size: 11.5px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--cr-ink-2);
  }
  .cr__why-text { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--cr-ink-2); }

  /* ── Actions ───────────────────────────────────────────────────────── */
  .cr__actions {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-top: 40px;
  }
  .cr__actions-right {
    display: flex; flex-wrap: wrap; justify-content: flex-end;
    gap: 10px; margin-left: auto;
  }
  .cr__btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    height: 52px; padding: 0 26px; border-radius: 12px;
    border: 1px solid var(--cr-accent);
    background: var(--cr-accent); color: #fff;
    font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  }
  .cr__btn:hover:not(:disabled) {
    background: var(--cr-accent-hover); border-color: var(--cr-accent-hover);
  }
  .cr__btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .cr__btn--secondary {
    background: #fff; color: var(--cr-ink); border-color: var(--cr-line-strong);
  }
  .cr__btn--secondary:hover:not(:disabled) {
    background: #F4F4F5; border-color: #B0B0B8;
  }
  .cr__back {
    display: inline-flex; align-items: center; gap: 6px;
    min-height: 44px; padding: 0 10px 0 6px;
    margin-left: -6px; border: 0;
    border-radius: var(--cr-radius-sm);
    background: transparent;
    font-size: 14px; font-weight: 500;
    color: var(--cr-ink-2); cursor: pointer;
  }
  .cr__back:hover { color: var(--cr-ink); background: #F4F4F5; }

  /* ── Teachers ──────────────────────────────────────────────────────── */
  .cr__teachers { display: flex; flex-direction: column; gap: 10px; }
  .cr__teacher {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 6px 12px 16px;
    background: #fff;
    border: 1px solid var(--cr-line);
    border-radius: var(--cr-radius);
  }
  .cr__avatar {
    display: grid; place-items: center; flex-shrink: 0;
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--cr-ink); color: #fff;
    font-size: 14px; font-weight: 600;
  }
  .cr__tmeta { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
  .cr__tname {
    font-size: 16px; font-weight: 600;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .cr__tsub {
    font-size: 13px; color: var(--cr-ink-2);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .cr__iconbtn {
    display: grid; place-items: center; flex-shrink: 0;
    width: 44px; height: 44px; border: 0;
    border-radius: var(--cr-radius-sm);
    background: transparent; color: var(--cr-ink-3); cursor: pointer;
  }
  .cr__iconbtn:hover { background: #F4F4F5; color: var(--cr-ink); }
  .cr__iconbtn--danger:hover { background: var(--cr-danger-soft); color: var(--cr-danger); }

  /* ── Overview (intro) ──────────────────────────────────────────────── */
  .cr__overview { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--cr-line); }
  .cr__overview li {
    display: flex; align-items: baseline; gap: 16px;
    padding: 14px 0; border-bottom: 1px solid var(--cr-line);
  }
  .cr__overview-n {
    width: 20px; font-size: 13px; color: var(--cr-ink-3);
    font-variant-numeric: tabular-nums;
  }
  .cr__overview-label { font-size: 15px; font-weight: 600; min-width: 96px; }
  .cr__overview-desc { font-size: 14px; color: var(--cr-ink-2); }

  /* ── Review ────────────────────────────────────────────────────────── */
  .cr__review { margin: 0; border-top: 1px solid var(--cr-line); }
  .cr__rrow {
    display: grid;
    grid-template-columns: 128px minmax(0, 1fr) auto;
    gap: 16px; align-items: start;
    padding: 16px 0; border-bottom: 1px solid var(--cr-line);
  }
  .cr__rlabel {
    margin: 0; padding-top: 3px;
    font-size: 13px; font-weight: 500; color: var(--cr-ink-3);
  }
  .cr__rvalue {
    margin: 0; min-width: 0;
    font-size: 16px; font-weight: 500; overflow-wrap: anywhere;
  }
  .cr__rsub {
    display: block; margin-top: 4px;
    font-size: 13.5px; font-weight: 400;
    line-height: 1.5; color: var(--cr-ink-2);
  }
  .cr__edit {
    display: inline-flex; align-items: center; gap: 6px;
    min-height: 44px; margin: -8px -8px -8px 0;
    padding: 0 12px; border: 0;
    border-radius: var(--cr-radius-sm);
    background: transparent;
    font-size: 13.5px; font-weight: 600;
    color: var(--cr-ink-2); cursor: pointer;
  }
  .cr__edit:hover { background: #F4F4F5; color: var(--cr-ink); }
  .cr__issues {
    margin: 20px 0 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 8px;
  }
  .cr__issue {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 6px 6px 6px 14px;
    border-radius: var(--cr-radius-sm);
    background: var(--cr-danger-soft);
    color: var(--cr-danger);
    font-size: 14px; font-weight: 500;
  }
  .cr__issue .cr__edit { color: var(--cr-danger); margin: 0; }

  /* ── Generating ────────────────────────────────────────────────────── */
  .cr__gen { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
  .cr__gen--success { align-items: center; text-align: center; }
  .cr__gen--success .cr__title { margin-bottom: 4px; }
  .cr__gen--success .cr__lead { margin-bottom: 0; }
  .cr__success-icon {
    display: grid; place-items: center;
    width: 88px; height: 88px; margin-bottom: 18px;
    border-radius: 50%; color: #fff;
    background: var(--cr-ok);
    box-shadow: 0 12px 28px rgba(31, 122, 77, 0.22);
  }
  .cr__success-icon svg { width: 48px; height: 48px; overflow: visible; }
  .cr__spinner {
    width: 28px; height: 28px; margin-bottom: 18px;
    border-radius: 50%;
    border: 3px solid var(--cr-line);
    border-top-color: var(--cr-accent);
    animation: crSpin 0.8s linear infinite;
  }
  @keyframes crSpin { to { transform: rotate(360deg); } }

  /* ── Compact progress (mobile) ─────────────────────────────────────── */
  .cr__top-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 10px;
    font-size: 13px; color: var(--cr-ink-2);
  }
  .cr__top-row b { font-weight: 600; color: var(--cr-ink); }
  .cr__bar { height: 3px; border-radius: 3px; background: var(--cr-line); overflow: hidden; }
  .cr__bar-fill { display: block; height: 100%; border-radius: 3px; background: var(--cr-ink); }

  /* ── Focus ─────────────────────────────────────────────────────────── */
  .cr button:focus-visible,
  .cr__picker:focus-visible {
    outline: 2px solid var(--cr-accent); outline-offset: 2px;
  }

  /* ── Mobile ────────────────────────────────────────────────────────── */
  @media (max-width: 860px) {
    .cr {
      --cr-input-h: 62px;
      padding: 32px 16px calc(28px + env(safe-area-inset-bottom, 0px));
      align-items: flex-start;
    }
    .cr__shell {
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
      border-radius: 16px;
      margin-top: 24px;
      margin-bottom: 24px;
    }
    .cr__rail { display: none; }
    .cr__top { display: block; margin-bottom: 8px; }
    .cr__main { padding: 28px 22px 28px; }
    .cr__stage { justify-content: flex-start; padding-top: 12px; }
    .cr__title {
      font-size: clamp(26px, 6.5vw, 32px);
      max-width: 100%;
    }
    .cr__lead { margin-bottom: 24px; font-size: 15.5px; }
    .cr__input { padding: 0 18px; font-size: 20px; }
    .cr__input--tag { padding-right: 96px; }
    .cr__choices { grid-template-columns: minmax(0, 1fr); gap: 10px; }
    .cr__choice-ui {
      min-height: 64px; flex-direction: row; align-items: center;
      justify-content: space-between; padding: 12px 18px;
    }
    .cr__choice-check { position: static; }
    .cr__actions {
      flex-direction: column-reverse; align-items: stretch;
      margin-top: 28px; gap: 6px;
    }
    .cr__actions-right {
      flex-direction: column-reverse; align-items: stretch; margin-left: 0;
    }
    .cr__btn { width: 100%; height: 54px; }
    .cr__back { justify-content: center; margin-left: 0; }
    .cr__rrow { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; }
    .cr__rlabel { grid-column: 1 / -1; padding: 0; }
    .cr__overview-label { min-width: 84px; }
    .cr__overview li { flex-wrap: wrap; gap: 4px 12px; }
    .cr__overview-desc { flex-basis: 100%; padding-left: 32px; }
  }
  @media (max-width: 380px) {
    .cr { padding-left: 8px; padding-right: 8px; }
    .cr__main { padding-left: 16px; padding-right: 16px; }
    .cr__title { font-size: 24px; }
    .cr__input { font-size: 18px; padding: 0 14px; }
    .cr__input--tag { padding-right: 88px; }
    .cr__add { right: 10px; padding: 0 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cr *, .cr *::before, .cr *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─── Progress ────────────────────────────────────────────────────────────────
export function SaveStatus({status, onRetry, compact}) {
  if (status === "error") {
    return (
      <span className="cr__save" data-state="error" role="alert">
        {compact
          ? "Not saved"
          : "Couldn't save your progress on this device."}
        <button type="button" className="cr__link" onClick={onRetry}>
          Retry
        </button>
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="cr__save" data-state="saved">
        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
        {compact ? "Saved on device" : "Progress saved on this device"}
      </span>
    );
  }
  return compact ? null : (
    <span className="cr__save" data-state="idle">
      Progress is saved on this device as you go.
    </span>
  );
}

export function ProgressRail({
  title,
  subtitle,
  phases,
  status,
  onRetry,
  canStartOver,
  onStartOver,
}) {
  return (
    <aside className="cr__rail" aria-label="Setup progress">
      <div>
        <h2 className="cr__rail-title">{title}</h2>
        {subtitle && <p className="cr__rail-sub">{subtitle}</p>}
      </div>
      <ol className="cr__steps">
        {phases.map((p, i) => (
          <li
            key={p.id}
            className="cr__stepitem"
            data-state={p.state}
            aria-current={p.state === "current" ? "step" : undefined}
          >
            <span className="cr__dot" aria-hidden="true">
              {p.state === "done" ? <Check size={14} strokeWidth={2.6} /> : i + 1}
            </span>
            <span className="cr__steplabel">
              {p.label}
              <span className="cr__sr">
                {p.state === "done"
                  ? ", completed"
                  : p.state === "current"
                    ? ", current step"
                    : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <div className="cr__rail-foot">
        <SaveStatus status={status} onRetry={onRetry} />
        {canStartOver && (
          <button type="button" className="cr__link" onClick={onStartOver}>
            Start over
          </button>
        )}
      </div>
    </aside>
  );
}

export function ProgressCompact({position, total, label, fraction, status, onRetry}) {
  return (
    <div className="cr__top">
      <div className="cr__top-row">
        <span>
          {position > 0 ? (
            <>
              Step {position} of {total} <b>· {label}</b>
            </>
          ) : (
            <b>{label}</b>
          )}
        </span>
        <SaveStatus status={status} onRetry={onRetry} compact />
      </div>
      <div
        className="cr__bar"
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fraction * 100)}
      >
        <motion.span
          className="cr__bar-fill"
          initial={false}
          animate={{width: `${Math.round(fraction * 100)}%`}}
          transition={{duration: 0.4, ease: EASE}}
        />
      </div>
    </div>
  );
}

// ─── Step transition (directional) ───────────────────────────────────────────
export function StepTransition({stepKey, direction, children}) {
  const reduced = useReducedMotion();
  const variants = {
    enter: (d) => ({
      opacity: 0,
      x: reduced ? 0 : d * MOTION.offsetIn,
      y: reduced ? 0 : 8,
    }),
    center: {opacity: 1, x: 0, y: 0},
    exit: (d) => ({opacity: 0, x: reduced ? 0 : d * -MOTION.offsetOut}),
  };
  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{duration: MOTION.enter, ease: EASE}}
        style={{width: "100%"}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Question scaffold ───────────────────────────────────────────────────────
export function SavedNote({text}) {
  return (
    <AnimatePresence>
      {text && (
        <motion.span
          key={text}
          className="cr__saved"
          role="status"
          initial={{opacity: 0, x: -6}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0}}
          transition={{duration: 0.22, ease: EASE}}
        >
          <motion.span
            className="cr__saved-dot"
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{type: "spring", stiffness: 520, damping: 22}}
          >
            <Check size={10} strokeWidth={3.2} aria-hidden="true" />
          </motion.span>
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function StepExplanation({children, label = "Why Protiba asks"}) {
  return (
    <div className="cr__why">
      <p className="cr__why-label">{label}</p>
      <p className="cr__why-text" id={WHY_ID}>
        {children}
      </p>
    </div>
  );
}

export function ContinueButton({
  children,
  disabled,
  loading,
  type = "submit",
  onClick,
  secondary,
  icon,
}) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`cr__btn${secondary ? " cr__btn--secondary" : ""}`}
      whileTap={reduced ? undefined : {scale: 0.98}}
    >
      {children}
      {icon === undefined ? (
        !secondary && <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        icon
      )}
    </motion.button>
  );
}

export function QuestionStep({
  eyebrow,
  optional,
  saved,
  title,
  lead,
  why,
  focusRef,
  autoFocus,
  errorToken,
  onSubmit,
  onBack,
  actions,
  children,
}) {
  const headingRef = useRef(null);

  useEffect(() => {
    const target = autoFocus ? focusRef?.current : null;
    (target || headingRef.current)?.focus({preventScroll: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!errorToken) return;
    (focusRef?.current || headingRef.current)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorToken]);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className="cr__eyebrow-row">
        {eyebrow && <span className="cr__eyebrow">{eyebrow}</span>}
        {optional && <span className="cr__opt">Optional</span>}
        <SavedNote text={saved} />
      </div>
      <h1 id={TITLE_ID} ref={headingRef} tabIndex={-1} className="cr__title">
        {title}
      </h1>
      {lead && <p className="cr__lead">{lead}</p>}
      {children}
      {why && <StepExplanation>{why}</StepExplanation>}
      <div className="cr__actions">
        {onBack && (
          <button type="button" className="cr__back" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back
          </button>
        )}
        <div className="cr__actions-right">{actions}</div>
      </div>
    </form>
  );
}

// ─── Inputs ──────────────────────────────────────────────────────────────────
export function FieldError({id, error}) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          key={error}
          className="cr__error"
          role="alert"
          initial={{opacity: 0, y: -4}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0}}
          transition={{duration: MOTION.micro}}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export const LargeInput = forwardRef(function LargeInput(
  {id, label, error, hint, ...props},
  ref,
) {
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [WHY_ID, hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="cr__field">
      <label htmlFor={id} className="cr__sr">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className="cr__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        {...props}
      />
      {hint && !error && (
        <p className="cr__hint" id={hintId}>
          {hint}
        </p>
      )}
      <FieldError id={errId} error={error} />
    </div>
  );
});

export const TagInput = forwardRef(function TagInput(
  {id, label, value, onChange, transform = (s) => s, placeholder, error, hint},
  ref,
) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const tags = splitList(value);
  const errId = `${id}-error`;

  const merge = (raw) => {
    const seen = new Set(tags.map((t) => t.toLowerCase()));
    const next = [...tags];
    splitList(raw)
      .map(transform)
      .forEach((t) => {
        const k = t.toLowerCase();
        if (t && !seen.has(k)) {
          seen.add(k);
          next.push(t);
        }
      });
    return next.join(", ");
  };

  const commit = () => {
    if (!text.trim()) return value;
    const next = merge(text);
    setText("");
    onChange(next);
    return next;
  };

  useImperativeHandle(ref, () => ({
    focus: (opts) => inputRef.current?.focus(opts),
    commit,
  }));

  const handleChange = (e) => {
    const v = e.target.value;
    if (v.includes(",")) {
      const parts = v.split(",");
      const rest = parts.pop();
      onChange(merge(parts.join(",")));
      setText(rest.trimStart());
    } else {
      setText(v);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim()) {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !text && tags.length) {
      onChange(tags.slice(0, -1).join(", "));
    }
  };

  const describedBy =
    [WHY_ID, hint ? `${id}-hint` : null, error ? errId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <div className="cr__field">
        <label htmlFor={id} className="cr__sr">
          {label}
        </label>
        <input
          ref={inputRef}
          id={id}
          className="cr__input cr__input--tag"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          enterKeyHint="done"
        />
        {text.trim() && (
          <button type="button" className="cr__add" onClick={commit}>
            <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
            Add
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="cr__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <FieldError id={errId} error={error} />
      {tags.length > 0 && (
        <ul className="cr__tags" aria-label={`${label} added`} style={{listStyle: "none", padding: 0}}>
          <AnimatePresence initial={false} mode="popLayout">
            {tags.map((tag) => (
              <motion.li
                key={tag}
                layout
                className="cr__tag"
                initial={{opacity: 0, scale: 0.92}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.92}}
                transition={{duration: 0.18, ease: EASE}}
              >
                <span className="cr__tag-text">{tag}</span>
                <button
                  type="button"
                  className="cr__tag-x"
                  aria-label={`Remove ${tag}`}
                  onClick={() => onChange(tags.filter((t) => t !== tag).join(", "))}
                >
                  <X size={14} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
});

export const ChoiceGroup = forwardRef(function ChoiceGroup(
  {name, legend, options, value, onChange, describe, error},
  ref,
) {
  const errId = `${name}-error`;
  return (
    <fieldset
      ref={ref}
      tabIndex={-1}
      className="cr__fieldset"
      aria-describedby={[WHY_ID, error ? errId : null].filter(Boolean).join(" ")}
    >
      <legend className="cr__sr">{legend}</legend>
      <div className="cr__choices">
        {options.map((opt) => (
          <label key={opt} className="cr__choice">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span className="cr__choice-ui">
              <span>
                <span className="cr__choice-name">{opt}</span>
                {describe && (
                  <span className="cr__choice-sub" style={{display: "block"}}>
                    {describe(opt)}
                  </span>
                )}
              </span>
              {value === opt && (
                <motion.span
                  className="cr__choice-check"
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{type: "spring", stiffness: 520, damping: 24}}
                >
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </motion.span>
              )}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={errId} error={error} />
    </fieldset>
  );
});

export const ChipPicker = forwardRef(function ChipPicker(
  {id, label, options, selected, onToggle, onSetAll, error, emptyMessage},
  ref,
) {
  const errId = `${id}-error`;
  if (options.length === 0) {
    return <p className="cr__empty">{emptyMessage}</p>;
  }
  return (
    <div>
      {options.length > 3 && (
        <div className="cr__picker-tools">
          <button type="button" className="cr__link" onClick={() => onSetAll(options)}>
            Select all
          </button>
          <button type="button" className="cr__link" onClick={() => onSetAll([])}>
            Clear
          </button>
        </div>
      )}
      <div
        ref={ref}
        tabIndex={-1}
        className="cr__picker"
        role="group"
        aria-label={label}
        aria-describedby={[WHY_ID, error ? errId : null].filter(Boolean).join(" ")}
      >
        <div className="cr__chips">
          {options.map((opt) => {
            const on = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className="cr__chip"
                aria-pressed={on}
                onClick={() => onToggle(opt)}
              >
                {on && <Check size={14} strokeWidth={2.6} aria-hidden="true" />}
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      <FieldError id={errId} error={error} />
    </div>
  );
});

// ─── Class preview ───────────────────────────────────────────────────────────
const PREVIEW_LIMIT = 24;

export function ClassPreview({classes}) {
  return (
    <AnimatePresence initial={false}>
      {classes.length > 0 && (
        <motion.div
          key="preview"
          className="cr__preview"
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: "auto"}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.3, ease: EASE}}
          style={{overflow: "hidden"}}
        >
          <p className="cr__preview-head" aria-live="polite">
            {classes.length} {classes.length === 1 ? "class" : "classes"} generated{" "}
            <span>· Protiba will schedule each one</span>
          </p>
          <div className="cr__chips">
            {classes.slice(0, PREVIEW_LIMIT).map((cls, i) => (
              <motion.span
                key={cls}
                className="cr__cls"
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.22, delay: Math.min(i, 14) * 0.02, ease: EASE}}
              >
                {cls}
              </motion.span>
            ))}
            {classes.length > PREVIEW_LIMIT && (
              <span className="cr__cls cr__cls--more">
                +{classes.length - PREVIEW_LIMIT} more
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Teachers ────────────────────────────────────────────────────────────────
export function TeacherCard({teacher, onEdit, onRemove, canRemove}) {
  const subjects = splitList(teacher.subjects);
  const classes = splitList(teacher.classes);
  return (
    <motion.li
      layout
      className="cr__teacher"
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -8, scale: 0.98}}
      transition={{duration: 0.25, ease: EASE}}
    >
      <span className="cr__avatar" aria-hidden="true">
        {(teacher.name.trim().charAt(0) || "?").toUpperCase()}
      </span>
      <span className="cr__tmeta">
        <span className="cr__tname">{teacher.name}</span>
        <span className="cr__tsub">
          {subjects.join(", ") || "No subjects"} · {classes.length}{" "}
          {classes.length === 1 ? "class" : "classes"}
        </span>
      </span>
      <button type="button" className="cr__iconbtn" onClick={onEdit} aria-label={`Edit ${teacher.name}`}>
        <Pencil size={16} strokeWidth={1.9} aria-hidden="true" />
      </button>
      {canRemove && (
        <button
          type="button"
          className="cr__iconbtn cr__iconbtn--danger"
          onClick={onRemove}
          aria-label={`Remove ${teacher.name}`}
        >
          <X size={17} strokeWidth={1.9} aria-hidden="true" />
        </button>
      )}
    </motion.li>
  );
}

// ─── Intro overview ──────────────────────────────────────────────────────────
export function IntroOverview({items}) {
  return (
    <ol className="cr__overview">
      {items.map((item, i) => (
        <li key={item.label}>
          <span className="cr__overview-n">{i + 1}</span>
          <span className="cr__overview-label">{item.label}</span>
          <span className="cr__overview-desc">{item.desc}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Review ──────────────────────────────────────────────────────────────────
export function ReviewSummary({rows, issues, onFix}) {
  return (
    <>
      <dl className="cr__review">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            className="cr__rrow"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.28, delay: 0.05 * i, ease: EASE}}
          >
            <dt className="cr__rlabel">{row.label}</dt>
            <dd className="cr__rvalue">
              {row.value}
              {row.sub && <span className="cr__rsub">{row.sub}</span>}
            </dd>
            <dd style={{margin: 0}}>
              <button
                type="button"
                className="cr__edit"
                onClick={row.onEdit}
                aria-label={`Edit ${row.label.toLowerCase()}`}
              >
                <Pencil size={14} strokeWidth={2} aria-hidden="true" />
                Edit
              </button>
            </dd>
          </motion.div>
        ))}
      </dl>
      {issues.length > 0 && (
        <ul className="cr__issues" aria-label="Things to fix before saving">
          {issues.map((issue, i) => (
            <li key={`${issue.step}-${issue.teacherIndex}-${i}`} className="cr__issue">
              <span>{issue.message}</span>
              <button type="button" className="cr__edit" onClick={() => onFix(issue)}>
                Fix
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ─── Generating ──────────────────────────────────────────────────────────────
export function GeneratingState({status, onRetry, onBack}) {
  if (status === "error") {
    return (
      <div className="cr__gen" role="alert">
        <h1 id={TITLE_ID} className="cr__title">
          We couldn't save your configuration.
        </h1>
        <p className="cr__lead">
          Your setup is still here and nothing was lost. Try again, or go back to
          review it.
        </p>
        <div className="cr__actions-right" style={{marginLeft: 0}}>
          <ContinueButton type="button" onClick={onRetry}>
            Try again
          </ContinueButton>
          <ContinueButton type="button" secondary icon={null} onClick={onBack}>
            Back to review
          </ContinueButton>
        </div>
      </div>
    );
  }
  const isDone = status === "done";
  return (
    <div
      className={`cr__gen${isDone ? " cr__gen--success" : ""}`}
      role="status"
      aria-live="polite"
    >
      {isDone ? (
        <motion.div
          className="cr__success-icon"
          initial={{scale: 0, opacity: 0, rotate: -18}}
          animate={{scale: 1, opacity: 1, rotate: 0}}
          transition={{type: "spring", stiffness: 260, damping: 17}}
          aria-hidden="true"
        >
          <svg viewBox="0 0 48 48" fill="none">
            <motion.path
              d="M14 24.5 21 31l14-15"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{pathLength: 0}}
              animate={{pathLength: 1}}
              transition={{duration: 0.45, delay: 0.18, ease: "easeOut"}}
            />
          </svg>
        </motion.div>
      ) : (
        <span className="cr__spinner" aria-hidden="true" />
      )}
      <h1 id={TITLE_ID} className="cr__title">
        {isDone ? "Configuration saved." : "Saving your configuration…"}
      </h1>
      <p className="cr__lead">
        {isDone
          ? "Redirecting you to the home page…"
          : "Protiba is saving your setup. This can take a moment."}
      </p>
    </div>
  );
}