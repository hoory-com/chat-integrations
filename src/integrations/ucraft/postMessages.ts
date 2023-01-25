import { ChatPagePostMessage } from "./constants";

type DataType = { [key: string]: any };

export function togglePaymentIframe(data: DataType): void {
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_PAYMENT_MODAL },
    "*"
  );
}

export function toggleTemplatesIframe(data?: DataType): void {
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.TOGGLE_TEMPLATE_MODAL },
    "*"
  );
}

export function toggleAiTemplateIframe(data: DataType): void {
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_AI_TEMPLATE_MODAL },
    "*"
  );
}

export function toggleSignInIframe(data: DataType): void {
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_SIGN_IN_MODAL },
    "*"
  );
}

export function toggleAiTemplateByIdIframe(data: DataType): void {
  window.parent.postMessage(
    { ...data, type: ChatPagePostMessage.OPEN_AI_TEMPLATE_BY_ID_MODAL },
    "*"
  );
}
