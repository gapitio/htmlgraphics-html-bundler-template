import {
  CustomVariableModel,
  TypedVariableModel,
  UrlQueryMap,
  urlUtil,
} from "@grafana/data";
import { triggerRender } from "./renderer";
import { VariableOption } from "@grafana/schema";
import {
  ALL_VARIABLE_TEXT,
  ALL_VARIABLE_VALUE,
  VARIABLE_PREFIX,
} from "./htmlGraphicsDeclarations/getTemplateSrv/replace";

function addHiddenOption(selectElement: HTMLSelectElement, value: string) {
  const optionElement = document.createElement("option");
  optionElement.value = value;
  optionElement.textContent = value;
  optionElement.selected = true;
  optionElement.hidden = true;
  selectElement.value = value;
  selectElement.append(optionElement);
}

function createVariableGroup(name: string, variable: VariableOption[]) {
  // const variableGroupElt = document.createElement("div");
  // const labelElement = document.createElement("label");
  // labelElement.setAttribute("for", `var-${key}`);
  // labelElement.textContent = `${key}:`;
  // labelElement.style.fontSize = "14px";
  // const selectElement = document.createElement("select");
  // selectElement.name = key;
  // selectElement.id = key;
  // for (const option of variable) {
  //   const optionElement = document.createElement("option");
  //   optionElement.value = option;
  //   optionElement.textContent = option;
  //   selectElement.append(optionElement);
  // }
  // variableGroupElt.append(labelElement);
  // variableGroupElt.append(selectElement);
  // const panelUpdateEvent = new CustomEvent("panelupdate");
  // selectElement.addEventListener("change", () => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set(`var-${selectElement.id}`, selectElement.value);
  //   history.pushState({}, "", url.href);
  //   triggerRender(panelUpdateEvent);
  // });
  // return { selectElement, variableGroupElt };
}

export const isAllVariable = (variable: any): boolean => {
  if (!variable) {
    return false;
  }

  if (!variable.current) {
    return false;
  }

  if (variable.current.value) {
    const isArray = Array.isArray(variable.current.value);
    if (
      isArray &&
      variable.current.value.length > 0 &&
      variable.current.value[0] === ALL_VARIABLE_VALUE
    ) {
      return true;
    }

    if (!isArray && variable.current.value === ALL_VARIABLE_VALUE) {
      return true;
    }
  }

  if (variable.current.text) {
    const isArray = Array.isArray(variable.current.text);
    if (
      isArray &&
      variable.current.text.length > 0 &&
      variable.current.text[0] === ALL_VARIABLE_TEXT
    ) {
      return true;
    }

    if (!isArray && variable.current.text === ALL_VARIABLE_TEXT) {
      return true;
    }
  }

  return false;
};

function getValueForUrl(variable: any) {
  if (isAllVariable(variable)) {
    return ALL_VARIABLE_TEXT;
  }
  return variable.current.value;
}

function getVariablesUrlParams() {
  const params: UrlQueryMap = {};
  const variables = htmlGraphics.getTemplateSrv().getVariables();
  for (const variable of variables) {
    params[VARIABLE_PREFIX + variable.name] = getValueForUrl(variable as any);
  }
  return params;
}

function getVariableValue(name: string, options: VariableOption[]) {
  const varInUrl = window.location.search
    .replace("?", "")
    .split("&")
    .filter((v) => v.includes(`var-${name}=`));
  const selectedOptions = options.filter(({ selected }) => selected);

  if (varInUrl.length > 0) {
    const values = varInUrl.map((s) => s.split("=")[1]);
    for (const option of Object.values(options)) {
      if (values.includes(String(option.value))) {
        Object.assign(option, { selected: true });
      }
    }
    return values.join(" + ");
  } else if (selectedOptions.length > 0) {
    const activeOptions = options.filter(({ selected }) => selected);
    return activeOptions.map(({ value }) => value).join(" + ");
  } else {
    return String(options[0].value);
  }
}

function updateUrl() {
  const panelUpdateEvent = new CustomEvent("panelupdate");
  const x = getVariablesUrlParams();

  const a = urlUtil.getUrlSearchParams();
  let urlPath = window.location.pathname;
  if (a.theme) {
    urlPath = urlUtil.appendQueryToUrl(
      urlPath,
      urlUtil.toUrlParams({ ["theme"]: a.theme })
    );
  }
  const urlParams = Object.entries(x).map(([key, val]) =>
    urlUtil.toUrlParams({ [key]: val })
  );
  const url = urlUtil.appendQueryToUrl(urlPath, urlParams.join("&"));
  console.log(url);
  history.pushState({}, "", url);
  triggerRender(panelUpdateEvent);
}

// console.log(urlUtil.getUrlSearchParams());

function updateMultiVariable(
  option: VariableOption,
  variable: CustomVariableModel
) {
  if (
    !Array.isArray(variable.current.text) ||
    !Array.isArray(variable.current.value)
  )
    return;
  const { text, value, selected } = option;
  if (variable.includeAll) {
    if (!selected) {
      if (text === ALL_VARIABLE_TEXT) {
        for (const variableOption of Object.values(variable.options)) {
          if (variableOption.text === ALL_VARIABLE_TEXT) {
            Object.assign(variableOption, { selected: true });
            Object.assign(variable.current, {
              text: [ALL_VARIABLE_TEXT],
              value: [ALL_VARIABLE_VALUE],
            });
          } else {
            Object.assign(variableOption, { selected: false });
          }
        }
      }
    } else {
      if (text === ALL_VARIABLE_TEXT) {
        Object.assign(option, { selected: false });
        Object.assign(variable.current, {});
      }
    }
  } else {
    if (!selected) {
      variable.current.text.push(text);
      variable.current.value.push(value);
    } else {
      variable.current.text = variable.current.text.filter(
        (currentText) => currentText !== text
      );
      variable.current.value = variable.current.value.filter(
        (currentValue) => currentValue !== value
      );
    }
    Object.assign(option, { selected: !selected });
  }
  console.log(variable);
}

function createMultiVariableGroup(
  name: string,
  options: VariableOption[],
  variable: TypedVariableModel
) {
  const variableGroupElt = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", `var-${name}`);
  labelElement.textContent = `${name}:`;
  labelElement.style.fontSize = "14px";
  variableGroupElt.append(labelElement);

  const displayButtonElt = document.createElement("button");
  const a = getVariableValue(name, options);
  displayButtonElt.textContent = a;
  variableGroupElt.append(displayButtonElt);

  const optionContainer = document.createElement("div");
  for (const option of Object.values(options)) {
    const optionElt = document.createElement("div");
    const checkboxElt = document.createElement("input");
    checkboxElt.type = "checkbox";
    checkboxElt.value = String(option.value);
    checkboxElt.checked = Boolean(option.selected);
    checkboxElt.name = String(option.text);
    checkboxElt.addEventListener("click", (event) => event.preventDefault());

    const labelElt = document.createElement("label");
    labelElt.textContent = String(option.text);
    labelElt.setAttribute("for", String(option.text));

    optionElt.addEventListener("click", () => {
      //add if All remove others, if add other remove All
      // Object.assign(option, { selected: !option.selected });
      updateMultiVariable(option, variable as CustomVariableModel);
      checkboxElt.checked = Boolean(option.selected);
      updateUrl();
    });

    optionElt.append(labelElt);
    optionElt.append(checkboxElt);
    optionContainer.append(optionElt);
  }
  variableGroupElt.append(optionContainer);
  return variableGroupElt;
}

function updateVariables() {
  const variables = htmlGraphics.getTemplateSrv().getVariables();
  const variableContainer = document.querySelector("#variable-container");
  if (theme.isDark && variableContainer) variableContainer.className = "dark";

  for (const variable of Object.values(variables)) {
    if (variable.type === "custom") {
      const { multi, name, options }: CustomVariableModel = variable;
      if (multi) {
        const variableGroupElt = createMultiVariableGroup(
          name,
          options,
          variable
        );
        variableContainer?.append(variableGroupElt);
      } else {
        const variableGroupElt = createVariableGroup(name, options);
        variableContainer?.append(variableGroupElt);
      }
    }
  }

  // for (const [variableKey, variableValues] of Object.entries(variables)) {
  //   const { selectElement, variableGroupElt } = createVariableGroup(
  //     variableKey,
  //     variableValues
  //   );
  //   const urlSearch = window.location.search.replace("?", "");
  //   const urlVariables = urlSearch.split("&");
  //   if (urlVariables[0] !== "") {
  //     const currentVar = urlVariables
  //       .map((search) => {
  //         const [urlKey, value] = search.replace("var-", "").split("=");
  //         const formatValue = value.includes("+")
  //           ? value.replaceAll("+", " ")
  //           : value;
  //         return { urlKey, value: formatValue };
  //       })
  //       .find(({ urlKey }) => urlKey === variableKey);

  //     if (currentVar) {
  //       if (!variableValues.includes(currentVar.value)) {
  //         addHiddenOption(selectElement, currentVar.value);
  //       } else {
  //         selectElement.value = currentVar.value;
  //       }
  //     }
  //   }
  //   variableContainer?.append(variableGroupElt);
  // }
}

export { updateVariables, addHiddenOption };
