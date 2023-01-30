import { ChatPagePostMessage } from "./constants";

type DataType = Record<string, any>;

export function togglePaymentIframe(data: DataType): void {
  console.log(data, "gggggggggg");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_PAYMENT_MODAL },
    "*"
  );
}

export function toggleTemplatesIframe(data?: DataType): void {
  console.log(data, "qqqqqqqq");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.TOGGLE_TEMPLATE_MODAL },
    "*"
  );
}

export function toggleAiTemplateIframe(data: DataType): void {
  console.log(data, "wwwwwwwwwwww");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_AI_TEMPLATE_MODAL },
    "*"
  );
}

export function toggleSignInIframe(data: DataType): void {
  console.log(data, "yyyyyyyyyyyyy");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_SIGN_IN_MODAL },
    "*"
  );
}

export function toggleAiTemplateByIdIframe(data: DataType): void {
  console.log(data, "uuuuuuuuuuuuuuu");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_AI_TEMPLATE_BY_ID_MODAL },
    "*"
  );
}

export function toggleProductDescriptionSave(data: DataType): void {
  console.log(data, "ooooooooooooooo");
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.PRODUCT_DESCRIPTION_SAVE },
    "*"
  );
}
