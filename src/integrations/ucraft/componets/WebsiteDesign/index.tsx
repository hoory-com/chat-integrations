import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FormButton } from "../../../../components";
import {
  anotherTemplate,
  ChatPagePostMessage,
  SSO_URL,
  AUTH_TOKEN_KEY,
} from "../../constants";
import { useMessageContext } from "../../../../contexts";
import { useUpdateMessages } from "../../../../hooks";
import { toggleTemplatesIframe } from "../../postMessages";
import { ButtonsWrapper } from "../../styles";

enum DesignButtons {
  AI_DESIGN = "aiDesign",
  TEMPLATE_DESIGN = "templatesDesign",
}

function WebsiteDesign() {
  const { t } = useTranslation("ui");
  const {
    sendMessageHandler,
    color,
    message,
    field: { value },
  } = useMessageContext();
  const [completed, setCompleted] = useState(Boolean(value));
  const [clickedBtn, setClickedBtn] = useState<DesignButtons | null>(null);
  const { updateMessages } = useUpdateMessages();

  const listener = useCallback(
    ({
      data: { type, data },
    }: {
      data: {
        type: ChatPagePostMessage;
        data: { [key: string]: string };
      };
    }) => {
      if (type === ChatPagePostMessage.SET_TEMPLATE_ID) {
        const text =
          data.isAnother === anotherTemplate
            ? t("rasaForm.selectAnother")
            : t("rasaForm.templatesDesignBtnText");

        sendMessageHandler &&
          sendMessageHandler({
            message: text,
            metadata: {
              templateId: data.templateId,
              updateId: message.id,
            },
            addToRedux: true,
            updateActionsBody: updateMessages(data.templateId),
          });
        setCompleted(true);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("message", listener, false);
    return () => window.removeEventListener("message", listener);
  }, []);

  const openAITemplatesView = () => {
    const text = t("rasaForm.aiDesignBtnText");
    sendMessageHandler &&
      sendMessageHandler({
        message: text,
        addToRedux: true,
        metadata: {
          updateId: message.id,
        },
        updateActionsBody: updateMessages(text),
      });
    setCompleted(true);
    setClickedBtn(DesignButtons.AI_DESIGN);
  };

  const handleTemplates = () => {
    setClickedBtn(DesignButtons.TEMPLATE_DESIGN);
    toggleTemplatesIframe({
      data: {
        address: SSO_URL,
        token: localStorage.getItem(AUTH_TOKEN_KEY),
      },
    });
  };

  return (
    <ButtonsWrapper>
      <FormButton
        block
        color={color}
        disabled={completed}
        onClick={openAITemplatesView}
        isPrimary={clickedBtn === DesignButtons.AI_DESIGN}
      >
        {t("rasaForm.aiDesignBtnTextEmoji")}
      </FormButton>
      <FormButton
        block
        color={color}
        disabled={completed}
        onClick={handleTemplates}
        isPrimary={clickedBtn === DesignButtons.TEMPLATE_DESIGN}
      >
        {t("rasaForm.templatesDesignBtnTextEmoji")}
      </FormButton>
    </ButtonsWrapper>
  );
}

export default WebsiteDesign;
