"use client";

import "@/lib/env";
import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import TextDisplay from "../components/TextDisplay";

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function Home() {
      const [text, setText] = useState<string>("");

      return (
            <div className="container mx-auto p-8">
                  <h1 className="text-3xl font-bold mb-4">File Text Extractor</h1>
                  <FileUpload />
                  {text && <TextDisplay text={text} />}
            </div>
      );
}
