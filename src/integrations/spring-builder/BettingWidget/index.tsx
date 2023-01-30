import React, { useEffect, useState, memo, useLayoutEffect, useMemo } from 'react';
import { FILES_PATH } from './constants'
import { ConfirmStepData, MarketStepData, TeamStepData, WidgetConfig, DepositFinalCallback, BetFlowData } from '../types'
import {
  StyledWidgetWrapper,
  StyledClickBlocker,
  StyledLoadingSkeleton
} from './styles'

export type SelectCallback = TeamStepData & MarketStepData & ConfirmStepData & DepositFinalCallback;

type Props = {
  messageData: BetFlowData,
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

function BettingWidget ({
  widgetType,
  onSelect,
  widgetConfig,
  messageData,
  isDisabled,
  isInWidget,
  widgetKey,
  swarmUrl,
  partnerId
}: Props) {
  const [isLoaded, setIsLoaded] = useState<boolean>();
  const tempConfig: WidgetConfig = { ...widgetConfig }
  if (onSelect) {
    const callbackFnName = `hoorySuccessCallback_${widgetKey}`
    window[callbackFnName] = (data: TeamStepData & MarketStepData & ConfirmStepData) => {
      // don't call function on disabled widgets
      if (isDisabled) return

      onSelect(data)
      delete window[callbackFnName]
    }
    tempConfig.hasCallback = true
    tempConfig.callbackName = callbackFnName
  }
  useLayoutEffect(() => {
    const mainScript = document.getElementById('SP_WIDGET_JS_FILE')
    if (mainScript) {
      console.log('Enter')
      mainScript.onload = function () {
        setIsLoaded(true)
      }
    }
  }, [document])

  useEffect(() => {
    const swarmCustomUrl = swarmUrl || 'wss://eu-swarm-ws-re.trexname.com/'
    if (window?.partnerConfigs?.swarmUrl !== swarmCustomUrl) {
      console.log('Socket Connection::1')
      window.partnerConfigs = {
        swarmUrl: swarmCustomUrl,
        defaultOddAccept: '',
        springConfig: {
          partnerId: partnerId || 4
        }
      }
    }
  }, [swarmUrl, partnerId, window?.partnerConfigs])

  useLayoutEffect(() => {
    if (!isLoaded) {
      const mainScript = document.createElement('script')
      const runTimeScript = document.createElement('script')
      const styledRef = document.createElement('link')
      mainScript.id = 'SP_WIDGET_JS_FILE'
      mainScript.src = `${FILES_PATH}/js/main.chunk.js?widgetKey=${widgetKey}`
      runTimeScript.src = `${FILES_PATH}/js/runtime-main.js?widgetKey=${widgetKey}`
      styledRef.href = `${FILES_PATH}/css/main.chunk.css?widgetKey=${widgetKey}`
      styledRef.rel = 'stylesheet'
      styledRef.type = 'text/css'
      document.body.appendChild(mainScript)
      document.body.appendChild(runTimeScript)
      document.body.appendChild(styledRef)

      mainScript.onload = function () {
        setIsLoaded(true);
        (window as any)?.initHooryWidgets?.()
      }
    } else {
      const mainScript = document.getElementById('SP_WIDGET_JS_FILE')
      if (mainScript) {
        mainScript.onload = function () {
          (window as any)?.initHooryWidgets?.()
        }
      }
    }
  }, [isLoaded, document])

  const isLoading = useMemo(() => {
    return !messageData || !isLoaded
  }, [isLoaded, messageData])

  return (
    <StyledWidgetWrapper $isDisabled={isDisabled} $isInWidget={isInWidget}>
      <div
        data-widget={widgetType}
        data-configs={JSON.stringify(tempConfig)}
        data-loaded="false"
      />
      {isDisabled && <StyledClickBlocker />}
      {isLoading && <StyledLoadingSkeleton />}
    </StyledWidgetWrapper>
  )
}

export default memo(BettingWidget)
