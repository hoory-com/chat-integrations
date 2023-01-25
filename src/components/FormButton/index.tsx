import React from "react";
import { ButtonProps } from "antd/lib/button";
import { FormButtonWrapper } from "./styles";
import { useMessageContext } from "../../contexts";

interface Props extends ButtonProps {
  isPrimary?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  width?: string;
  color: string;
  $isClicked?: boolean;
}

function FormButton({
  children,
  isPrimary = false,
  disabled = false,
  width,
  color,
  ...props
}: Props) {
  const { isDarkTheme } = useMessageContext();
  return (
    <FormButtonWrapper
      $isDarkTheme={isDarkTheme}
      $width={width}
      $color={color}
      $isPrimary={isPrimary}
      disabled={disabled}
      {...props}
    >
      {children}
    </FormButtonWrapper>
  );
}

export default FormButton;
