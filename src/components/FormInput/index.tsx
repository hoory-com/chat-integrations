import React, { ReactNode, RefObject } from "react";
import { Input, Tooltip, Grid } from "antd";
import { SearchProps } from "antd/lib/input/Search";
import { TooltipPlacement } from "antd/lib/tooltip";
import { StyledFormItem } from "./styles";

const { useBreakpoint } = Grid;

interface Props extends SearchProps {
  success?: boolean;
  error?: string;
  errorPlacement?: TooltipPlacement;
  isPopupContainerBody?: boolean;
  password?: boolean;
  hasSubmitButton?: boolean;
  touched?: boolean;
  marginBottomSmall?: boolean;
  renderPasswordEyeIcon?: boolean;
  addonBefore?: string | ReactNode;
  suffix?: string | React.ReactNode;
  label?: string | React.ReactNode;
  inputRef?: RefObject<any>;
  hasFeedback?: boolean;
  help?: React.ReactNode;
  rasaInput?: boolean;
  isDisabled?: boolean;
}

function FormInput({
  success,
  error,
  errorPlacement,
  isPopupContainerBody = false,
  password,
  hasSubmitButton,
  touched,
  className,
  label,
  inputRef,
  marginBottomSmall = false,
  renderPasswordEyeIcon = true,
  loading = false,
  hasFeedback = true,
  rasaInput = false,
  isDisabled = false,
  help,
  ...rest
}: Props) {
  const screens = useBreakpoint();
  const inputProps = {
    ref: inputRef,
    ...rest,
  };

  const render = () => {
    if (hasSubmitButton) {
      return <Input.Search {...inputProps} />;
    }
    return password ? (
      <Input.Password {...inputProps} />
    ) : (
      <Input {...inputProps} />
    );
  };

  const placement = errorPlacement
    ? errorPlacement
    : screens.lg
    ? "right"
    : "top";

  const handleGetPopupContainer = (triggerNode: HTMLElement) => {
    return isPopupContainerBody
      ? document.body
      : (triggerNode.parentNode as HTMLElement);
  };

  return (
    <StyledFormItem
      hasFeedback={hasFeedback}
      $marginBottomSmall={marginBottomSmall}
      $hasSubmitButton={hasSubmitButton}
      $hasError={Boolean(touched && error)}
      $loading={loading}
      $rasaInput={rasaInput}
      $isDisabled={isDisabled}
      labelCol={{ span: 24 }}
      label={label}
      className={className}
      validateStatus={touched && error ? "error" : success ? "success" : ""}
      help={help}
    >
      <Tooltip
        title={!rasaInput && touched && error}
        color="red"
        placement={placement}
        overlayStyle={{ whiteSpace: "pre-line" }}
        getPopupContainer={handleGetPopupContainer}
      >
        {render()}
      </Tooltip>
    </StyledFormItem>
  );
}

export default FormInput;
