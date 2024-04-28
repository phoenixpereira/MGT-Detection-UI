import React, { useState } from "react";
import pdfToText from "react-pdftotext";

function FileUpload() {
      const [pdfText, setPdfText] = useState<string>("");

      const extractText = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                  pdfToText(file)
                        .then((text: string) => setPdfText(text))
                        .catch((error: any) => console.error("Failed to extract text from pdf"));
            }
      };

      const handleSubmit = () => {
            const text = (document.getElementById("textInput") as HTMLTextAreaElement)?.value;
            if (text) {
                  setPdfText(text);
            }
      };

      return (
            <div className="mx-auto p-4 border border-gray-300 rounded-md shadow-md">
                  <p className="mb-4 text-lg font-semibold">Select a PDF or enter text.</p>
                  <div className="mb-4">
                        <input
                              type="file"
                              accept="application/pdf"
                              onChange={extractText}
                              className="border border-gray-300 rounded-md p-2 w-full"
                        />
                  </div>
                  <textarea
                        id="textInput"
                        className="border border-gray-300 rounded-md p-4 w-full"
                        placeholder="Enter text here..."
                  ></textarea>
                  <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        onClick={handleSubmit}
                  >
                        Submit
                  </button>
                  {pdfText && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-md">
                              <h2 className="text-lg font-semibold mb-2">Extracted Text</h2>
                              <p>{pdfText}</p>
                        </div>
                  )}
            </div>
      );
}

export default FileUpload;
