import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, message } from "antd";

interface CaptionPromptProps {
  setCaption: (caption: string) => void;
}

const CaptionPrompt: React.FC<CaptionPromptProps> = ({ setCaption }) => {
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
    setloading(true);
    const inputText = inputRef?.current?.value;
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: inputText }),
        }
      );
      const result = await response.json();
      const generatedText = result[0].generated_text;
      const parts = generatedText.split("\n\n");
      const secondPart = parts[1];
      setCaption(secondPart);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="position-relative w-full">
      <h3 className="text-gray-600">Caption Prompt</h3>
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
        <Button onClick={handleSubmit} disabled={textDisable} loading={loading}>
          {" "}
          Create
        </Button>
      </div>
    </div>
  );
};

export default CaptionPrompt;
