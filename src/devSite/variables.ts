/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import {
  LoadingState,
  VariableHide,
  VariableOption,
  VariableType,
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
}: {
  name: string;
  options: string[];
  includeAll?: boolean;
  multi?: boolean;
}): CustomVariableModel {
  const opt = options.map((val, i) => {
    return { text: val, value: val, selected: i === 0 };
  });
  if (includeAll)
    opt.splice(0, 0, { text: "All", value: "$__all", selected: false });

  return {
    name,
    label: name,
    id: name,
    type: "custom",
    rootStateKey: "-ABC_DEFG",
    global: false,
    hide: 0,
    skipUrlSync: false,
    index: 1,
    state: LoadingState.Done,
    error: null,
    description: null,
    multi,
    includeAll,
    allValue: null,
    current: getCurrentTargets(opt, includeAll || multi),
    options: opt,
    query: options.join(","),
  };
}

export function updateVariables() {
  window.variables = [
    createVariable({
      name: "Multi",
      options: ["Var1", "Var2", "Var3"],
      multi: true,
      includeAll: false,
    }),
    createVariable({
      name: "includeAll",
      options: ["Var1", "Var2", "Var3"],
      multi: true,
      includeAll: true,
    }),
    createVariable({ name: "Sample2", options: ["Var4", "Var5", "Var6"] }),
  ];
}

export const variables: Record<string, string[]> = {
  Sample: ["Var1", "Var2", "Var3"],
};

interface CustomVariableModel extends VariableWithMultiSupport {
  type: "custom";
}

interface VariableWithMultiSupport extends VariableWithOptions {
  multi: boolean;
  includeAll: boolean;
  allValue?: string | null;
}

export interface VariableWithOptions extends BaseVariableModel {
  current: VariableOption | Record<string, never>;
  options: VariableOption[];
  query: string;
}

interface BaseVariableModel {
  name: string;
  label?: string;
  id: string;
  type: VariableType;
  rootStateKey: string | null;
  global: boolean;
  hide: VariableHide;
  skipUrlSync: boolean;
  index: number;
  state: LoadingState;
  error: any | null;
  description: string | null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable unicorn/no-null */
