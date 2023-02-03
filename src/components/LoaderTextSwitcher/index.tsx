import React from "react";
import ImageLoadingWrapper from "../ImageLoadingWrapper";
import LoaderWhiteIcon from "../../assets/svg/loader-white.svg";
import LoaderBlackIcon from "../../assets/svg/loader-black.svg";

interface Props {
  text: string;
  loader: boolean;
  color?: "white" | "black";
  size?: string;
}

function LoaderTextSwitcher({
  text,
  loader,
  color = "white",
  size = "20px",
}: Props) {
  const srcPath = color === "white" ? LoaderWhiteIcon : LoaderBlackIcon;

  return loader ? (
    <ImageLoadingWrapper src={srcPath} size={size} speed={1} />
  ) : (
    <>{text}</>
  );
}

export default LoaderTextSwitcher;
