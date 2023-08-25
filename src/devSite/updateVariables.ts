/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CustomVariableModel,
  UrlQueryMap,
  urlUtil,
  VariableOption,
} from "@grafana/data";
import { triggerRender } from "./renderer";
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
    params[VARIABLE_PREFIX + variable.name] = getValueForUrl(variable);
  }
  return params;
}

function getVariableValue(name: string, variable: CustomVariableModel) {
  const varInUrl = window.location.search
    .replace("?", "")
    .split("&")
    .filter((v) => v.includes(`var-${name}=`));

  const selectedOptions = variable.options.filter(({ selected }) => selected);
  if (varInUrl.length > 0) {
    const values = varInUrl.map((s) => s.split("=")[1]);
    const optionsFromUrl = variable.options.filter(({ value }) =>
      values.find(
        (a) =>
          a === value ||
          (a === ALL_VARIABLE_TEXT && value === ALL_VARIABLE_VALUE)
      )
    );
    for (const option of Object.values(variable.options)) {
      Object.assign(option, { selected: false });
    }
    if (variable.multi) {
      const selectedParams: {
        selected: boolean;
        value: string[];
        text: string[];
      } = { selected: true, value: [], text: [] };
      for (const opt of optionsFromUrl) {
        Object.assign(opt, { selected: true });
        selectedParams.value.push(
          ...(typeof opt.value == "string" ? [opt.value] : opt.value)
        );
        selectedParams.text.push(
          ...(typeof opt.text == "string" ? [opt.text] : opt.text)
        );
      }
      variable.current = selectedParams;
    } else {
      const selectedOption = optionsFromUrl[0];
      variable.current = {
        text: selectedOption.text,
        value: selectedOption.value,
        selected: true,
      };
      Object.assign(selectedOption, { selected: true });
    }

    return values.join(" + ");
  } else if (selectedOptions.length > 0) {
    const activeOptions = variable.options.filter(({ selected }) => selected);
    return activeOptions.map(({ value }) => value).join(" + ");
  } else {
    return String(variable.options[0].value);
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
  history.pushState({}, "", url);
  triggerRender(panelUpdateEvent);
}

function updateMultiVariable(
  option: VariableOption,
  variable: CustomVariableModel
) {
  const { text, value, selected } = option;
  const { options, includeAll, current } = variable;

  if (!Array.isArray(current.text) || !Array.isArray(current.value)) return;
  if (selected && options.filter(({ selected }) => selected).length < 2) return;
  if (includeAll) {
    if (!selected) {
      if (text === ALL_VARIABLE_TEXT) {
        for (const variableOption of Object.values(options)) {
          if (variableOption.text === ALL_VARIABLE_TEXT) {
            Object.assign(variableOption, { selected: true });
            Object.assign(current, {
              text: [ALL_VARIABLE_TEXT],
              value: [ALL_VARIABLE_VALUE],
            });
          } else {
            Object.assign(variableOption, { selected: false });
          }
        }
      } else {
        if (current.text.includes(ALL_VARIABLE_TEXT)) {
          Object.assign(options[0], { selected: false });
          Object.assign(option, { selected: true });
          Object.assign(current, {
            text: [text],
            value: [value],
          });
        } else {
          current.text.push(...(typeof text == "string" ? [text] : text));
          current.value.push(...(typeof value == "string" ? [value] : value));
          Object.assign(option, { selected: true });
        }
      }
    } else {
      if (text === ALL_VARIABLE_TEXT) {
        Object.assign(option, { selected: false });
        Object.assign(current, {
          text: [options[1].text],
          value: [options[1].value],
        });
        Object.assign(options[1], { selected: true });
      } else {
        current.text = current.text.filter(
          (currentText) => currentText !== text
        );
        current.value = current.value.filter(
          (currentValue) => currentValue !== value
        );
        Object.assign(option, { selected: false });
      }
    }
  } else {
    if (!selected) {
      current.text.push(...(typeof text == "string" ? [text] : text));
      current.value.push(...(typeof value == "string" ? [value] : value));
    } else {
      current.text = current.text.filter((currentText) => currentText !== text);
      current.value = current.value.filter(
        (currentValue) => currentValue !== value
      );
    }
    Object.assign(option, { selected: !selected });
  }
}

function updateSingleVariable(
  option: VariableOption,
  variable: CustomVariableModel
) {
  const { options } = variable;
  if (option.selected) return;
  for (const variableOption of Object.values(options)) {
    if (variableOption.text === option.text) {
      Object.assign(variableOption, { selected: true });
    } else {
      Object.assign(variableOption, { selected: false });
    }
  }
  variable.current = option;
}

function createMultiVariableGroup(variable: CustomVariableModel) {
  const variableGroupElt = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", `var-${variable.name}`);
  labelElement.textContent = `${variable.name}:`;
  labelElement.style.fontSize = "14px";
  variableGroupElt.append(labelElement);

  const displayButtonElt = document.createElement("button");
  const displayText = document.createElement("span");
  displayText.textContent = getVariableValue(variable.name, variable);
  displayButtonElt.append(displayText);
  const displayPointer = document.createElement("span");
  displayPointer.textContent = "v";
  displayButtonElt.append(displayPointer);
  const buttonContainer = document.createElement("div");
  buttonContainer.append(displayButtonElt);
  variableGroupElt.append(buttonContainer);
  displayButtonElt.addEventListener("click", () => {
    optionContainer.style.display =
      optionContainer.style.display === "none" ? "block" : "none";
  });
  const optionContainer = document.createElement("div");
  optionContainer.id = "option-container-multi";
  optionContainer.style.display = "none";
  for (const option of Object.values(variable.options)) {
    const optionElt = document.createElement("div");
    const checkboxElt = document.createElement("input");
    checkboxElt.type = "checkbox";
    checkboxElt.value = String(option.value);
    checkboxElt.checked = Boolean(option.selected);
    checkboxElt.name = `${variable.name}-${option.text}`;
    checkboxElt.id = `${variable.name}-${option.text}`;
    checkboxElt.addEventListener("click", (event) => event.preventDefault());

    const labelElt = document.createElement("label");
    labelElt.textContent = String(option.text);
    labelElt.setAttribute("for", String(option.text));

    optionElt.addEventListener("click", () => {
      updateMultiVariable(option, variable);
      for (const { selected, text } of variable.options) {
        const checkbox: HTMLInputElement | null = optionContainer.querySelector(
          `[id^=${variable.name}-${text}]`
        );
        if (checkbox) checkbox.checked = selected;
      }
      displayText.textContent = Array.isArray(variable.current.text)
        ? variable.current.text.join(" + ")
        : variable.current.text;
      updateUrl();
    });

    optionElt.append(labelElt);
    optionElt.append(checkboxElt);
    optionContainer.append(optionElt);
  }
  buttonContainer.append(optionContainer);
  variableGroupElt.append(buttonContainer);
  return variableGroupElt;
}

function createSingleVariableGroup(variable: CustomVariableModel) {
  const { name, options } = variable;
  const variableGroupElt = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", `var-${name}`);
  labelElement.textContent = `${name}:`;
  labelElement.style.fontSize = "14px";
  variableGroupElt.append(labelElement);

  const displayButtonElt = document.createElement("button");
  const displayText = document.createElement("span");
  displayText.textContent = getVariableValue(name, variable);
  displayButtonElt.append(displayText);
  const displayPointer = document.createElement("span");
  displayPointer.textContent = "v";
  displayButtonElt.append(displayPointer);
  const buttonContainer = document.createElement("div");
  buttonContainer.append(displayButtonElt);
  variableGroupElt.append(buttonContainer);

  const optionContainer = document.createElement("div");
  buttonContainer.addEventListener("click", () => {
    optionContainer.style.display =
      optionContainer.style.display === "none" ? "flex" : "none";
  });
  optionContainer.id = "option-container-single";
  optionContainer.style.display = "none";
  for (const option of Object.values(options)) {
    const buttonElt = document.createElement("button");
    buttonElt.textContent = String(option.text);
    buttonElt.name = `${name}-${option.text}`;
    buttonElt.id = `${name}-${option.text}`;
    if (option.selected) buttonElt.className = "selected";

    buttonElt.addEventListener("click", () => {
      updateSingleVariable(option, variable);
      displayText.textContent = String(option.text);
      for (const elt of optionContainer.children) {
        elt.className = "";
      }
      buttonElt.className = "selected";
      optionContainer.style.display = "none";
      updateUrl();
    });

    optionContainer.append(buttonElt);
  }
  buttonContainer.append(optionContainer);
  variableGroupElt.append(buttonContainer);
  return variableGroupElt;
}

function handleVariables() {
  const variables = htmlGraphics.getTemplateSrv().getVariables();
  const variableContainer = document.querySelector("#variable-container");
  if (theme.isDark && variableContainer) variableContainer.className = "dark";

  for (const variable of Object.values(variables)) {
    if (variable.type === "custom") {
      if (variable.multi) {
        const variableGroupElt = createMultiVariableGroup(variable);
        variableContainer?.append(variableGroupElt);
      } else {
        const variableGroupElt = createSingleVariableGroup(variable);
        variableContainer?.append(variableGroupElt);
      }
    } else {
      console.error("Only 'Custom' variables are supported");
    }
  }
}

export { handleVariables, addHiddenOption };
/* eslint-enable @typescript-eslint/no-explicit-any */
