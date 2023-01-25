import React from "react";
import { ApolloProvider } from "@apollo/client";
import UserEmail from "./componets/UserEmail";
import ProjectUrl from "./componets/ProjectUrl";
import LogoUploader from "./componets/LogoUploader";
import WebsiteDesign from "./componets/WebsiteDesign";
import DesignTemplate from "./componets/DesignTemplate";
import PaymentInfo from "./componets/PaymentInfo";
import ProjectName from "./componets/ProjectName";
import LikedWebsite from "./componets/LikedWebsite";
import WebsiteUrl from "./componets/WebsiteUrl";
import { SSO_URL } from "./constants";
import { FormType } from "../../constants";
import { getUcraftAuthToken } from "./helpers";
import { useApolloClient } from "../../hooks";
import { useMessageContext } from "../../contexts";

type Props = {
  type: FormType;
};

function Ucraft({ type }: Props) {
  const apolloClientParams = {
    serviceUri: `${SSO_URL}/graphql`,
    authToken: getUcraftAuthToken(),
  };
  const client = useApolloClient({ apolloClientParams });
  const { field } = useMessageContext();
  const renderComponent = () => {
    switch (type) {
      /**
       * Ucraft
       */
      case FormType.UCRAFT_LIKED_WEBSITE:
        return <LikedWebsite />;
      case FormType.UCRAFT_PROJECT_NAME:
        return <ProjectName />;
      case FormType.UCRAFT_BILLING:
        return <PaymentInfo />;
      case FormType.UCRAFT_DESIGN_TEMPLATE:
        return <DesignTemplate />;
      case FormType.UCRAFT_WEBSITE_DESIGN:
        return <WebsiteDesign />;
      case FormType.UCRAFT_WEBSITE_URL:
        return <WebsiteUrl />;
      case FormType.UCRAFT_PROJECT_LOGO:
        return <LogoUploader />;
      case FormType.UCRAFT_PROJECT_URL:
        return <ProjectUrl />;
      case FormType.UCRAFT_EMAIL:
        return <UserEmail />;
    }
    return null;
  };

  return (
    <ApolloProvider client={client}>
      <div></div>
      <div>{field.question || field.title}</div>
      {renderComponent()}
    </ApolloProvider>
  );
}

export default Ucraft;
