import type { HTMLNode } from "../../types/htmlgraphicsTypes/htmlNode";
import html from "../html.html?raw";

const shadowContainer = document.querySelector("#shadow-container");
if (!shadowContainer) throw new Error("Could not find shadow container.");

window.htmlNode = shadowContainer.attachShadow({ mode: "open" }) as HTMLNode;

htmlNode.onpanelupdate = () => {
  // Do nothing
};
htmlNode.innerHTML = `<style>@import "/src/style.css"</style>${html}`;
