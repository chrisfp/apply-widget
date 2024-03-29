import { AsYouType } from "libphonenumber-js";

export const formatCapitalizeFirst = (sRaw: string) => {
  const s = sRaw;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatUpperCase = (s: string) => s.toUpperCase();

export const formatLowerCase = (s: string) => s.toLowerCase();
export const formatLowerCaseTrim = (s: string) => s.toLowerCase().trim();

export const formatIban = (str: string) => {
  return str
    .replace(/[^\dA-Z]/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

export const formatName = (sRaw: string) => {
  const words = sRaw.split(" ");
  return words
    .map((word, index) => {
      const innerWords = word.split("-");
      return innerWords
        .map(word => word.replace(/[^(A-Za-zŽžÀ-ÿ)]/g, ""))
        .map(innerWord =>
          index === 0 || innerWord.length > 1
            ? innerWord.charAt(0).toUpperCase() +
              innerWord.slice(1).toLowerCase()
            : innerWord
        )
        .filter(
          (innerWord, index) =>
            index === innerWords.length - 1 || innerWord.length > 0
        )
        .join("-");
    })
    .filter((word, index) => index === words.length - 1 || word.length > 0)
    .join(" ");
};

export const formatIbanComplex = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const target = event.target;
  let position = target.selectionEnd || 0;
  const length = target.value.length;
  target.value = target.value
    .toUpperCase()
    .replace(/[^\dA-Z]/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
  target.selectionEnd = position +=
    target.value.charAt(position - 1) === " " &&
    target.value.charAt(length - 1) === " " &&
    length !== target.value.length
      ? 1
      : 0;
  return target.value;
};

export const formatStreetNumber = (s: string) =>
  s.replace(/[^0-9a-z\-/]/g, "").toLowerCase();

export const formatWeekNumber = (s: string) => s.replace(/[^0-9 ]/g, "");

export const formatPostalCode = (s: string) =>
  s.toUpperCase().replace(/\s/g, "");

export const formatPhoneNumberCountryCode = (sRaw: string) => {
  const s = sRaw.trim();
  if (!s) {
    return "";
  }
  if (s.startsWith("+")) {
    return new AsYouType("DE").input(`+${s.slice(1).replace(/[^0-9 ]/g, "")}`);
  }
  if (s.startsWith("00") && s.length > 4) {
    return new AsYouType("DE").input(`+${s.slice(2).replace(/[^0-9 ]/g, "")}`);
  }
  if (s.startsWith("0") && !s.startsWith("00") && s.length > 1) {
    return new AsYouType("DE").input(
      `+49${s.slice(1).replace(/[^0-9 ]/g, "")}`
    );
  }
  return new AsYouType("DE").input(s.replace(/[^0-9 ]/g, ""));
};
