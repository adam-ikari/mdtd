import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import stringWidth from "string-width";

type Props = {
  inputValue: string;
  width?: number;
};

function getVisualWidth(str: string) {
  return stringWidth(str);
}

export default function InputBox({ inputValue, width }: Props) {
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPos, setCursorPos] = useState(inputValue.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCursorPos(inputValue.length);
  }, [inputValue]);

  const visualWidth = getVisualWidth(inputValue);
  const minWidth = width ?? 20;
  const padding = Math.max(0, minWidth - visualWidth);

  return (
    <Box borderStyle="single" paddingX={1} borderColor="green">
      <Text color="white" backgroundColor="black">
        {inputValue.slice(0, cursorPos)}
        {showCursor ? "▌" : inputValue.slice(cursorPos, cursorPos + 1) || " "}
        {inputValue.slice(cursorPos + (showCursor ? 0 : 1))}
        {" ".repeat(padding)}
      </Text>
    </Box>
  );
}
