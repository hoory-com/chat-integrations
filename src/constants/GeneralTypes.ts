export enum FormType {
  SHORT_TEXT = "SHORT_TEXT",
  FULL_NAME = "FULL_NAME",
  LAST_NAME = "LAST_NAME",
  LONG_ANSWER = "LONG_ANSWER",
  FIRST_NAME = "FIRST_NAME",
  SHORT_ANSWER = "SHORT_ANSWER",
  MULTIPLE_SELECTION = "MULTIPLE_SELECTION",
  SINGLE_SELECT = "SINGLE_SELECT",
  CUSTOM = "CUSTOM",

  MULTI_SELECT = "MULTI_SELECT",
  SINGLE_SELECTION = "SINGLE_SELECTION",
  ADDRESS = "ADDRESS",
  DATE = "DATE",
  LOCATION = "LOCATION",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  URL = "URL",
  UCRAFT_NAME = "UCRAFT_NAME", // todo: we can remove and use SHORT_TEXT
  UCRAFT_EMAIL = "UCRAFT_EMAIL",
  UCRAFT_LOCATION = "UCRAFT_LOCATION", // todo: we can remove and use LOCATION
  UCRAFT_PROJECT_NAME = "UCRAFT_PROJECT_NAME", // todo: we can remove and use SHORT_TEXT
  UCRAFT_PROJECT_URL = "UCRAFT_PROJECT_URL", // todo: we can remove and use SHORT_TEXT
  UCRAFT_PROJECT_LOGO = "UCRAFT_PROJECT_LOGO",
  UCRAFT_TEMPLATE_CHOOSE = "UCRAFT_TEMPLATE_CHOOSE",
  UCRAFT_BILLING = "UCRAFT_BILLING",
  UCRAFT_WEBSITE_DESIGN = "UCRAFT_WEBSITE_DESIGN", // todo: we can remove and use SINGLE_SELECTION
  UCRAFT_DESIGN_TEMPLATE = "UCRAFT_DESIGN_TEMPLATE",
  UCRAFT_LIKED_WEBSITE = "UCRAFT_LIKED_WEBSITE", // todo: we can remove and use SINGLE_SELECTION
  UCRAFT_WEBSITE_URL = "UCRAFT_WEBSITE_URL", // todo: we can remove and use SHORT_TEXT
  UCRAFT_PDC_SAVE_DESCRIPTION = "UCRAFT_PDC_SAVE_DESCRIPTION",
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  city: string;
  country: string;
  locationTime: string;
  type: number;
  email: string;
  phone: string;
  agreement: boolean;
  status: string;
  sidebarOrderList: Array<Record<string, any>>;
  rolesList: Array<string>;
  hasRealFirstName: boolean;
  hasRealLastName: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  emailSubscription: boolean;
  firstSeen: string;
  lastSeen: string;
  hasPassword: boolean;
};

export enum RasaMessageType {
  ANSWER = "ANSWER",
  FORM = "FORM",
  BUTTON = "BUTTON",
  DELAY = "DELAY",
  FORM_CS = "FORM_CS",
}

enum ButtonType {
  ConnectToSupport = "CONNECT_TO_SUPPORT",
  Url = "URL",
}

export const RasaOptionsValues = {
  [ButtonType.Url]: "",
  [ButtonType.ConnectToSupport]: "/trigger_handoff",
};

export type RasaOptions = {
  title: string;
  type: ButtonType;
  payload: string;
};

enum AttachmentType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

type Attachment = {
  type: AttachmentType;
  payload: { type: string; src: string };
};

type fieldMetadataType = {
  isLastField: boolean;
};

export type RasaFieldType = {
  type: string;
  question: string;
  title: string;
  placeholder?: string;
  fieldMetadata: fieldMetadataType;
  options?: RasaOptions[] | string;
  value: string;
  required: boolean;
  custom_provider: string;
  custom_type: FormType;
};

export type RasaSockedMessage = {
  id: string;
  type: RasaMessageType;
  body?: string;
  draft?: string;
  actions?: RasaOptions[];
  attachments?: Attachment[];
  metadata: Record<string, string>;
  field?: RasaFieldType;
  form?: {
    id: string;
    title: string;
    fields: Record<string, string>;
    fields_count: number;
  };
};

export enum MessageType {
  MESSAGE = 0,
  NOTIFICATION = 1,
  INTERNAL_NOTE = 2,
  CONTACT_FORM = 3,
  KNOWLEDGE_BASE = 4,
  GOOGLE = 5,
  WIKIPEDIA = 6,
  CONTACT_FORM_SUBMITTED = 7,
  BET_FLOW = 8,
  RASA_MESSAGE = 9,
}

export type MessageResponse = {
  id: string;
  type: MessageType;
  body: string;
  createdAt: string;
  createdBy?: User;
  notificationType: any;
  paramsList: Array<string>;
  actions: string;
  conversationId: string;
  conversation: string;
  draft: string;
  knowledgeBaseUri: string;
  knowledgeBaseHighlightStart: number;
  knowledgeBaseHighlightEnd: number;
  knowledgeBaseImageUrl: string;
  knowledgeBaseTitle: string;
  googleUrl: string;
  googleSearchText: string;
  disabled: boolean;
  deliveryType: string;
  attachmentsList: Array<Attachment>;
};
