import { htmlGraphicsDecl } from "./htmlGraphics";
import { globalDefinitions } from "./globalDefinitions";
import { renderHandler } from "./renderer";
import { htmlNodeDeclaration } from "./htmlNode";
import { themeHandler } from "./theme";
import { updateVariables } from "./variables";

globalDefinitions();
htmlGraphicsDecl();
updateVariables();
htmlNodeDeclaration();
themeHandler();
renderHandler();
