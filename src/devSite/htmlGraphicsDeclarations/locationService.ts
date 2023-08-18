import { triggerRender } from "../renderer";
import { addHiddenOption } from "../updateVariables";

function partial(query: string, replace?: boolean) {
  const panelUpdateEvent = new CustomEvent("panelupdate");
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(query)) {
    const selectElement = document.querySelector<HTMLSelectElement>(
      `#${key.split("-")[1]}`
    );
    if (selectElement) {
      for (const optionElt of selectElement.options) {
        if (optionElt.value === value) {
          optionElt.selected = true;
        } else {
          addHiddenOption(selectElement, value);
        }
      }
    }
    url.searchParams.set(key, value);
    if (replace) {
      history.replaceState({}, "", url.href);
    } else {
      history.pushState({}, "", url.href);
    }
  }
  triggerRender(panelUpdateEvent);
}

export { partial };
