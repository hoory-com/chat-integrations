import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import {
  SSO_URL,
  AUTH_TOKEN_KEY,
  UPLOADED_LOGO_BASE64_STORAGE_KEY,
  anotherTemplate,
  ChatPagePostMessage,
} from "../../constants";
import {
  FormButton,
  CompletedIcon,
  LoaderTextSwitcher,
} from "../../../../components";
import { getTemplateThumbnailQuery } from "../../helpers/graphQL/query";
import { unAuthCategories } from "../../helpers/types";
import defaultTemplateImage from "../../../../assets/images/placeholder.png";
import TemplateSkeleton from "./TemplateSkeleton";
import { useMessageContext } from "../../../../contexts";
import { useUpdateMessages } from "../../../../hooks";
import { togglePaymentIframe, toggleTemplatesIframe } from "../../postMessages";
import {
  TemplateContainer,
  TemplateBlock,
  ActionBlock,
  ImageWrapper,
  TemplateImage,
  TemplateName,
  TemplateState,
  ErrorMessage,
  TemplateInfo,
  TemplateIndustry,
} from "./styles";

interface ITemplate {
  id: string;
  name: string;
  thumbnail: string | null;
}

const initTemplate = {
  id: "",
  name: "",
  thumbnail: "",
};

function DesignTemplate() {
  const { t } = useTranslation("ci");
  const { field, sendMessageHandler, color, message } = useMessageContext();
  const [template, setTemplate] = useState<ITemplate>(
    field.value ? JSON.parse(field.value) : initTemplate
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(Boolean(field.value));
  const { updateMessages } = useUpdateMessages();
  const [getTemplateData, { data, error, loading }] = useLazyQuery(
    getTemplateThumbnailQuery
  );
  let meta: any = null;
  if (field?.options?.length) {
    meta = field?.options[0].field_metadata;
  }

  const listener = useCallback(
    ({
      data: { type, data },
    }: {
      data: {
        type: ChatPagePostMessage;
        data: { [key: string]: any };
      };
    }) => {
      if (type === ChatPagePostMessage.PAYMENT_DATA) {
        sendMessageHandler &&
          sendMessageHandler({
            message: t("rasaForm.useThisTemplate"),
            metadata: {
              ...data.paymentData,
              updateId: message.id,
            },
            updateActionsBody: updateMessages(JSON.stringify(data.paymentData)),
          });
        removeListener();
        setCompleted(true);
      }
      if (type === ChatPagePostMessage.SET_TEMPLATE_ID) {
        sendMessageHandler &&
          sendMessageHandler({
            message: t("rasaForm.selectAnother"),
            metadata: {
              templateId: data.templateId,
              updateId: message.id,
            },
            updateActionsBody: updateMessages(data.templateId),
          });
      }
    },
    []
  );

  const removeListener = () => {
    window.removeEventListener("message", listener);
  };

  useEffect(() => {
    if (meta?.templateId) {
      getTemplateData({
        variables: {
          id: meta?.templateId,
        },
      });
    }

    window.addEventListener(
      "message",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener,
      false
    );
    return () => removeListener();
  }, []);

  useEffect(() => {
    if (error) {
      if ("message" in error && unAuthCategories.includes(error.message)) {
        setErrorMsg("rasaForm.expiredToken");
      } else {
        setErrorMsg("rasaForm.undetectedError");
      }
    }

    if (data && data?.template) {
      setTemplate(data.template);
    }
  }, [data, error]);

  const handleThisTemplate = () => {
    setErrorMsg("");
    const projectData = {
      ...meta,
      projectUrl: meta?.projectUrl || "",
      about: meta?.shortDescription || "",
      logo: localStorage.getItem(UPLOADED_LOGO_BASE64_STORAGE_KEY) || "",
    };

    togglePaymentIframe({
      data: {
        address: SSO_URL,
        token: localStorage.getItem(AUTH_TOKEN_KEY),
        field_metadata: { ...projectData },
      },
    });
  };

  const handleAnotherTemplate = () => {
    toggleTemplatesIframe({
      data: {
        address: SSO_URL,
        token: localStorage.getItem(AUTH_TOKEN_KEY),
        anotherTemplate,
      },
    });
    setErrorMsg("");
    removeListener();
  };

  return (
    <TemplateContainer>
      {!loading ? (
        <TemplateBlock>
          <ImageWrapper>
            <TemplateImage
              src={
                template.thumbnail ? template.thumbnail : defaultTemplateImage
              }
              alt="template"
            />
          </ImageWrapper>
          <TemplateInfo>
            <TemplateName>{template.name}</TemplateName>
            <TemplateIndustry>
              {t(
                `rasaForm.${message?.form?.fields?.form_website_type_of_project}`
              )}
            </TemplateIndustry>
          </TemplateInfo>
          <TemplateState>
            <CompletedIcon completed={completed} />
          </TemplateState>
        </TemplateBlock>
      ) : (
        <TemplateSkeleton />
      )}
      <div>{!!errorMsg && <ErrorMessage>{t(errorMsg)}</ErrorMessage>}</div>
      <ActionBlock>
        <FormButton
          block
          color={color}
          disabled={completed || loading}
          isPrimary
          onClick={handleThisTemplate}
        >
          <LoaderTextSwitcher
            loader={loading}
            text={t("rasaForm.useThisTemplate")}
          />
        </FormButton>
        <FormButton
          block
          color={color}
          isPrimary={false}
          disabled={completed}
          onClick={handleAnotherTemplate}
        >
          {t("rasaForm.selectAnother")}
        </FormButton>
      </ActionBlock>
    </TemplateContainer>
  );
}

export default DesignTemplate;
