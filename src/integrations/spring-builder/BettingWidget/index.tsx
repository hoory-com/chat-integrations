import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { FILES_PATH } from "./constants";
import {
  ConfirmStepData,
  MarketStepData,
  TeamStepData,
  WidgetConfig,
  DepositFinalCallback,
  BetFlowData,
} from "../types";
import {
  StyledWidgetWrapper,
  StyledClickBlocker,
  StyledLoadingSkeleton,
} from "./styles";

export type SelectCallback = TeamStepData &
  MarketStepData &
  ConfirmStepData &
  DepositFinalCallback;

type Props = {
  messageData: BetFlowData;
  widgetType?: string;
  onSelect: (data: SelectCallback) => void;
  isDisabled?: boolean;
  isInWidget?: boolean;
  widgetConfig?: WidgetConfig;
  widgetKey?: string;
  swarmUrl?: string;
  partnerId?: number;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partnerConfigs: any;
  }
}

function BettingWidget({
  widgetType,
  onSelect,
  widgetConfig,
  messageData,
  isDisabled,
  isInWidget,
  widgetKey,
  swarmUrl,
  partnerId,
}: Props) {
  const widgetDivRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tempConfig: WidgetConfig = { ...widgetConfig };
  if (onSelect) {
    const callbackFnName = `hoorySuccessCallback_${widgetKey}`;
    window[callbackFnName] = (
      data: TeamStepData & MarketStepData & ConfirmStepData
    ) => {
      // don't call function on disabled widgets
      if (isDisabled) return;

      onSelect(data);
      delete window[callbackFnName];
    };
    tempConfig.hasCallback = true;
    tempConfig.callbackName = callbackFnName;
  }

  useEffect(() => {
    const swarmCustomUrl = swarmUrl || "wss://eu-swarm-ws-re.trexname.com/";
    if (window?.partnerConfigs?.swarmUrl !== swarmCustomUrl) {
      window.partnerConfigs = {
        swarmUrl: swarmCustomUrl,
        defaultOddAccept: "",
        springConfig: {
          partnerId: partnerId || 4,
        },
      };
    }
  }, [swarmUrl, partnerId, window?.partnerConfigs]);

  const initializeWidget = (script: any) => {
    setIsLoaded(true);
    script.setAttribute("hoory-load", "1");
    (window as any)?.initHooryWidgets?.();
  };

  useLayoutEffect(() => {
    const addedScript = document.getElementById("SP_WIDGET_JS_FILE");

    if (!addedScript) {
      // eslint-disable-next-line no-console
      console.log("SP_WIDGET_STATE:: not added script");
      const mainScript = document.createElement("script");
      const runTimeScript = document.createElement("script");
      const styledRef = document.createElement("link");
      mainScript.id = "SP_WIDGET_JS_FILE";
      mainScript.src = `${FILES_PATH}/js/main.chunk.js?widgetKey=${widgetKey}`;
      runTimeScript.src = `${FILES_PATH}/js/runtime-main.js?widgetKey=${widgetKey}`;
      styledRef.href = `${FILES_PATH}/css/main.chunk.css?widgetKey=${widgetKey}`;
      styledRef.rel = "stylesheet";
      styledRef.type = "text/css";
      document.body.appendChild(mainScript);
      document.body.appendChild(runTimeScript);
      document.body.appendChild(styledRef);

      mainScript.onload = function () {
        initializeWidget(mainScript);
      };
    } else {
      const isLoadedAttr = addedScript.getAttribute("hoory-load");
      if (isLoadedAttr === "1") {
        // eslint-disable-next-line no-console
        console.log("SP_WIDGET_STATE:: was added and loaded just initial");

        initializeWidget(addedScript);
      } else {
        // eslint-disable-next-line no-console
        console.log(
          "SP_WIDGET_STATE:: was added not loaded wait to load and then initial"
        );

        addedScript.onload = function () {
          initializeWidget(addedScript);
        };
      }
    }
  }, [isLoaded, document]);

  return (
    <StyledWidgetWrapper $isDisabled={isDisabled} $isInWidget={isInWidget}>
      <div
        ref={widgetDivRef}
        data-widget={widgetType}
        data-configs={JSON.stringify(tempConfig)}
        data-loaded="false"
      />
      {isDisabled && <StyledClickBlocker />}
      {(!messageData ||
        widgetDivRef.current?.getAttribute("data-loaded") !== "true") && (
        <StyledLoadingSkeleton />
      )}
    </StyledWidgetWrapper>
  );
}

export default BettingWidget;
