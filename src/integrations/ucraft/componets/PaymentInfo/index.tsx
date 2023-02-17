import React from "react";
import { useTranslation } from "react-i18next";
import { FormButton } from "../../../../components";
import { useMessageContext } from "../../../../contexts";
import { useUpdateMessages } from "../../../../hooks";
import { redirectToDashboard } from "../../helpers";
import { UPLOADED_LOGO_BASE64_STORAGE_KEY } from "../../constants";
import { StyledPaymentDiv, StyledSpan } from "./styles";

function PaymentInfo() {
  const { t } = useTranslation("ci");
  const {
    color,
    field,
    sendMessageHandler,
    message,
    isLastField,
    field: { value },
  } = useMessageContext();
  let meta: any = null;
  if (field?.options?.length) {
    meta = field?.options[0].field_metadata;
  }
  const { updateMessages } = useUpdateMessages();
  function navigateToDashboard() {
    localStorage.removeItem(UPLOADED_LOGO_BASE64_STORAGE_KEY);

    window.open(redirectToDashboard(meta?.projectId || ""), "_blank");
    sendMessageHandler &&
      sendMessageHandler({
        message: t("rasaForm.goToDashboard"),
        metadata: {
          updateId: message.id,
        },
        updateActionsBody: updateMessages(t("rasaForm.goToDashboard")),
        changeLastMessage: true,
        isLastField,
      });
  }

  return (
    <>
      <StyledPaymentDiv>
        <span>{meta?.planName || ""}</span>
        <StyledSpan>{meta?.nextBillingDate || ""}</StyledSpan>
      </StyledPaymentDiv>
      <FormButton
        disabled={Boolean(value)}
        onClick={navigateToDashboard}
        color={color}
        isPrimary
        block
      >
        {t("rasaForm.goToDashboard")}
      </FormButton>
    </>
  );
}

export default PaymentInfo;
