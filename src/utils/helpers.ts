import {
  PhoneNumberUtil,
  PhoneNumberFormat as PNF,
} from "google-libphonenumber";
import { GenericFriendlyError } from "../utils/errors";

const phoneUtil = PhoneNumberUtil.getInstance();

export default function parsePhoneNumber(phone: string) {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone, "NG");
    return phoneUtil.format(number, PNF.INTERNATIONAL).replace(/ +/g, "");
  } catch (error) {
    if (error instanceof Error) {
      throw GenericFriendlyError.createValidationError(error.message);
    }
    throw error;
  }
}
