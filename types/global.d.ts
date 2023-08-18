/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PanelData } from "@grafana/data";
import type { OptionsInterface } from "./htmlgraphicsTypes/options";
import type customPropertiesJSON from "../src/custom-properties.json";
import type { HTMLNode } from "./htmlgraphicsTypes/htmlNode";
import type { GrafanaTheme } from "./htmlgraphicsTypes/theme";
import type { TemplateSrv } from "@grafana/runtime";

declare global {
  const variables: TypedVariableModel[];
  /**
   * The [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) which contains the elements added in the HTML/SVG document.
   */
  const htmlNode: HTMLNode;
  /**
   * The parsed JSON object from the Custom properties option.
   *
   * @deprecated in favor of {@link customProperties}
   */
  const codeData: JSONType;
  /**
   * The parsed JSON object from the Custom properties option.
   */
  const customProperties: customPropertiesJSON;
  /**
   * The PanelData interface passed into the panel by Grafana.
   */
  const data: PanelData;
  /**
   * The options object.
   */
  const options: OptionsInterface;
  /**
   * The GrafanaTheme object. It stores the current theme (light/dark), colors used by grafana, ETC.
   */
  const theme: GrafanaTheme;
  /**
   * Used to retrieve the {@link TemplateSrv} that can be used to fetch available
   * template variables.
   *
   */
  const getTemplateSrv: () => TemplateSrv;
  /**
   * Used to retrieve the {@link LocationSrv} that can be used to automatically navigate
   * the user to a new place in Grafana.
   *
   * @deprecated in favor of {@link locationService} and will be removed in Grafana 9
   */
  const getLocationSrv: typeof getLocationSrvType;

  const htmlGraphics: {
    /**
     * The [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) which contains the elements added in the HTML/SVG document.
     */
    htmlNode: typeof htmlNode;
    /**
     * The parsed JSON object from the Custom properties option.
     *
     * @deprecated in favor of {@link customProperties}
     */
    codeData: typeof codeData;
    /**
     * The parsed JSON object from the Custom properties option.
     */
    customProperties: typeof customProperties;
    /**
     * The PanelData interface passed into the panel by Grafana.
     */
    data: typeof data;
    /**
     * The options object.
     */
    options: typeof options;
    /**
     * The GrafanaTheme object. It stores the current theme (light/dark), colors used by grafana, ETC.
     */
    theme: typeof theme;
    /**
     * The new GrafanaTheme2 object introduced in Grafana v8. It stores the current theme (light/dark), colors used by grafana, ETC.
     */
    theme2: GrafanaTheme2;
    /**
     * Used to retrieve the {@link TemplateSrv} that can be used to fetch available
     * template variables.
     *
     */
    getTemplateSrv: () => TemplateSrv;
    /**
     * Used to retrieve the {@link LocationSrv} that can be used to automatically navigate
     * the user to a new place in Grafana.
     *
     * @deprecated in favor of {@link locationService} and will be removed in Grafana 9
     */
    getLocationSrv: typeof getLocationSrv;
    /**
     * A wrapper to help work with browser location and history.
     */
    locationService: LocationService;
    /**
     * Containing all the props from the panel PanelProps.
     */
    props: PanelProps<OptionsInterface>;
    /**
     * The width of the panel
     */
    width: number;
    /**
     * The height of the panel
     */
    height: number;
    /**
     * Returns a list of reduced values.
     */
    getFieldDisplayValues: (
      options: PopulatedGetFieldDisplayValuesOptions
    ) => FieldDisplay[];
    /**
     * List of reduced values.
     */
    fieldDisplayValues: FieldDisplay[];
    /**
     * A list of the reducers.
     */
    fieldReducers: Registry<FieldReducerInfo>;
  };
  interface Window {
    variables: typeof variables;
    htmlNode: typeof htmlNode;
    customProperties: typeof customProperties;
    data: typeof data;
    options: typeof options;
    theme: typeof theme;
    codeData: typeof codeData;
    getTemplateSrv: typeof getTemplateSrvType;
    getLocationSrv: typeof getLocationSrvType;
    htmlGraphics: {
      // htmlNode: typeof htmlNode;
      // codeData: typeof codeData;
      // customProperties: typeof customProperties;
      data: typeof data;
      // options: typeof options;
      // theme: typeof theme;
      // theme2: GrafanaTheme2;
      getTemplateSrv: typeof getTemplateSrv;
      // getLocationSrv: typeof getLocationSrv;
      locationService: LocationService;
      props: PanelProps<OptionsInterface>;
      // width: number;
      // height: number;
      // getFieldDisplayValues: (
      //   options: PopulatedGetFieldDisplayValuesOptions
      // ) => FieldDisplay[];
      // fieldDisplayValues: FieldDisplay[];
      // fieldReducers: Registry<FieldReducerInfo>;
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
