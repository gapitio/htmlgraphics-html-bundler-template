import type { HTMLNode } from "../../types/htmlgraphicsTypes/htmlNode";
import html from "../html.html";

const shadowContainer = document.querySelector("#shadow-container");
if (!shadowContainer) throw new Error("Could not find shadow container.");

window.htmlNode = shadowContainer.attachShadow({ mode: "open" }) as HTMLNode;

htmlNode.onpanelupdate = () => {};
htmlNode.innerHTML = `<style>@import "build/style.css"</style><div>${html}</div>`;
