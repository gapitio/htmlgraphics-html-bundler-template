/*
  Loads onRender and executes it each time the refresh button is pressed
*/

import { variables } from "./variables";
import { updateData } from "./data";
import { updateVariables } from "./updateVariables";

export function triggerRender(event: CustomEvent<unknown>) {
  const onRenderUrl = "/src/onRender.ts";
  htmlNode.dispatchEvent(event);
  htmlNode.onpanelupdate();

  const script = document.querySelector<HTMLScriptElement>(
    `script[src^="${onRenderUrl}"`
  );

  const t = Number.parseInt(script?.src.split("/src/onRender.ts?")[1] ?? "");
  const currentI = Number.isNaN(t) ? 0 : t + 1;

  if (script) script.remove();

  const newScript = document.createElement("script");
  newScript.type = "module";
  newScript.src = `${onRenderUrl}?${currentI}`;
  newScript.defer = true;
  document.head.append(newScript);
}

function renderHandler() {
  updateData();
  updateVariables(variables);

  const refreshButton = document.querySelector("#refresh-button");
  if (!refreshButton) throw new Error("Could not find refresh button.");

  const panelUpdateEvent = new CustomEvent("panelupdate");

  window.addEventListener("load", () => {
    htmlNode.onpanelupdate();
    htmlNode.dispatchEvent(panelUpdateEvent);
  });

  if (!refreshButton) throw new Error("Could not find refresh button.");

  refreshButton.addEventListener("click", () => {
    updateData();
    triggerRender(panelUpdateEvent);
  });
}

renderHandler();
