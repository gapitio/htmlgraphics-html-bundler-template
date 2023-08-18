const podSpan = htmlNode.querySelector<HTMLSpanElement>("#pod-span");
const padSpan = htmlNode.querySelector<HTMLSpanElement>("#pad-span");
const randomSpan = htmlNode.querySelector<HTMLSpanElement>("#random-span");

if (podSpan) podSpan.textContent = htmlGraphics.props.replaceVariables("Pod");
if (padSpan) padSpan.textContent = htmlGraphics.props.replaceVariables("Pad");
if (randomSpan)
  randomSpan.textContent = htmlGraphics.props.replaceVariables("random");

const buttonElt = htmlNode.querySelector<HTMLButtonElement>("#button");
if (buttonElt)
  buttonElt.addEventListener("click", () => {
    htmlGraphics.locationService.partial({ [`var-Pod`]: "Herp" }, true);
  });

const result = htmlGraphics.getTemplateSrv().replace("$Sample");
