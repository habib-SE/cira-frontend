// utils/numberToDigitalWords.js
import { toWords } from "number-to-words";

export const convertNumbersToDigitalWords = (text) => {
  if (!text) return "";
  const digitMap = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  return text.replace(/\d+(\.\d+)?/g, (match) => {
    return match
      .split("")
      .map((char) => (char === "." ? "dot" : digitMap[parseInt(char)]))
      .join(" ");
  });
};

