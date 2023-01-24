import { useMessageContext } from "contexts";
import { useCallback } from "react";

export const useUpdateMessages = () => {
  const { message } = useMessageContext();
  const formattedMessage = message;

  const updateMessages = useCallback(
    (value: string) => {
      return JSON.stringify([
        {
          ...formattedMessage,
          field: { ...formattedMessage.field, value },
        },
      ]);
    },
    [JSON.stringify(formattedMessage)]
  );

  return { updateMessages };
};
