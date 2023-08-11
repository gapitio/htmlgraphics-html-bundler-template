import { triggerRender } from "./renderer";

function addHiddenOption(selectElement: HTMLSelectElement, value: string) {
  const optionElement = document.createElement("option");
  optionElement.value = value;
  optionElement.textContent = value;
  optionElement.selected = true;
  optionElement.hidden = true;
  selectElement.value = value;
  selectElement.append(optionElement);
}

function createVariableGroup(key: string, variable: string[]) {
  const variableGroupElt = document.createElement("div");
  variableGroupElt.id = `variable-${key}`;
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", key);
  labelElement.textContent = `${key}:`;
  labelElement.style.fontSize = "14px";

  const selectElement = document.createElement("select");
  selectElement.name = key;
  selectElement.id = key;

  for (const option of variable) {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.append(optionElement);
  }

  variableGroupElt.append(labelElement);
  variableGroupElt.append(selectElement);

  const panelUpdateEvent = new CustomEvent("panelupdate");
  selectElement.addEventListener("change", () => {
    const url = new URL(window.location.href);
    url.searchParams.set(`var-${selectElement.id}`, selectElement.value);
    history.pushState({}, "", url.href);
    triggerRender(panelUpdateEvent);
  });
  return { selectElement, variableGroupElt };
}

function updateVariables(variables: Record<string, string[]>) {
  const variableContainer = document.querySelector("#variable-container");
  if (window.location.search.includes("theme=dark") && variableContainer)
    variableContainer.className = "dark";
  for (const [variableKey, variableValues] of Object.entries(variables)) {
    const { selectElement, variableGroupElt } = createVariableGroup(
      variableKey,
      variableValues
    );
    const urlSearch = window.location.search.replace("?", "");
    const urlVariables = urlSearch.split("&");
    if (urlVariables[0] !== "") {
      const currentVar = urlVariables
        .map((search) => {
          const [urlKey, value] = search.replace("var-", "").split("=");
          const formatValue = value.includes("+")
            ? value.replaceAll("+", " ")
            : value;
          return { urlKey, value: formatValue };
        })
        .find(({ urlKey }) => urlKey === variableKey);

      if (currentVar) {
        if (!variableValues.includes(currentVar.value)) {
          addHiddenOption(selectElement, currentVar.value);
        } else {
          selectElement.value = currentVar.value;
        }
      }
    }
    variableContainer?.append(variableGroupElt);
  }
}

export { updateVariables, addHiddenOption };
