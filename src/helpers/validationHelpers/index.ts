import { default as isEmailValid } from "validator/lib/isEmail";
import { default as isUrlValid } from "validator/lib/isURL";
import {
  PROTOCOL,
  REPLACE_ASTERISK_DOT_TEXT,
  REPLACE_TEXT,
} from "constants/GeneralValues";

export function isEmail(value: string): boolean {
  return isEmailValid(value);
}

export function isUrl(value: string, withoutProtocol?: boolean): boolean {
  let replaceText = "";
  if (value.startsWith(REPLACE_ASTERISK_DOT_TEXT)) {
    replaceText = REPLACE_ASTERISK_DOT_TEXT;
  } else if (value.startsWith(REPLACE_TEXT)) {
    replaceText = REPLACE_TEXT;
  }
  if (replaceText) {
    value = value.replace(replaceText, "");
  }
  if (withoutProtocol) {
    value = PROTOCOL + value;
  }
  return isUrlValid(value, {
    protocols: ["https"],
    require_protocol: true,
    allow_underscores: true,
  });
}
