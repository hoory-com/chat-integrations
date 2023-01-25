import React, { ReactNode } from "react";
import { useImage } from "react-image";
import { Image, ImageProps } from "antd";
import Skeleton from "./Skeleton";

interface Props extends ImageProps {
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  possibleHeight?: string;
  possibleWidth?: string;
}

function ImageComponent({
  loadingComponent,
  errorComponent,
  possibleHeight,
  possibleWidth,
  src,
  ...rest
}: Props) {
  const {
    isLoading,
    error: hasError,
    src: newSrc,
  } = useImage({
    srcList: src || "",
    useSuspense: false,
  });

  const Loader = loadingComponent || (
    <Skeleton possibleHeight={possibleHeight} possibleWidth={possibleWidth} />
  );
  const Error = errorComponent || (
    <Skeleton
      possibleHeight={possibleHeight}
      possibleWidth={possibleWidth}
      isBroken
    />
  );

  if (hasError) return Error;

  return isLoading ? Loader : <Image src={newSrc} {...rest} />;
}

export default ImageComponent;
