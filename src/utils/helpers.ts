export const enumKeys = <E>(e: E): (keyof E)[] => {
  return Object.keys(e) as (keyof E)[];
};

export const removeUndefinedFields = <T extends { [key: string]: any }>(
  obj: T
) =>
  Object.keys(obj).reduce(
    (prev, key) => (obj[key] != null ? { ...prev, [key]: obj[key] } : prev),
    {}
  ) as T;
