import styled from "styled-components";
import { ifProp, inMobile } from "styled-components-helpers";
import { Skeleton } from "antd";

export const StyledClickBlocker = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
`;

export const StyledWidgetWrapper = styled.div<{
  $isDisabled?: boolean;
  $isInWidget?: boolean;
}>`
  width: calc(100vw - 99px);
  font-family: geomanist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;

  border-radius: 13px;
  overflow: hidden;
  background: #fff;
  margin-top: 11px;
  position: relative;

  ${ifProp(
    "$isInWidget",
    `
    margin-right: auto;
    `,
    `
    margin-left: auto;
    `
  )}

  ${ifProp(
    "$isDisabled",
    `
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    cursor: not-allowed;
    `
  )}
  
  // Custom specific style to overwrite SP widget
  .searchBar-wrapper--result {
    border-radius: 9px;
    height: initial !important;
  }
  .market-collapse > div:nth-child(2) {
    display: none;
  }
  .betslipContainer {
    box-shadow: none !important;
  }
  .internalLoadingBlock {
    position: relative !important;
  }
  .paymentMethods__gridLayout > div {
    cursor: ${ifProp("$isDisabled", "not-allowed", "pointer")};
  }
  .keyboard__container {
    display: none;
  }
  ${inMobile(`
  .keyboard__container {
    display: block;
  }
  `)}

  .hooryBetslip__footer {
    padding: 0 12px 8px 12px !important;
  }
  .predefinedStakesWrapper {
    padding: 8px 12px !important;
    margin-left: -2px;
  }
`;

export const StyledLoadingSkeleton = styled(Skeleton)`
  height: 200px;
  width: 100%;
`;
