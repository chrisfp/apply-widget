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

export const formatPhoneNumber = (s: string) => s.replace(/[^0-9]/g, "");

export const formatPostalCode = (s: string) =>
  s.toUpperCase().replace(/\s/g, "");

export const formatPhoneNumberCountryCode = (sRaw: string) => {
  const s = sRaw;
  if (s.startsWith("+")) {
    return `+${s.slice(1).replace(/[^0-9]/g, "")}`;
  }
  if (s.startsWith("00") && s.length > 4) {
    return `+${s.slice(2).replace(/[^0-9]/g, "")}`;
  }
  if (s.startsWith("0") && !s.startsWith("00") && s.length > 1) {
    return `+49${s.slice(1).replace(/[^0-9]/g, "")}`;
  }
  return s.replace(/[^0-9]/g, "");
};
