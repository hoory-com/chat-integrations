import styled from "styled-components";
import { FormInput } from "components";

export const InputWrapper = styled(FormInput)`
  &&& {
    input.ant-input:hover {
      border: none;
    }
  }
`;
