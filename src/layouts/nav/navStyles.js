// Shared by MarketingNav and AppNav so both bars look like one product.
// Height is fixed at 64px because every existing page already reserves
// `padding-top: 64px` for the old fixed navigation.
export const NAV_CSS = `
  .pn { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px;
    background: #fff; border-bottom: 1px solid #E5E7EB; font-family: Inter, system-ui, -apple-system, sans-serif; }
  .pn__inner { max-width: 1200px; height: 100%; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; gap: 28px; }
  .pn__logo { display: flex; align-items: center; flex-shrink: 0; }
  .pn__logo img { height: 32px; width: auto; display: block; }
  .pn__links { display: flex; align-items: center; gap: 4px; flex: 1; }
  .pn__link { color: #374151; text-decoration: none; font-size: 15px; font-weight: 500;
    padding: 8px 12px; border-radius: 8px; white-space: nowrap; }
  .pn__link:hover { background: #F3F4F6; color: #111827; }
  .pn__link--active { color: #0b69ff; background: #EFF6FF; }
  .pn__actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .pn__btn { font: inherit; font-size: 15px; font-weight: 600; padding: 9px 16px; border-radius: 8px;
    text-decoration: none; cursor: pointer; border: 1px solid transparent; white-space: nowrap; }
  .pn__btn--primary { background: #0b69ff; color: #fff; }
  .pn__btn--primary:hover { background: #0957d6; }
  .pn__btn--ghost { background: transparent; color: #111827; border-color: #D1D5DB; }
  .pn__btn--ghost:hover { background: #F3F4F6; }
  .pn__burger { display: none; margin-left: auto; background: none; border: 1px solid #D1D5DB;
    border-radius: 8px; padding: 8px 12px; font: inherit; font-size: 15px; font-weight: 600; color: #111827; cursor: pointer; }
  .pn a:focus-visible, .pn button:focus-visible { outline: 3px solid #93C5FD; outline-offset: 2px; }
  .pn__panel { display: none; }

  .pn__user { position: relative; }
  .pn__userbtn { display: flex; align-items: center; gap: 10px; background: none; border: 1px solid #E5E7EB;
    border-radius: 999px; padding: 5px 12px 5px 5px; cursor: pointer; font: inherit; color: #111827; }
  .pn__userbtn:hover { background: #F9FAFB; }
  .pn__avatar { width: 30px; height: 30px; border-radius: 50%; background: #0b69ff; color: #fff;
    display: grid; place-items: center; font-size: 13px; font-weight: 700; }
  .pn__username { font-size: 14px; font-weight: 600; line-height: 1.2; text-align: left; }
  .pn__school { display: block; font-size: 12px; font-weight: 400; color: #6B7280; max-width: 160px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pn__menu { position: absolute; right: 0; top: calc(100% + 8px); min-width: 220px; background: #fff;
    border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); padding: 6px; }
  .pn__menuitem { display: block; width: 100%; text-align: left; background: none; border: 0; font: inherit;
    font-size: 15px; color: #111827; text-decoration: none; padding: 10px 12px; border-radius: 6px; cursor: pointer; }
  .pn__menuitem:hover { background: #F3F4F6; }
  .pn__menusep { height: 1px; background: #E5E7EB; margin: 6px 0; }

  @media (max-width: 960px) {
    .pn__links, .pn__actions { display: none; }
    .pn__burger { display: block; }
    .pn__panel { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: #fff;
      padding: 16px 24px 32px; overflow-y: auto; border-top: 1px solid #E5E7EB; }
    .pn__panel .pn__link { display: block; font-size: 17px; padding: 14px 8px; border-radius: 0; border-bottom: 1px solid #F3F4F6; }
    .pn__panel .pn__btn { display: block; text-align: center; margin-top: 12px; font-size: 16px; padding: 13px 16px; width: 100%; box-sizing: border-box; }
  }
`;
