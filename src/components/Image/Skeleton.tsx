import React from "react";
import BrokenImageIcon from "../../assets/svg/broken-image.svg";
import { StyledBrokenImageWrapper, StyledLoadingSkeleton } from "./styles";

type Props = {
  isBroken?: boolean;
  possibleHeight?: string;
  possibleWidth?: string;
};

const ImageSkeleton = ({ possibleHeight, possibleWidth, isBroken }: Props) => {
  return isBroken ? (
    <StyledBrokenImageWrapper
      $possibleHeight={possibleHeight}
      $possibleWidth={possibleWidth}
    >
      <BrokenImageIcon />
    </StyledBrokenImageWrapper>
  ) : (
    <StyledLoadingSkeleton
      $possibleHeight={possibleHeight}
      $possibleWidth={possibleWidth}
      active
    />
  );
};

export default ImageSkeleton;
