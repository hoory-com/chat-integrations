import styled, { css } from "styled-components";
import { Form } from "antd";
import { ifProp, theme } from "styled-components-helpers";

export const StyledFormItem = styled(Form.Item)<{
  $marginBottomSmall: boolean;
  $hasSubmitButton?: boolean;
  $hasError?: boolean;
  $loading?: boolean;
  $rasaInput?: boolean;
  $isDisabled?: boolean;
}>`
  width: 100%;
  &&.ant-form-item {
    margin-bottom: ${ifProp("$marginBottomSmall", "12px", "24px")};
  }
  svg {
    width: 16px !important;
  }

  input {
    border-radius: 4px;
  }

  .ant-input-group-addon {
    border-radius: 4px 0 0 4px;
    border: none;
  }

  input:focus {
    border-color: ${theme("primary")} !important;
  }

  ${ifProp(
    "$hasSubmitButton",
    css`
      &&& {
        .ant-input {
          border: 1px solid
            ${ifProp(
              "$loading",
              theme("green"),
              ifProp("$hasError", theme("red"), theme("primary"))
            )} !important;
          border-radius: 4px 0 0 4px;
        }
        button {
          height: 35px;
          background: ${ifProp(
            "$loading",
            theme("green"),
            ifProp("$hasError", theme("red"), theme("primary"))
          )};
          border-color: ${ifProp(
            "$loading",
            theme("green"),
            ifProp("$hasError", theme("red"), theme("primary"))
          )};
          border-radius: 0 4px 4px 0 !important;
          padding: 12px;

          &&:hover {
            border-color: ${ifProp(
              "$loading",
              theme("green"),
              theme("primary")
            )};
            background: ${ifProp("$loading", theme("green"), theme("primary"))};
            opacity: 0.9;
          }
          &&:disabled {
            background-color: ${theme("primaryDisabled")};
            color: ${theme("light")};
          }
        }
        .anticon-close-circle {
          position: relative;
          right: 44px;
          top: -1px;

          svg {
            fill: ${theme("red")};
          }
        }
      }
    `
  )};

  ${ifProp(
    "$rasaInput",
    css`
      &&& {
        .ant-input-affix-wrapper,
        .ant-form-item-control-input-content > input.ant-input {
          padding: 10px 10px 10px 16px;
          margin-top: 20px;
          height: 40px;
          background: ${theme("whitePearl")};
          box-shadow: 0 1px 2px ${theme("inputWidgetShadow")};
          border-radius: 10px;
          line-height: 1;
        }
      }

      &&.ant-form-item {
        margin-bottom: ${ifProp("$isDisabled", "0", "12px")};
      }

      &&&.ant-form-item-has-error .ant-input-affix-wrapper,
      &&&.ant-form-item-has-error
        .ant-form-item-control-input-content
        > input.ant-input {
        border: 1px solid ${theme("redError")};
      }

      &&& {
        input.ant-input:hover {
          border: 1px solid ${theme("whitePowder")};
        }

        input.ant-input-disabled:hover {
          border: none;
        }
      }
    `
  )};
`;
