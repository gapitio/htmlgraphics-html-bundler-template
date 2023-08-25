/* eslint-disable unicorn/better-regex */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-types */
import { ScopedVars, VariableType } from "@grafana/data";
import { VariableInterpolation } from "@grafana/runtime";
import {
  FormatVariable,
  VariableCustomFormatterFn,
  VariableValue,
  formatRegistry,
  sceneGraph,
} from "@grafana/scenes";
import { VariableFormatID, VariableModel } from "@grafana/schema";

export const ALL_VARIABLE_VALUE = "$__all";
export const ALL_VARIABLE_TEXT = "All";
export const variableRegex =
  /\$(\w+)|\[\[(\w+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::([^\}]+))?}/g;
export const VARIABLE_PREFIX = "var-";

class LegacyVariableWrapper implements FormatVariable {
  state: {
    name: string;
    value: VariableValue;
    text: VariableValue;
    type: VariableType;
  };

  constructor(
    variable: VariableModel,
    value: VariableValue,
    text: VariableValue
  ) {
    this.state = { name: variable.name, value, text, type: variable.type };
  }

  getValue(_fieldPath: string): VariableValue {
    const { value } = this.state;

    if (value === "string" || value === "number" || value === "boolean") {
      return value;
    }

    return String(value);
  }

  getValueText(): string {
    const { value, text } = this.state;

    if (typeof text === "string") {
      return value === ALL_VARIABLE_VALUE ? ALL_VARIABLE_TEXT : text;
    }

    if (Array.isArray(text)) {
      return text.join(" + ");
    }

    return String(text);
  }
}

let legacyVariableWrapper: LegacyVariableWrapper | undefined;
function getVariableWrapper(
  variable: VariableModel,
  value: VariableValue,
  text: VariableValue
) {
  if (!legacyVariableWrapper) {
    legacyVariableWrapper = new LegacyVariableWrapper(variable, value, text);
  } else {
    legacyVariableWrapper.state.name = variable.name;
    legacyVariableWrapper.state.type = variable.type;
    legacyVariableWrapper.state.value = value;
    legacyVariableWrapper.state.text = text;
  }

  return legacyVariableWrapper;
}

type ReplaceFunction = (
  fullMatch: string,
  variableName: string,
  fieldPath: string,
  format: string
) => string;

export function getVariableAtIndex(name: string): any {
  if (!name) {
    return;
  }

  return htmlGraphics
    .getTemplateSrv()
    .getVariables()
    .find(({ name: varName }) => varName === name);
}

function _replaceWithVariableRegex(
  text: string,
  format: string | Function | undefined,
  replace: ReplaceFunction
) {
  return text.replace(
    variableRegex,
    (match, var1, var2, fmt2, var3, fieldPath, fmt3) => {
      const variableName = var1 || var2 || var3;
      const fmt = fmt2 || fmt3 || format;
      return replace(match, variableName, fieldPath, fmt);
    }
  );
}

function isAllValue(value: any) {
  return (
    value === ALL_VARIABLE_VALUE ||
    (Array.isArray(value) && value[0] === ALL_VARIABLE_VALUE)
  );
}

function getAllValue(variable: any) {
  if (variable.allValue) {
    return variable.allValue;
  }
  const values = [];
  for (let i = 1; i < variable.options.length; i++) {
    values.push(variable.options[i].value);
  }
  return values;
}

function formatVariableValue(
  value: any,
  format?: any,
  variable?: any,
  text?: string
): string {
  variable = variable || {};

  if (value === null || value === undefined) {
    return "";
  }

  // if (isAdHoc(variable) && format !== VariableFormatID.QueryParam) {
  //   return "";
  // }

  if (!Array.isArray(value) && typeof value === "object") {
    value = `${value}`;
  }

  if (typeof format === "function") {
    return format(value, variable, formatVariableValue);
  }

  if (!format) {
    format = VariableFormatID.Glob;
  }

  let args = format.split(":");
  if (args.length > 1) {
    format = args[0];
    args = args.slice(1);
  } else {
    args = [];
  }

  let formatItem = formatRegistry.getIfExists(format);

  if (!formatItem) {
    console.error(
      `Variable format ${format} not found. Using glob format as fallback.`
    );
    formatItem = formatRegistry.get(VariableFormatID.Glob);
  }

  const formatVariable = getVariableWrapper(variable, value, text ?? value);
  return formatItem.formatter(value, args, formatVariable);
}

function _evaluateVariableExpression(
  match: string,
  variableName: string,
  fieldPath: string,
  format: string | VariableCustomFormatterFn | undefined,
  scopedVars: ScopedVars | undefined
): string {
  if (scopedVars) console.debug("scopedVars is not implemented");
  if (fieldPath) console.debug("fieldPath is not implemented");
  const variable = getVariableAtIndex(variableName);

  if (!variable) return match;

  let value = variable.current.value;
  let text = variable.current.text;

  if (isAllValue(value)) {
    value = getAllValue(variable);
    text = ALL_VARIABLE_TEXT;
    // skip formatting of custom all values unless format set to text or percentencode
    if (
      variable.allValue &&
      format !== VariableFormatID.Text &&
      format !== VariableFormatID.PercentEncode
    ) {
      return replace(value);
    }
  }

  return formatVariableValue(value, format, variable, text);
}

export function replace(
  target?: string,
  scopedVars?: ScopedVars,
  format?: string,
  interpolations?: VariableInterpolation[]
) {
  if (scopedVars && scopedVars.__sceneObject) {
    return sceneGraph.interpolate(
      scopedVars.__sceneObject.value,
      target,
      scopedVars,
      format as string | VariableCustomFormatterFn | undefined
    );
  }

  if (!target) {
    return target ?? "";
  }

  return _replaceWithVariableRegex(
    target,
    format,
    (match, variableName, fieldPath, fmt) => {
      const value = _evaluateVariableExpression(
        match,
        variableName,
        fieldPath,
        fmt,
        scopedVars
      );

      if (interpolations) {
        interpolations.push({
          match,
          variableName,
          fieldPath,
          format: fmt,
          value,
          found: value !== match,
        });
      }

      return value;
    }
  );
}
/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable no-param-reassign */
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable no-useless-escape */
/* eslint-enable unicorn/better-regex */
