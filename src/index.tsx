import React, { lazy, memo } from "react";
import { ContextType, Provider as MessageProvider } from "./contexts";
import UserEmail from "./integrations/ucraft/UserEmail";
import ProjectUrl from "./integrations/ucraft/ProjectUrl";
import LogoUploader from "./integrations/ucraft/LogoUploader";
import WebsiteDesign from "./integrations/ucraft/WebsiteDesign";
import DesignTemplate from "./integrations/ucraft/DesignTemplate";
import PaymentInfo from "./integrations/ucraft/PaymentInfo";
import ProjectName from "./integrations/ucraft/ProjectName";
import LikedWebsite from "./integrations/ucraft/LikedWebsite";
import WebsiteUrl from "./integrations/ucraft/WebsiteUrl";
import { FormType } from "./constants";

/**
 * Spring builder
 */
const SpringBuilderComponentsSwitcher = lazy(
  () => import("./integrations/spring-builder")
);

interface Props extends ContextType {}

function IntegrationWrapper(props: Props) {
  let Component = (
    <div>
      This form type is not implemented yet! Please add your custom components
      on{" "}
      <a
        href="https://github.com/hoory-com/chat-integrations"
        target="_blank"
        rel="noreferrer"
      >
        our public integrations repository
      </a>
      .
    </div>
  );

  switch (props.field.custom_provider) {
    /**
     * Ucraft
     */
    case FormType.UCRAFT_LIKED_WEBSITE:
      Component = <LikedWebsite />;
      break;
    case FormType.UCRAFT_PROJECT_NAME:
      Component = <ProjectName />;
      break;
    case FormType.UCRAFT_BILLING:
      Component = <PaymentInfo />;
      break;
    case FormType.UCRAFT_DESIGN_TEMPLATE:
      Component = <DesignTemplate />;
      break;
    case FormType.UCRAFT_WEBSITE_DESIGN:
      Component = <WebsiteDesign />;
      break;
    case FormType.UCRAFT_WEBSITE_URL:
      Component = <WebsiteUrl />;
      break;
    case FormType.UCRAFT_PROJECT_LOGO:
      Component = <LogoUploader />;
      break;
    case FormType.UCRAFT_PROJECT_URL:
      Component = <ProjectUrl />;
      break;
    case FormType.UCRAFT_EMAIL:
      Component = <UserEmail />;
      break;

    /**
     * Spring builder
     */
    case "SPRING_BUILDER":
      Component = <SpringBuilderComponentsSwitcher />;
  }

  return <MessageProvider value={props}>{Component}</MessageProvider>;
}

export const CustomFieldRenderer = memo(IntegrationWrapper);
