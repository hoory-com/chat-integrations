import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import {
  AUTH_TOKEN_KEY,
  SSO_URL,
  FIELD_SKIPPED,
  ChatPagePostMessage,
} from "../../constants";
import { FormType } from "../../../../constants";
import {
  FormButton,
  LoaderTextSwitcher,
  CompletedIcon,
} from "../../../../components";
import { getTopTemplateId, urlCheck } from "./helpers";
import { AiErrorType, UrlData, UrlResponse } from "./types";
import { InputWrapper } from "./styles";
import axiosAiApi from "../../helpers/axiosAiApi";
import { useMessageContext } from "../../../../contexts";
import { useUpdateMessages } from "../../../../hooks";
import { toggleAiTemplateByIdIframe } from "../../postMessages";
import { ErrorMessage, StyledSkipButton } from "../../styles";

function WebsiteUrl() {
  const { t } = useTranslation("ui");
  const {
    sendMessageHandler,
    color,
    message,
    field: { value, custom_type, required },
    isLastField,
  } = useMessageContext();
  const [websiteUrl, setWebsiteUrl] = useState(value || "");
  const { updateMessages } = useUpdateMessages();
  const [loader, setLoader] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [likeTemplateId, setLikeTemplateId] = useState("");
  const [completed, setCompleted] = useState(
    Boolean(value) && value !== FIELD_SKIPPED
  );
  const [isSkipped, setIsSkipped] = useState(value === FIELD_SKIPPED);
  const [disabled, setDisabled] = useState(isSkipped || completed);

  const listener = useCallback(
    ({
      data: { type, data },
    }: {
      data: {
        type: ChatPagePostMessage;
        data: { [key: string]: string };
      };
    }) => {
      if (type === ChatPagePostMessage.SET_AI_TEMPLATE_ID) {
        if (websiteUrl) {
          sendMessageHandler &&
            sendMessageHandler({
              message: websiteUrl,
              metadata: {
                templateId: data.selectedAiId,
                updateId: message.id,
              },
              updateActionsBody: updateMessages(websiteUrl),
            });
          setDisabled(true);
        }
      }
    },
    [websiteUrl]
  );

  useEffect(() => {
    window.addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [websiteUrl, custom_type]);

  const onUrlInput = debounce(async (siteUrl: string) => {
    const url = siteUrl.trim();

    setWebsiteUrl(url);
    setErrorText("");
    setCompleted(false);

    if (url) {
      const urlHttp = urlCheck(url);
      setLoader(true);
      try {
        const response = await axiosAiApi.post<UrlData, UrlResponse>(
          "/",
          {
            page_url: urlHttp,
          },
          // the template matching process takes a long time, for this we extend the server response time
          { timeout: 120000 }
        );

        if (response?.data?.topRank) {
          const topTemplateId = getTopTemplateId(response?.data?.topRank);
          setLikeTemplateId(topTemplateId);
          setErrorText("");
        } else {
          setErrorText("rasaForm.notExistsUrl");
        }
      } catch (error: any) {
        if (error?.detail?.[0]?.type === AiErrorType.VALIDATION_FAILED) {
          setErrorText("rasaForm.notExistsUrl");
        } else {
          setErrorText("rasaForm.error");
        }
      } finally {
        setLoader(false);
      }
    }
  }, 1000);

  const handleFinish = async () => {
    toggleAiTemplateByIdIframe({
      data: {
        address: SSO_URL,
        templateId: likeTemplateId,
        token: localStorage.getItem(AUTH_TOKEN_KEY),
        projectUrl: websiteUrl || "",
        industry: message?.form?.fields?.form_website_type_of_project || "",
      },
    });
    setDisabled(true);
    setCompleted(true);
  };

  const handleSkip = () => {
    sendMessageHandler &&
      sendMessageHandler({
        message: FIELD_SKIPPED,
        metadata: {
          updateId: message.id,
        },
        updateActionsBody: updateMessages(FIELD_SKIPPED),
        changeLastMessage: true,
        isLastField,
      });
    setCompleted(true);
    setIsSkipped(true);
    setDisabled(true);
  };

  return (
    <Form
      fields={[{ name: "websiteUrl", value: websiteUrl }]}
      onFinish={handleFinish}
    >
      <InputWrapper
        name="websiteUrl"
        defaultValue={websiteUrl}
        type="text"
        touched
        marginBottomSmall
        placeholder={
          custom_type === FormType.URL
            ? t(`rasaForm.${FormType[custom_type]}`)
            : "https://www.ucraft.com"
        }
        suffix={<CompletedIcon completed={completed} />}
        error={errorText ? "error" : undefined}
        help={errorText ? <ErrorMessage>{t(errorText)}</ErrorMessage> : null}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onUrlInput(event.target.value)
        }
        hasFeedback={false}
        rasaInput
        disabled={disabled || loader}
      />
      {!completed && (
        <>
          <FormButton
            htmlType="submit"
            disabled={!websiteUrl || disabled || !!errorText || loader}
            color={color}
            isPrimary
            block
          >
            {custom_type !== FormType.URL ? (
              <LoaderTextSwitcher
                loader={loader}
                text={t("rasaForm.createMyWebsite")}
              />
            ) : (
              t("rasaForm.confirm")
            )}
          </FormButton>
          {!required && (
            <StyledSkipButton onClick={handleSkip}>
              {t("rasaForm.skipBtn")}
            </StyledSkipButton>
          )}
        </>
      )}
    </Form>
  );
}

export default WebsiteUrl;
