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

  function navigateToDashboard() {
    localStorage.removeItem(UPLOADED_LOGO_BASE64_STORAGE_KEY);

    // window.open(
    //   redirectToDashboard(field?.options?[0]?.projectId || ""),
    //   "_blank"
    // );
  }

  return (
    <>
      <StyledPaymentDiv>
        {/* <span>{field?.field_metadata?.planName || ""}</span> */}
        {/* <StyledSpan>{field?.field_metadata?.nextBillingDate || ""}</StyledSpan> */}
      </StyledPaymentDiv>
      <FormButton onClick={navigateToDashboard} color={color} isPrimary block>
        {t("rasaForm.goToDashboard")}
      </FormButton>
    </>
  );
}

export default PaymentInfo;
