import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, message } from "antd";

interface ImagePromptProps {
  setImage: (image: File) => void;
}
const ImagePrompt: React.FC<ImagePromptProps> = ({ setImage }) => {
  const [loading, setloading] = useState(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [textDisable, setTextDisable] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleCharCount = () => {
    if (inputRef?.current?.value !== undefined) {
      if (inputRef.current.value.length > 105) {
        setTextDisable(true);
      } else {
        setTextDisable(false);
      }
      setCharCount(inputRef?.current?.value.length);
    }
  };
  const handleSubmit = async () => {
    const inputText = inputRef?.current?.value;
    async function query(data: any) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return result;
    }
    const uniqueId =
      Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    query({ inputs: inputText }).then((responseBlob) => {
      const imageFile = new File([responseBlob], `${uniqueId}image.jpg`, {
        type: responseBlob.type,
      });
      console.log(imageFile);
      setImage(imageFile);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    });
  };

  return (
    <div className="position-relative w-full">
      <h3 className="text-gray-600">Image Prompt</h3>
      <textarea
        // disabled={textDisable}
        onInput={handleCharCount}
        aria-label="textarea"
        className={`text-xs resize-none w-full h-20 p-2 mb-2 border bg-gray-50 bg-opacity-50 rounded-lg ${
          !textDisable ? "border-gray-200" : "border-red-500"
        }`}
        placeholder="Write your prompt here..."
        ref={inputRef}
      ></textarea>
      <div className="flex w-full justify-between align-middle mb-2">
        <p
          className={`text-xs position-relative ${
            textDisable ? "text-red-400" : "text-gray-500"
          } `}
        >
          {!textDisable ? `${charCount} / 105` : "Prompt limit reached"}
        </p>
        <Button onClick={handleSubmit} disabled={textDisable}>
          {" "}
          Create Image
        </Button>
      </div>
    </div>
  );
};

export default ImagePrompt;
