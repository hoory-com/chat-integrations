import React, { lazy } from "react";
import { ContextType, Provider as MessageProvider } from "./contexts";
import Ucraft from "./integrations/ucraft";
import { customSpringUserMessageRenderer } from "./integrations/spring-builder";
import { safeReadJson } from "./helpers";

/**
 * Spring builder
 */
const SpringBuilderComponentsSwitcher = lazy(
  () => import("./integrations/spring-builder")
);

type Props = ContextType;

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

export const CustomFieldRenderer = IntegrationWrapper;

export const customUserMessageRenderer = (message: any) => {
  let messageObject;
  if (message?.type === 0) messageObject = safeReadJson(message.body, {});
  else messageObject = safeReadJson(message);

  if (
    !messageObject ||
    !messageObject?.field ||
    !messageObject?.field.custom_provider
  )
    return message;

  switch (messageObject.field.custom_provider) {
    case "SPRING_BUILDER":
      return customSpringUserMessageRenderer(messageObject as any, message);
  }

  return message;
};
