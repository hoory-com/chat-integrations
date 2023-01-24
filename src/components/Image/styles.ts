import styled from "styled-components";
import { Skeleton } from "antd";
import { ifProp, prop } from "../../../helpers";

export const StyledLoadingSkeleton = styled(Skeleton.Input)<{
  $possibleHeight?: string;
  $possibleWidth?: string;
}>`
  && {
    width: ${ifProp(
      "$possibleWidth",
      prop("$possibleWidth"),
      "100%"
    )} !important;
    margin-top: 0;
    height: ${ifProp(
      "$possibleHeight",
      prop("$possibleHeight"),
      "130px"
    )} !important;
    line-height: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledBrokenImageWrapper = styled.div<{
  $possibleHeight?: string;
  $possibleWidth?: string;
}>`
  && {
    width: ${ifProp(
      "$possibleWidth",
      prop("$possibleWidth"),
      "100%"
    )} !important;
    margin-top: 0;
    height: ${ifProp(
      "$possibleHeight",
      prop("$possibleHeight"),
      "130px"
    )} !important;
    line-height: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f2f2;

    svg {
      height: 32px;
      width: 32px;

      > * {
        fill: #bfbfbf;
      }
    }
  }
`;
