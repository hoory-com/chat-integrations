export const safeReadJson = (
  str: string,
  defaultValue = {}
): Record<string, any> => {
  let result = defaultValue;
  try {
    result = JSON.parse(str);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return result;
};
