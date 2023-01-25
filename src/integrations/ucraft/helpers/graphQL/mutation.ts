import { gql } from "@apollo/client";

export const generateProjectNameMutation = gql`
  mutation generateProjectName($name: String!) {
    generateProjectName(name: $name)
  }
`;
