/* eslint-disable unicorn/no-null */
import { getVariableAtIndex, variableRegex } from "./replace";

function getVariableName(expression: string) {
  const match = variableRegex.exec(expression);
  if (!match) {
    return null;
  }
  const variableName = match.slice(1).find((match) => match !== undefined);
  return variableName;
}

export function containsTemplate(target: string | undefined): boolean {
  if (!target) {
    return false;
  }
  const name = getVariableName(target);
  const variable = name && getVariableAtIndex(name);
  return variable !== null && variable !== undefined;
}
/* eslint-enable unicorn/no-null */
