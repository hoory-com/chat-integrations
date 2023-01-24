import React from "react";
import { LoaderImage } from "./styles";

interface Props {
  size: string;
  src: string;
  speed?: number;
}

function LoaderWrapper({ size, src, speed = 2 }: Props) {
  return <LoaderImage $size={size} $speed={speed} src={src} alt={"loader"} />;
}

export default LoaderWrapper;
