import React, { lazy, memo } from "react";
import { ContextType, Provider as MessageProvider } from "./contexts";
import Ucraft from "./integrations/ucraft";

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
    case "UCRAFT":
      Component = <Ucraft type={props.field.custom_type} />;
      break;

    /**
     * Spring builder
     */
    case "SPRING_BUILDER":
      Component = <SpringBuilderComponentsSwitcher />;
      break;
  }

  return <MessageProvider value={props}>{Component}</MessageProvider>;
}

export const CustomFieldRenderer = memo(IntegrationWrapper);
