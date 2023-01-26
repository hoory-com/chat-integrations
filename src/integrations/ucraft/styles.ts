import { FC } from "react";
import { Button, ButtonProps } from "antd";
import styled from "styled-components";
import { theme, makeRgbaFromTheme } from "styled-components-helpers";

export const ErrorMessage = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 6px;
`;

export const ButtonsWrapper = styled.div`
  margin-top: 16px;

  && > button:first-child {
    margin-bottom: 8px;
  }
`;

export const StyledSkipButton: FC<ButtonProps> = styled(Button)`
  && {
    width: 100%;
    margin-top: 8px;
    min-height: 40px;
    border-radius: 8px;
    background: ${theme("whitePearl")};
    color: ${theme("widgetColor")};
    border: 1px solid ${theme("whitePearl")};
    box-shadow: 0 1px 2px ${makeRgbaFromTheme("black", 0.04)};
    cursor: pointer;
    &:hover {
      background: ${theme("whitePowder")};
      color: ${theme("widgetColor")};
      border: 1px solid ${theme("whitePowder")};
    }
    &:focus {
      background: ${theme("whitePowder")};
      color: ${theme("widgetColor")};
      border: 1px solid ${theme("whitePowder")};
    }
  }
`;
