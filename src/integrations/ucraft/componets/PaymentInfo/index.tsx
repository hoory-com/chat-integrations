import React from "react";
import { useTranslation } from "react-i18next";
import { FormButton } from "../../../../components";
import { UPLOADED_LOGO_BASE64_STORAGE_KEY } from "../../constants";
import { StyledPaymentDiv, StyledSpan } from "./styles";
import { useMessageContext } from "../../../../contexts";
import { redirectToDashboard } from "../../helpers";

function PaymentInfo() {
  const { t } = useTranslation("ui");
  const { color, field } = useMessageContext();
  let meta: any = null;
  if (field?.options?.length) {
    meta = field?.options[0].field_metadata;
  }
  function navigateToDashboard() {
    localStorage.removeItem(UPLOADED_LOGO_BASE64_STORAGE_KEY);

    window.open(redirectToDashboard(meta?.projectId || ""), "_blank");
  }

  return (
    <>
      <StyledPaymentDiv>
        <span>{meta?.planName || ""}</span>
        <StyledSpan>{meta?.nextBillingDate || ""}</StyledSpan>
      </StyledPaymentDiv>
      <FormButton onClick={navigateToDashboard} color={color} isPrimary block>
        {t("rasaForm.goToDashboard")}
      </FormButton>
    </>
  );
}

export default PaymentInfo;
