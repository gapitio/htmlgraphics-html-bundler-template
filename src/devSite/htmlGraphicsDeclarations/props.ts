function replaceVariables(value: string) {
  const searchSplit = window.location.search.replace("?", "");
  if (searchSplit.includes(`var-${value}=`)) {
    const varArr = searchSplit.split("&");
    const currentVar = varArr.find((varString) =>
      varString.includes(`var-${value}=`)
    );
    if (currentVar) {
      return currentVar.split("=")[1].replaceAll("+", " ");
    }
    return value;
  } else {
    const currentVariable = Object.keys(variables).find((key) => key === value);
    // incomplete
    return currentVariable;
    // return currentVariable ? variables[value][0] : value;
  }
}

export { replaceVariables };
// replaceVariables: getTemplateSrv().replace.bind(getTemplateSrv()),
