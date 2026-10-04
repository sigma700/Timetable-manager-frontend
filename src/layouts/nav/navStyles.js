// components/navStyles.js
//
// Two stylesheets:
//
//   NAV_CSS      Shared shell. Used by BOTH AppNav and MarketingNav:
//                header, logo, desktop links, buttons, user chip, dropdown,
//                and the marketing mobile burger + panel.
//
//   APP_NAV_CSS  App-only. The mobile trigger and the mobile navigation
//                drawer (`pn-d__*`). Only AppNav injects this, so nothing
//                here can leak into the marketing site.
//
// Breakpoint: everything switches to the mobile layout at 900px.

/* ───────────────────────────────────────────────────────────────────────────
   Shared shell
   ─────────────────────────────────────────────────────────────────────────── */
export const NAV_CSS = `
  .pn,
  .pn-d {
    /* Colour */
    --pn-ink: var(--ui-text);
    --pn-ink-2: var(--ui-text-muted);
    --pn-ink-3: var(--ui-text-subtle);
    --pn-line: var(--ui-border);
    --pn-line-soft: var(--ui-border-subtle);
    --pn-hover: var(--ui-surface-muted);
    --pn-surface: var(--ui-surface);
    --pn-canvas: var(--ui-bg);
    --pn-brand: var(--ui-secondary-hover);
    --pn-brand-hover: #1b6539;
    --pn-focus: var(--ui-focus);

    /* Shape + rhythm */
    --pn-header-h: 74px;
    --pn-radius-sm: 8px;
    --pn-radius: 10px;
    --pn-radius-lg: 12px;

    /* Motion */
    --pn-ease: cubic-bezier(0.32, 0.72, 0, 1);
    --pn-fast: 140ms;
  }

  /* ── Shell ──────────────────────────────────────────────────────────── */
  .pn {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    padding-top: env(safe-area-inset-top, 0px);
    background: var(--pn-surface);
    border-bottom: 1px solid var(--pn-line-soft);
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
  }

  .pn__inner {
    max-width: var(--ui-content-width);
    margin: 0 auto;
    padding: 0 max(24px, env(safe-area-inset-right, 0px)) 0 max(24px, env(safe-area-inset-left, 0px));
    height: var(--pn-header-h);
    display: flex;
    align-items: center;
    gap: 32px;
  }

  /* ── Logo ───────────────────────────────────────────────────────────── */
  .pn__logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    text-decoration: none;
    border-radius: var(--pn-radius-sm);
  }
  .pn__logo img {
    height: 38px;
    width: auto;
    display: block;
  }

  /* ── Center links (desktop) ─────────────────────────────────────────── */
  .pn__links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }

  .pn__link {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--pn-ink-2);
    text-decoration: none;
    border-radius: var(--pn-radius-sm);
    white-space: nowrap;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .pn__link:hover {
    background: var(--pn-hover);
    color: var(--pn-ink);
  }
  .pn__link--active,
  .pn__link--active:hover {
    color: var(--pn-brand);
    background: var(--ui-secondary-soft);
    font-weight: 500;
  }
  .dark .pn__link--active,
  .dark .pn__link--active:hover {
    color: var(--ui-secondary);
  }

  /* ── Right actions (desktop) ────────────────────────────────────────── */
  .pn__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .pn__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 38px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--pn-radius-sm);
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .pn__btn--primary {
    background: var(--pn-brand);
    color: #FFFFFF;
    border-color: var(--pn-brand);
  }
  .pn__btn--primary:hover {
    background: var(--pn-brand-hover);
    border-color: var(--pn-brand-hover);
  }
  .pn__btn--ghost {
    background: var(--pn-surface);
    color: var(--pn-ink);
    border-color: var(--pn-line);
  }
  .pn__btn--ghost:hover {
    background: var(--pn-hover);
    border-color: var(--pn-ink-3);
  }

  /* ── User chip (desktop) ────────────────────────────────────────────── */
  .pn__user { position: relative; }

  .pn__userbtn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 12px 4px 4px;
    background: transparent;
    border: 1px solid var(--pn-line);
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .pn__userbtn:hover {
    background: var(--pn-hover);
    border-color: var(--pn-line);
  }

  .pn__chev {
    color: var(--pn-ink-3);
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }
  .pn__userbtn[aria-expanded="true"] .pn__chev { transform: rotate(180deg); }

  .pn__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--pn-brand);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .pn__username {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
    min-width: 0;
  }
  .pn__uname {
    font-size: 13px;
    font-weight: 500;
    color: var(--pn-ink);
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pn__school {
    font-size: 10.5px;
    color: var(--pn-ink-3);
    font-weight: 400;
    margin-top: 1px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Desktop dropdown ───────────────────────────────────────────────── */
  .pn__menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 220px;
    background: var(--pn-surface);
    border: 1px solid var(--pn-line);
    border-radius: var(--pn-radius-lg);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08),
                0 2px 6px rgba(0, 0, 0, 0.04);
    padding: 6px;
    display: flex;
    flex-direction: column;
    z-index: 50;
    animation: pnMenuIn 0.15s ease-out;
  }

  @keyframes pnMenuIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pn__menuitem {
    display: block;
    width: 100%;
    padding: 9px 12px;
    font-size: 13.5px;
    color: var(--pn-ink);
    text-decoration: none;
    border-radius: 7px;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s ease;
  }
  .pn__menuitem:hover { background: var(--pn-hover); }
  .pn__menusep { height: 1px; background: var(--pn-line); margin: 6px 4px; }

  /* ── Marketing burger + panel (hidden on desktop) ───────────────────── */
  .pn__burger {
    display: none;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    height: 40px;
    padding: 0 14px;
    background: transparent;
    border: 1px solid var(--pn-line);
    border-radius: var(--pn-radius);
    color: var(--pn-ink);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s ease;
  }
  .pn__burger:hover { background: var(--pn-hover); }

  .pn__panel { display: none; }

  /* ── Focus (keyboard only) ──────────────────────────────────────────── */
  .pn a:focus-visible,
  .pn button:focus-visible {
    outline: 2px solid var(--pn-focus);
    outline-offset: 2px;
  }

  /* ── Mobile ─────────────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .pn__inner {
      padding: 0 max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px));
      gap: 12px;
    }
    .pn__links,
    .pn__actions {
      display: none;
    }
    .pn__burger {
      display: inline-flex;
      margin-left: auto;
    }

    /* Marketing panel: simple, flat list under the header */
    .pn__panel {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 16px calc(16px + env(safe-area-inset-bottom, 0px));
      max-height: calc(100vh - var(--pn-header-h) - env(safe-area-inset-top, 0px));
      max-height: calc(100dvh - var(--pn-header-h) - env(safe-area-inset-top, 0px));
      overflow-y: auto;
      overscroll-behavior: contain;
      background: var(--pn-surface);
      border-top: 1px solid var(--pn-line-soft);
    }
    .pn__panel .pn__link {
      display: flex;
      align-items: center;
      min-height: 46px;
      padding: 0 12px;
      font-size: 15px;
    }
    .pn__panel .pn__btn {
      width: 100%;
      height: 46px;
      margin-top: 8px;
      font-size: 14px;
    }
    .pn__panel .pn__btn + .pn__btn { margin-top: 4px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pn *, .pn *::before, .pn *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/* ───────────────────────────────────────────────────────────────────────────
   App-only: mobile trigger + navigation drawer
   ─────────────────────────────────────────────────────────────────────────── */
export const APP_NAV_CSS = `
  .pn-d {
    /* Drawer-specific tokens */
    --d-width: min(340px, 90vw);
    --d-row: 44px;
    --d-row-sub: 40px;
    --d-icon: 17px;
    --d-dur: 260ms;
    --d-dur-backdrop: 180ms;
    --d-pad: 12px;
  }

  /* ── Trigger (mobile only) ──────────────────────────────────────────── */
  .pn__trigger {
    display: none;
    position: relative;
    align-items: center;
    gap: 8px;
    height: 40px;
    max-width: 58vw;
    padding: 0 12px 0 10px;
    margin-left: auto;
    background: var(--pn-surface);
    color: var(--pn-ink);
    border: 1px solid var(--pn-line);
    border-radius: var(--pn-radius);
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: -0.005em;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--pn-fast) ease, border-color var(--pn-fast) ease;
  }
  /* Grow the tap area to 44px without growing the visible control */
  .pn__trigger::before {
    content: "";
    position: absolute;
    inset: -2px;
  }
  .pn__trigger svg { color: var(--pn-ink-2); flex-shrink: 0; }
  .pn__trigger-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pn__trigger:active { background: var(--pn-hover); }
  @media (hover: hover) {
    .pn__trigger:hover { background: var(--pn-hover); border-color: #D6D6D6; }
  }

  /* ── Drawer root: always mounted so it can animate both ways ────────── */
  .pn-d {
    display: none;
  }

  @media (max-width: 900px) {
    .pn__trigger { display: inline-flex; }

    .pn-d {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      z-index: 60;
      visibility: hidden;
      pointer-events: none;
      /* Stay visible until the close animation finishes */
      transition: visibility 0s linear var(--d-dur);
      font-family: inherit;
      -webkit-font-smoothing: antialiased;
      color: var(--pn-ink);
    }
    .pn-d[data-open="true"] {
      visibility: visible;
      pointer-events: auto;
      transition-delay: 0s;
    }

    /* Backdrop */
    .pn-d__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(23, 23, 23, 0.32);
      opacity: 0;
      transition: opacity var(--d-dur-backdrop) ease;
    }
    .pn-d[data-open="true"] .pn-d__backdrop { opacity: 1; }

    /* Sheet */
    .pn-d__sheet {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--d-width);
      display: flex;
      flex-direction: column;
      background: var(--pn-canvas);
      border-right: 1px solid var(--pn-line);
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      overflow: hidden;
      padding-top: env(safe-area-inset-top, 0px);
      padding-left: env(safe-area-inset-left, 0px);
      transform: translateX(-100%);
      opacity: 0.6;
      transition: transform var(--d-dur) var(--pn-ease),
                  opacity var(--d-dur-backdrop) ease;
      will-change: transform;
    }
    .pn-d[data-open="true"] .pn-d__sheet {
      transform: translateX(0);
      opacity: 1;
      box-shadow: 12px 0 32px rgba(0, 0, 0, 0.06);
    }

    /* ── Header ─────────────────────────────────────────────────────── */
    .pn-d__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      height: 56px;
      padding: 0 4px 0 16px;
    }
    .pn-d__title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.015em;
      color: var(--pn-ink);
    }
    .pn-d__mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--pn-radius-sm);
      background: var(--pn-surface);
      border: 1px solid var(--pn-line);
      color: var(--pn-ink);
    }
    .pn-d__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      background: transparent;
      border: none;
      color: var(--pn-ink-2);
      cursor: pointer;
      font-family: inherit;
      -webkit-tap-highlight-color: transparent;
    }
    .pn-d__close-ui {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--pn-radius-sm);
      border: 1px solid var(--pn-line);
      background: var(--pn-surface);
      transition: background var(--pn-fast) ease, color var(--pn-fast) ease;
    }
    .pn-d__close:active .pn-d__close-ui { background: var(--pn-hover); color: var(--pn-ink); }
    @media (hover: hover) {
      .pn-d__close:hover .pn-d__close-ui { background: var(--pn-hover); color: var(--pn-ink); }
    }

    /* ── Scrolling body ─────────────────────────────────────────────── */
    .pn-d__body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 4px var(--d-pad) 16px;
    }

    /* Primary action */
    .pn-d__create {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: var(--d-row);
      margin-bottom: 12px;
      padding: 0 14px;
      background: var(--pn-brand);
      color: #FFFFFF;
      border-radius: var(--pn-radius);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.005em;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      transition: background var(--pn-fast) ease;
    }
    .pn-d__create:active { background: var(--pn-brand-hover); }
    @media (hover: hover) {
      .pn-d__create:hover { background: var(--pn-brand-hover); }
    }
    .pn-d__create[aria-current="page"] {
      background: var(--pn-brand);
    }

    /* One white surface holds all navigation sections */
    .pn-d__nav {
      background: var(--pn-surface);
      border: 1px solid var(--pn-line);
      border-radius: var(--pn-radius-lg);
      padding: 6px;
    }
    .pn-d__section + .pn-d__section {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid var(--pn-line-soft);
    }
    .pn-d__section-label {
      padding: 10px 10px 6px;
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: var(--pn-ink-3);
    }
    .pn-d__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    /* ── Rows ───────────────────────────────────────────────────────── */
    .pn-d__row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--d-row);
      padding: 0 10px;
      border: none;
      border-radius: var(--pn-radius);
      background: transparent;
      color: var(--pn-ink);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.005em;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background var(--pn-fast) ease, color var(--pn-fast) ease;
    }
    .pn-d__row:active { background: rgba(23, 23, 23, 0.06); }
    @media (hover: hover) {
      .pn-d__row:hover { background: rgba(23, 23, 23, 0.05); }
    }

    .pn-d__icon {
      flex-shrink: 0;
      color: var(--pn-ink-2);
      transition: color var(--pn-fast) ease;
    }
    .pn-d__label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Active: secondary-color pill */
    .pn-d__row--active,
    .pn-d__row--active:hover,
    .pn-d__row--active:active {
      background: var(--pn-brand);
      color: #FFFFFF;
    }
    .pn-d__row--active .pn-d__icon { color: #FFFFFF; }

    /* ── Nested group ───────────────────────────────────────────────── */
    .pn-d__group[data-active="true"] > .pn-d__row {
      font-weight: 600;
    }
    .pn-d__group[data-active="true"] > .pn-d__row .pn-d__icon {
      color: var(--pn-ink);
    }
    .pn-d__chev {
      flex-shrink: 0;
      color: var(--pn-ink-3);
      transition: transform var(--pn-fast) ease;
    }
    .pn-d__group[data-open="true"] .pn-d__chev { transform: rotate(180deg); }

    .pn-d__sub {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition: grid-template-rows var(--d-dur-backdrop) var(--pn-ease),
                  visibility 0s linear var(--d-dur-backdrop);
    }
    .pn-d__group[data-open="true"] .pn-d__sub {
      grid-template-rows: 1fr;
      visibility: visible;
      transition-delay: 0s;
    }
    .pn-d__sub-clip {
      min-height: 0;
      overflow: hidden;
    }
    .pn-d__sub-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
      /* Connector sits under the parent icon's centre */
      margin: 2px 0 4px 19px;
      padding: 0 0 0 8px;
      border-left: 1px solid var(--pn-line);
    }
    .pn-d__row--sub {
      min-height: var(--d-row-sub);
      padding: 0 10px;
      font-size: 13.5px;
    }

    /* Keyboard focus: inset so overflow clipping never hides the ring */
    .pn-d a:focus-visible,
    .pn-d button:focus-visible {
      outline: 2px solid var(--pn-focus);
      outline-offset: -2px;
    }
    .pn-d__close:focus-visible { outline-offset: -6px; }

    /* ── Footer: anchored, never scrolls ────────────────────────────── */
    .pn-d__foot {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 12px calc(12px + env(safe-area-inset-bottom, 0px)) 16px;
      background: var(--pn-canvas);
      border-top: 1px solid var(--pn-line);
    }
    .pn-d__foot--marketing {
      justify-content: space-between;
    }
    .pn-d__signin-prompt {
      min-width: 0;
      color: var(--pn-ink-2);
      font-size: 13px;
    }
    .pn-d__user {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .pn-d__avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--pn-ink);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
    }
    .pn-d__who {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.3;
    }
    .pn-d__name {
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: -0.005em;
      color: var(--pn-ink);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pn-d__school {
      font-size: 12px;
      color: var(--pn-ink-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pn-d__signout {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-shrink: 0;
      height: 44px;
      padding: 0 12px;
      background: transparent;
      border: 1px solid var(--pn-line);
      border-radius: var(--pn-radius);
      color: var(--pn-ink-2);
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background var(--pn-fast) ease, color var(--pn-fast) ease,
                  border-color var(--pn-fast) ease;
    }
    .pn-d__signout:active { background: var(--pn-surface); color: var(--pn-ink); }
    @media (hover: hover) {
      .pn-d__signout:hover { background: var(--pn-surface); color: var(--pn-ink); border-color: #D6D6D6; }
    }
  }

  /* Very narrow phones: tighten without changing the structure */
  @media (max-width: 359px) {
    .pn-d { --d-width: 92vw; --d-pad: 10px; }
    .pn-d__signout { padding: 0 10px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pn-d,
    .pn-d *,
    .pn-d *::before,
    .pn-d *::after,
    .pn__trigger {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    .pn-d { transition-delay: 0s !important; }
  }
`;