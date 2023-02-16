import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from "react";
import { useLocation } from "react-router-dom";
import { parse } from "query-string";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import InputCheckIcon from "../../../../assets/svg/inputCheckIcon.svg";
import {
  ChatPagePostMessage,
  EMAIL_MAX_LENGTH,
  ErrorResponse,
} from "../../constants";
import { FormType } from "../../../../constants";
import {
  FormInput,
  FormButton,
  LoaderTextSwitcher,
} from "../../../../components";
import { ACCOUNTS_URL, AUTH_TOKEN_KEY } from "../../helpers/constants";
import { isEmail } from "../../../../helpers/validationHelpers";
import { useFocus, useUpdateMessages } from "../../../../hooks";
import { ssoServices } from "../../helpers";
import { ErrorCodes } from "../../helpers/types";
import { useMessageContext } from "../../../../contexts";
import { toggleSignInIframe } from "../../postMessages";
import { ErrorMessage } from "../../styles";

function UserEmail() {
  const { t } = useTranslation("ci");
  const [form] = Form.useForm();
  const {
    sendMessageHandler,
    color,
    message,
    visitor,
    field: { value, custom_type },
  } = useMessageContext();
  const { search } = useLocation();
  const { email: currentEmail } = parse(search);
  const defaultEmail = visitor ? visitor.email : "";
  const { updateMessages } = useUpdateMessages();
  const [completed, setCompleted] = useState(Boolean(value));
  const [disabled, setDisabled] = useState(Boolean(value));
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail || value || "");
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const focusRef = useFocus(null);

  const listener = useCallback(
    ({
      data: { type, data },
    }: {
      data: {
        type: ChatPagePostMessage;
        data: { [key: string]: string };
      };
    }) => {
      if (type === ChatPagePostMessage.SIGN_IN) {
        if (data.accessToken && data.email) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
          sendMessageHandler &&
            sendMessageHandler({
              message: data.email,
              metadata: {
                updateId: message.id,
              },
              updateActionsBody: updateMessages(data.email),
            });
          setCompleted(true);
          setDisabled(true);
          setErrorText("");
          setIsError(false);
          setEmailExist(false);
          setEmail(data.email);
        } else {
          setErrorText("rasaForm.undetectedError");
          setIsError(true);
        }
      }
    },
    [message.id]
  );

  useEffect(() => {
    window.addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  useEffect(() => {
    if (currentEmail) {
      setEmail(String(currentEmail));
    }
  }, [currentEmail]);

  const onEmailInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setEmail(e.target.value);
      setErrorText("");
      setIsError(false);
      setEmailExist(false);
    },
    []
  );

  const openSignInIframe = () => {
    if (emailExist) {
      toggleSignInIframe({ data: { address: ACCOUNTS_URL } });
    }
  };

  const handleFinish = async () => {
    const checkEmail = isEmail(email);

    if (!checkEmail) {
      setErrorText("rasaForm.notValidEmail");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await ssoServices.signup({
        email,
        name: message?.form?.fields?.form_website_person || "User",
      });

      if (!response) {
        return;
      }

      if (response?.message === ErrorCodes.EMAIL_EXISTS) {
        setErrorText("rasaForm.emailExistError");
        setIsError(true);
        setEmailExist(true);

        return;
      }

      if (response?.message === ErrorCodes.UNDETERMINED_ERROR) {
        setErrorText("rasaForm.undetectedError");
        setIsError(true);

        return;
      }

      sendMessageHandler &&
        sendMessageHandler({
          message: email,
          metadata: {
            updateId: message.id,
          },
          updateActionsBody: updateMessages(email),
        });
      setCompleted(true);
      setDisabled(true);
    } catch (error: ErrorResponse | any) {
      if ("message" in error) {
        if (error.message === ErrorCodes.EMAIL_EXISTS) {
          setErrorText("rasaForm.emailExistError");
          setIsError(true);
          setEmailExist(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      fields={[{ name: "email", value: email }]}
      onFinish={handleFinish}
    >
      <FormInput
        type="text"
        touched={true}
        value={email}
        marginBottomSmall={true}
        maxLength={EMAIL_MAX_LENGTH}
        placeholder={t(`rasaForm.${FormType[custom_type]}`)}
        suffix={
          completed && <img src={InputCheckIcon} alt={"InputCheckIcon"} />
        }
        error={isError ? "error" : undefined}
        help={isError ? <ErrorMessage>{t(errorText)}</ErrorMessage> : null}
        onChange={onEmailInput}
        hasFeedback={false}
        rasaInput={true}
        disabled={disabled}
        isDisabled={disabled}
        inputRef={focusRef}
      />
      {!completed && (
        <FormButton
          htmlType={emailExist ? "button" : "submit"}
          color={color}
          disabled={!email.trim() || disabled || loading}
          isPrimary
          block
          onClick={openSignInIframe}
        >
          <LoaderTextSwitcher
            text={t(!emailExist ? "rasaForm.confirm" : "form.login")}
            loader={loading}
          />
        </FormButton>
      )}
    </Form>
  );
}

export default UserEmail;
