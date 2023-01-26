import React, { useState } from "react";
import { useUpdateMessages } from "../../../../hooks";
import { safeReadJson } from "../../../../helpers";
import { RasaOptions } from "../../../../constants";
import { useMessageContext } from "../../../../contexts";
import { ActionsWrapper, ActionBtn } from "./styles";
import { toggleProductDescriptionSave } from "../../postMessages";

function ProductDescriptionSave() {
  const {
    sendMessageHandler,
    isLastMessage,
    prevMessage,
    field: { options, value },
    isLastField,
    message,
  } = useMessageContext();
  const { updateMessages } = useUpdateMessages();
  const [completed, setCompleted] = useState(isLastMessage || Boolean(value));
  const [selectedOption, setSelectedOption] = useState<number>();
  const optionList =
    typeof options === "string" && options
      ? (safeReadJson(options, []) as RasaOptions[])
      : (options as RasaOptions[]);
  const handleClick = (
    { payload, title }: { payload: string; title: string },
    index: number
  ) => {
    if (title.toLowerCase().includes("yes")) {
      const descriptionData =
        safeReadJson(prevMessage.actions, [{}])[0]?.body || "N/A";
      toggleProductDescriptionSave({ text: descriptionData });
    }

    sendMessageHandler &&
      sendMessageHandler({
        message: title,
        metadata: { payload, updateId: message.id },
        updateActionsBody: updateMessages(payload),
        isLastField,
      });
    setCompleted(true);
    setSelectedOption(index);
  };

  return (
    <ActionsWrapper>
      {optionList?.map((item, index) => {
        return (
          <ActionBtn
            key={item.title}
            value={item.payload}
            disabled={completed}
            $isSelectedOption={selectedOption === index || item.title === value}
            onClick={() => handleClick(item, index)}
          >
            {item.title}
          </ActionBtn>
        );
      })}
    </ActionsWrapper>
  );
}

export default ProductDescriptionSave;
