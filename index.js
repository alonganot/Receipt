import { createWorker } from "tesseract.js";

const RECEIPT_SRC = "./receipts/hebreceipt.png";
const getTextFromImage = async () => {
  const worker = await createWorker("heb+eng");
  const {
    data: { text },
  } = await worker.recognize(RECEIPT_SRC);
  await worker.terminate();

  return text;
};

const isHebrewOrEnglish = (text) => {
  return /[a-zA-Z\u0590-\u05FF]/.test(text);
};

const mergeAdjacentCells = (matrix) => {
  return matrix.map((arr) => {
    let mergedArr = [];
    let currentMerge = "";
    arr.map((cell) => {
      if (isHebrewOrEnglish(cell)) {
        currentMerge += currentMerge ? " " + cell : cell;
      } else {
        if (currentMerge) {
          mergedArr.push(currentMerge);
          currentMerge = "";
        }

        mergedArr.push(cell);
      }
    });

    if (currentMerge) {
      mergedArr.push(currentMerge);
    }

    return mergedArr;
  });
};

const convertNumbers = (matrix) => {
  return matrix.map((arr) =>
    arr.map((cell) => {
      let number = parseFloat(cell);
      return isNaN(number) ? cell : number;
    })
  );
};

const convertToTable = (text) => {
  let onlyEndWithNums = text.split("\n").filter((line) => /\d$/.test(line));
  let splittedStringMatrix = onlyEndWithNums.map((str) =>
    str.match(/(?:\d+(\.\d+)?|[^\d\s]+(?: [^\d\s]+)?)/g)
  );
  
  return convertNumbers(mergeAdjacentCells(splittedStringMatrix));
};

let text = await getTextFromImage();

console.log(convertToTable(text));

// let matrix = onlyEndWithNums.map(str => str.split(' '))
//     .map(arr => arr.map(reverseIfContainsHebrew))

// return matrix
// const reverseIfContainsHebrew = (str) => {
//   const hebrewRegex = /[\u0590-\u05FF]/;
//   return hebrewRegex.test(str) ? str.split("").reverse().join("") : str;
// };
