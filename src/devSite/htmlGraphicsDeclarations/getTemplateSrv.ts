import { TimeRange, TypedVariableModel } from "@grafana/data";
import { replace } from "./getTemplateSrv/replace";
import { containsTemplate } from "./getTemplateSrv/containsTemplate";

export function getTemplateSrv(): {
  containsTemplate: (target: string | undefined) => boolean;
  getVariables: () => TypedVariableModel[];
  replace: (target?: string) => void;
  updateTimeRange: (timeRange: TimeRange) => void;
} {
  return {
    containsTemplate,
    getVariables: () => window.variables,
    replace,
    updateTimeRange: () => {
      console.debug("updateTimeRange is not implemented");
    },
  };
}
