import React from "react";
import { ApolloProvider } from "@apollo/client";
import UserEmail from "./UserEmail";
import ProjectUrl from "./ProjectUrl";
import LogoUploader from "./LogoUploader";
import WebsiteDesign from "./WebsiteDesign";
import DesignTemplate from "./DesignTemplate";
import PaymentInfo from "./PaymentInfo";
import ProjectName from "./ProjectName";
import LikedWebsite from "./LikedWebsite";
import WebsiteUrl from "./WebsiteUrl";
import { FormType, SSO_URL } from "constants/UCValues";
import { getUcraftAuthToken } from "../../helpers/ucraftHelpers";
import { useApolloClient } from "hooks";

type Props = {
  type: FormType;
};

function Ucraft({ type }: Props) {
  const apolloClientParams = {
    serviceUri: `${SSO_URL}/graphql`,
    authToken: getUcraftAuthToken(),
  };
  const client = useApolloClient({ apolloClientParams });

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
  };

  return <ApolloProvider client={client}>{renderComponent}</ApolloProvider>;
}

export default Ucraft;
