/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import {
  CustomVariableModel,
  LoadingState,
  VariableHide,
  VariableOption,
} from "@grafana/data";

function getCurrentTargets(
  options: VariableOption[],
  multi: boolean
): VariableOption | Record<string, never> {
  const currentTargets = options.filter(({ selected }) => selected);
  return multi
    ? {
        selected: true,
        text: currentTargets.flatMap(({ text }) => text),
        value: currentTargets.flatMap(({ value }) => value),
      }
    : currentTargets[0];
}

function createVariable({
  name,
  options,
  includeAll = false,
  multi = false,
  label,
  id,
  type = "custom",
  rootStateKey = "-ABC_DEFG",
  global = false,
  allValue = null,
  description = null,
  error = null,
  index = 1,
  skipUrlSync = false,
  hide = 0,
}: {
  name: string;
  options: string[];
  includeAll?: boolean;
  multi?: boolean;
  label?: string | undefined;
  id?: string | undefined;
  type?: "custom";
  rootStateKey?: string;
  global?: boolean;
  allValue?: string | null | undefined;
  description?: string | null;
  error?: any;
  index?: number;
  skipUrlSync?: boolean;
  hide?: VariableHide;
}): CustomVariableModel {
  const opt = options.map((val, i) => {
    return { text: val, value: val, selected: i === 0 };
  });
  if (includeAll)
    opt.splice(0, 0, { text: "All", value: "$__all", selected: false });

  return {
    name,
    label: label || name,
    id: id || name,
    type,
    rootStateKey,
    global,
    hide,
    skipUrlSync,
    index,
    state: LoadingState.Done,
    error,
    description,
    multi,
    includeAll,
    allValue,
    current: getCurrentTargets(opt, multi),
    options: opt,
    query: options.join(","),
  };
}

export function setVariables() {
  window.variables = [
    createVariable({
      name: "Multi",
      options: ["Var1", "Var2", "Var3"],
      multi: true,
      includeAll: false,
    }),
    createVariable({
      name: "IncludeAllMulti",
      options: ["Var1", "Var2", "Var3"],
      multi: true,
      includeAll: true,
    }),
    createVariable({
      name: "IncludeAllSingle",
      options: ["Var1", "Var2", "Var3"],
      multi: false,
      includeAll: true,
    }),
    createVariable({ name: "Single", options: ["Var1", "Var2", "Var3"] }),
  ];
}

/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable unicorn/no-null */
