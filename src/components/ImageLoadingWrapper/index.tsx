import React from "react";
import { LoaderImage } from "./styles";

interface Props {
  size: string;
  src: string;
  speed?: number;
}

function ImageLoadingWrapper({ size, src, speed = 2 }: Props) {
  return <LoaderImage $size={size} $speed={speed} src={src} alt={"loader"} />;
}

export default ImageLoadingWrapper;
