import styled from "styled-components";
import { prop } from "styled-components-helpers";

export const LoaderImage = styled.img<{ $size: string; $speed: number }>`
  && {
    width: ${prop("$size")};
    height: ${prop("$size")};
    animation: animate ${prop("$speed")}s linear infinite;
  }

  @keyframes animate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
