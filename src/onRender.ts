const multiSpan = htmlNode.querySelector<HTMLSpanElement>("#Multi-span");
const includeAllMultiSpan = htmlNode.querySelector<HTMLSpanElement>(
  "#IncludeAllMulti-span"
);
const includeAllSingleSpan = htmlNode.querySelector<HTMLSpanElement>(
  "#IncludeAllSingle-span"
);
const singleSpan = htmlNode.querySelector<HTMLSpanElement>("#Single-span");

if (multiSpan)
  multiSpan.textContent = htmlGraphics.getTemplateSrv().replace("$Multi");
if (includeAllMultiSpan)
  includeAllMultiSpan.textContent = htmlGraphics
    .getTemplateSrv()
    .replace("$IncludeAllMulti");
if (includeAllSingleSpan)
  includeAllSingleSpan.textContent = htmlGraphics
    .getTemplateSrv()
    .replace("$IncludeAllSingle");
if (singleSpan)
  singleSpan.textContent = htmlGraphics.getTemplateSrv().replace("$Single");
