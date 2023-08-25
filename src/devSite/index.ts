import { htmlGraphicsDecl } from "./htmlGraphics";
import { globalDefinitions } from "./globalDefinitions";
import { renderHandler } from "./renderer";
import { htmlNodeDeclaration } from "./htmlNode";
import { themeHandler } from "./theme";
import { setVariables } from "./variables";

globalDefinitions();
htmlGraphicsDecl();
setVariables();
htmlNodeDeclaration();
themeHandler();
renderHandler();
