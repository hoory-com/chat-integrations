import React, { useRef } from "react";
import { v4 as uuid } from "uuid";
import BettingWidget, { SelectCallback } from "./BettingWidget";
import { useMessageContext } from "../../contexts";
import { BetFlowData, SpringBuilderWidgetType, WidgetConfig } from "./types";
import { useFormSlots } from "../../hooks";
import { RasaFieldType } from "../../constants";

function BetFlowMessage() {
  const { isInWidget, sendMessageHandler, isLastMessage, field } =
    useMessageContext();
  const widgetKey = useRef(uuid());

  const messageData = useFormSlots() as BetFlowData;
  const currentFieldType = field?.custom_type as any;

  const tempWidgetConfig: WidgetConfig = {};

  let widgetType: SpringBuilderWidgetType = "";
  switch (currentFieldType) {
    case "COMPETITION":
      if (messageData.competitionId) {
        widgetType = "HooryGameList";
        tempWidgetConfig.competitionIds = messageData.competitionId;
      } else {
        widgetType = "HoorySearch";
        tempWidgetConfig.initialValue = messageData.team_name;
      }
      break;
    case "MARKET":
      widgetType = "HoorySingleGame";
      tempWidgetConfig.sport = messageData.competition.sportTypeAlias;
      tempWidgetConfig.region = messageData.competition.region;
      tempWidgetConfig.competition = messageData.competition.competitionId + "";
      tempWidgetConfig.game = messageData.competition.gameId + "";
      break;
    case "BET_PLACE":
    case "CONFIRMATION_DETAILS":
      widgetType = "HooryBetslip";
      tempWidgetConfig.initialAmount =
        parseInt((messageData.amount || "").replace(/[^0-9]/g, ""), 10) || 0;
      tempWidgetConfig.marketId = messageData.market.marketId;
      tempWidgetConfig.eventId = messageData.market.eventId;
      tempWidgetConfig.gameId = messageData.market.gameId;
      tempWidgetConfig.competitionId = messageData.market.competitionId;

      break;
    case "Sign in":
      widgetType = "HooryAccount";
      break;
    case "SHOW_BALANCE":
      widgetType = "HooryBalance";
      break;
    case "PAYMENT_AMOUNT":
      tempWidgetConfig.isDeposit = true;
      widgetType = "HooryPaymentAmount";
      break;
    case "PAYMENT_LIST":
      tempWidgetConfig.actionType = "deposit";
      widgetType = "HooryPaymentList";
      break;
    case "PAYMENT_VIEW":
      tempWidgetConfig.actionType = "deposit";
      tempWidgetConfig.amount = messageData.payment_amount.data;
      tempWidgetConfig.paymentId = messageData.payment_list.paymentId;
      widgetType = "HooryPaymentView";
      break;
  }

  /**
   * Generate and send message
   * @param optionData
   */
  const handleSelectBetOption = (optionData: SelectCallback) => {
    const metadata: Record<string, any> = {};
    let messageToSend = "";
    messageToSend = JSON.stringify({ data: optionData, field });

    if (
      currentFieldType === "CONFIRMATION_DETAILS" ||
      currentFieldType === "BET_PLACE"
    ) {
      switch (optionData.status) {
        case "success":
          messageToSend = "/ack";
          break;
        case "cancel":
          messageToSend = "/restart";
          break;
        case "unauthorized":
          messageToSend = "Sign in";
          break;
        case "error":
          messageToSend = "";
          break;
      }
    } else if (currentFieldType === "Sign in") {
      if (optionData.status === "success") {
        messageToSend = "Place it";
      } else {
        messageToSend = "/restart";
      }
    } else if (currentFieldType === "PAYMENT_AMOUNT") {
      switch (optionData.status) {
        case "unauthorized":
          messageToSend = "Sign in";
          break;
        case "cancel":
          messageToSend = "/restart";
          break;
        case "error":
          messageToSend = "";
          break;
      }
    } else if (currentFieldType === "PAYMENT_LIST") {
      switch (optionData.payStatus) {
        case "success":
          messageToSend = "Success";
          break;
        case "cancel":
          messageToSend = "/restart";
          break;
      }
    } else if (currentFieldType === "PAYMENT_VIEW") {
      if (
        optionData.payStatus === "success" ||
        optionData.status === "success"
      ) {
        messageToSend = "Success";
      } else if (optionData.status === "cancel") {
        messageToSend = "/restart";
      }
    }

    if (!messageToSend) return;

    // eslint-disable-next-line no-console
    console.log(
      "Widget optionData::::",
      optionData,
      "... We sent:",
      messageToSend,
      metadata,
      "====",
      sendMessageHandler
    );
    sendMessageHandler &&
      sendMessageHandler({
        message: messageToSend,
        addToRedux: true,
      });
  };

  return (
    <BettingWidget
      messageData={messageData}
      isInWidget={isInWidget}
      isDisabled={isLastMessage}
      widgetConfig={tempWidgetConfig}
      widgetType={widgetType}
      onSelect={handleSelectBetOption}
      widgetKey={widgetKey.current}
    />
  );
}

export default BetFlowMessage;

export const customSpringUserMessageRenderer = (messageObject: {
  field: RasaFieldType;
  data: any;
}) => {
  switch (messageObject?.field?.custom_type as string) {
    case "COMPETITION":
      return `${messageObject.data?.team1_name || ""} vs ${
        messageObject.data?.team2_name || ""
      }`;
    case "MARKET":
      return `${messageObject.data?.marketName || ""} - ${
        messageObject.data?.eventName || ""
      }`;
    case "PAYMENT_AMOUNT":
      return `${messageObject.data?.data || ""}`;
    case "PAYMENT_LIST":
      return `ID: ${messageObject.data?.paymentId || ""}`;
    // case "PAYMENT_VIEW":
    // case "BET_PLACE":
    // case "CONFIRMATION_DETAILS":
    // case "SHOW_BALANCE":
    //   return "Hi";
  }
  return null;
};
