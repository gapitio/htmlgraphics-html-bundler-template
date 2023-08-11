import { triggerRender } from "./renderer";
import { addHiddenOption } from "./updateVariables";
import { variables } from "./variables";

window.htmlGraphics = {
  props: {
    replaceVariables: (value: string) => {
      const searchSplit = window.location.search.replace("?", "");
      if (searchSplit.includes(`var-${value}=`)) {
        const varArr = searchSplit.split("&");
        const currentVar = varArr.find((varString) =>
          varString.includes(`var-${value}=`)
        );
        if (currentVar) {
          return currentVar.split("=")[1].replaceAll("+", " ");
        }
        return value;
      } else {
        const currentVariable = Object.keys(variables).find(
          (key) => key === value
        );
        return currentVariable ? variables[value][0] : value;
      }
    },
  },
  locationService: {
    partial: (query, replace) => {
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
    },
  },
};
