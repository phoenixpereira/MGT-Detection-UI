import React, { useState } from "react";
import pdfToText from "react-pdftotext";
import TextAnalyser from "./TextAnalyser";

interface FileUploadProps {
      setOverallResult: React.Dispatch<
            React.SetStateAction<{
                  machineGeneratedProbability: number | null;
                  generatedText: string | null;
                  highlightedChunks: any[];
                  textChunks: any[];
            }>
      >;
      setModel1Result: React.Dispatch<React.SetStateAction<number | null>>;
      setModel2Result: React.Dispatch<React.SetStateAction<number | null>>;
      setModel3Result: React.Dispatch<React.SetStateAction<number | null>>;
      highlightedChunks: any[];
      textChunks: any[];
      isSubmitted: boolean;
      setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUpload: React.FunctionComponent<FileUploadProps> = ({
      setOverallResult,
      setModel1Result,
      setModel2Result,
      setModel3Result,
      highlightedChunks,
      textChunks,
      isSubmitted,
      setIsSubmitted,
}) => {
      const [pdfText, setPdfText] = useState<string>("");

      const extractText = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                  pdfToText(file)
                        .then((text: string) => setPdfText(text))
                        .catch((error: any) => console.error("Failed to extract text from pdf"));
            }
      };

      const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setPdfText(event.target.value);
      };

      return (
            <div>
                  {!isSubmitted && (
                        <div className="p-4 border border-gray-300 rounded-md shadow-md">
                              <p className="mb-4 text-lg font-semibold">
                                    Select a PDF or enter text.
                              </p>

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
                                    onChange={handleTextareaChange}
                              ></textarea>
                              {(pdfText || pdfText.trim() !== "") && (
                                    <TextAnalyser
                                          text={pdfText}
                                          setOverallResult={setOverallResult}
                                          setModel1Result={setModel1Result}
                                          setModel2Result={setModel2Result}
                                          setModel3Result={setModel3Result}
                                          highlightedChunks={highlightedChunks}
                                          textChunks={textChunks}
                                          setIsSubmitted={setIsSubmitted}
                                    />
                              )}
                        </div>
                  )}
            </div>
      );
};

export default FileUpload;
