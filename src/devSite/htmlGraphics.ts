import {
  updateData,
  partial,
  replaceVariables,
  getTemplateSrv,
} from "./htmlGraphicsDeclarations";

export function htmlGraphicsDecl() {
  window.htmlGraphics = {
    data: updateData(),
    props: {
      replaceVariables,
    },
    locationService: {
      partial,
    },
    getTemplateSrv,
  };
}
