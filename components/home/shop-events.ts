/** Lets the hero, banner and header links pick a shop tab without sharing state. */
export const SHOP_TAB_EVENT = "euro:shop-tab";

export function selectShopTab(tab: string) {
  window.dispatchEvent(new CustomEvent(SHOP_TAB_EVENT, { detail: tab }));
}
