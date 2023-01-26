export const safeReadJson = (
  str: string,
  defaultValue = {}
): Record<string, any> => {
  let result = defaultValue;
  try {
    result = JSON.parse(str);
  } catch (e) {}

  return result;
};
