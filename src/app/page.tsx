"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    env?: {
      API_BASE_URL?: string;
    };
  }
}
import Image from "next/image";
import Rusha from "rusha"; // Import Rusha library

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  type AdditionalData = Record<string, unknown>; // Define a specific type for additionalData
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string; checksum?: string; processedResult?: AdditionalData; rawApiOutput?: ApiResult; module?: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModule, setSelectedModule] = useState("AIFF-hul");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://jhove-rs.openpreservation.org/"); // Default value


  useEffect(() => {
    if (typeof window !== "undefined" && window.env?.API_BASE_URL) {
      setApiBaseUrl(window.env.API_BASE_URL);
    }
  }, []);

  const calculateChecksum = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const rushaWorker = Rusha.createWorker(); // Create a Rusha worker instance
      const reader = new FileReader(); // Create a FileReader instance

      reader.onload = function () {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          rushaWorker.onmessage = (e: MessageEvent) => {
            if (e.data.error) {
              reject(`Error calculating checksum: ${e.data.error}`);
            } else {
              resolve(e.data.hash); // Resolve with the calculated checksum
            }
          };

          rushaWorker.postMessage({ id: "1", data: arrayBuffer }); // Send data to the worker
        } catch (error) {
          reject(`Error processing file: ${error}`);
        }
      };

      reader.onerror = function () {
        reject("Error reading file for checksum calculation");
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
  };

  const sendToApi = async (file: File, module: string) => {
    //const apiBaseUrl = window.env?.API_BASE_URL || "https://jhove-rs.openpreservation.org/"; // Fallback to default
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);

    try {
      const response = await fetch(`${apiBaseUrl}/api/jhove/validate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending data to API:", error);
      throw error;
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModule(event.target.value);
  };

  const processFile = async (file: File) => {
    //const filePath = file.path; // Electron provides the file path
    try {
      const checksum = await calculateChecksum(file);
      const apiResult = await sendToApi(file, selectedModule);
      const processedResult = processApiResult(apiResult);

      console.log("API Result:", apiResult);

      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        checksum: checksum,
        module: selectedModule, // Include the selected module        
        processedResult: processedResult, // Include additional data from the API response
        rawApiOutput: apiResult, // Include raw API output
      });
      setActiveSection("Analyse");
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  interface ApiResult {
    mimeType?: string;
    format?: string;
    size?: number;
    valid?: number;
    wellFormed?: number;
    validMessage?: string;
    wellFormedMessage?: string;
    messages?: { message: string }[];
    [key: string]: unknown; // Allow additional properties
  }

  const processApiResult = (apiResult: ApiResult): Record<string, unknown> => {
    return {
      mimeType: apiResult.mimeType || "Unknown",
      format: apiResult.format || "Unknown",
      size: apiResult.size && apiResult.size >= 0 ? `${apiResult.size} bytes` : "Unknown",
      valid: apiResult.valid === 1 ? "Yes" : "No",
      wellFormed: apiResult.wellFormed === 1 ? "Yes" : "No",
      validMessage: apiResult.validMessage || "N/A",
      wellFormedMessage: apiResult.wellFormedMessage || "N/A",
      messages: apiResult.messages?.map((msg) => msg.message).join("; ") || "None",
    };
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Home":
        return (
          <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
          >
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
              <div className="mt-4">
                <p className="text-lg font-medium">First, please select the module:</p>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700 mt-2">
                  Select Module:
                </label>
                <select
                  id="module"
                  name="module"
                  className="custom-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={selectedModule}
                  onChange={handleModuleChange}
                >
                  <option value="AIFF-hul">AIFF-hul</option>
                  <option value="ASCII-hul">ASCII-hul</option>
                  <option value="BYTESTREAM">BYTESTREAM</option>
                  <option value="EPUB-ptc">EPUB-ptc</option>
                  <option value="GIF-hul">GIF-hul</option>
                  <option value="GZIP-kb">GZIP-kb</option>
                  <option value="HTML-hul">HTML-hul</option>
                  <option value="JPEG-hul">JPEG-hul</option>
                  <option value="JPEG2000-hul">JPEG2000-hul</option>
                  <option value="PDF-hul">PDF-hul</option>
                  <option value="PNG-gdm">PNG-gdm</option>
                  <option value="TIFF-hul">TIFF-hul</option>
                  <option value="UTF8-hul">UTF8-hul</option>
                  <option value="WARC-kb">WARC-kb</option>
                  <option value="WAVE-hul">WAVE-hul</option>
                  <option value="XML-hul">XML-hul</option>
                </select>
              </div>
              <div>
              <p className="text-lg font-medium">Next, please Choose a file or drop one here:</p>
              </div>
              <div
                className={`border-2 border-dashed border-gray-400 p-8 rounded-lg text-center transition-colors ${
                  isDragging ? "bg-green-200" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
              >
                <p className="text-lg font-medium">Please add your file:</p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-500 underline"
                >
                  Click to upload
                </label>
              </div>
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
              />
            
            </main>
         
          </div>
        );
      case "Analyse":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Validation Result</h1>
            {fileInfo ? (
              <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 font-medium">Property</th>
                    <th className="border border-gray-300 px-4 py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Name</td>
                    <td className="border border-gray-300 px-4 py-2">{fileInfo.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Size</td>
                    <td className="border border-gray-300 px-4 py-2">{fileInfo.size} bytes</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Type</td>
                    <td className="border border-gray-300 px-4 py-2">{fileInfo.type}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Checksum</td>
                    <td className="border border-gray-300 px-4 py-2">{fileInfo.checksum}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Module</td>
                    <td className="border border-gray-300 px-4 py-2">{fileInfo.module}</td>
                  </tr>
                  <tr
                    className={`${
                      fileInfo.processedResult?.valid === "Yes" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2">Valid</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {String(fileInfo.processedResult?.valid)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">MIME Type</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.mimeType || "Unknown")}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Format</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.format)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Size</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.size)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Well-Formed</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.wellFormed)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Validation Message</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.validMessage)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Well-Formed Message</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.wellFormedMessage)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Messages</td>
                    <td className="border border-gray-300 px-4 py-2">{String(fileInfo.processedResult?.messages)}</td>
                  </tr>
                  {fileInfo.rawApiOutput && (
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Raw API Output</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(fileInfo.rawApiOutput, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <p>No file information available.</p>
            )}
          </div>
        );
      case "About":
        return <p>Learn more about this application in the About section.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <nav className="menu">
        <div
          className={`menu-item ${activeSection === "Home" ? "bg-opf-purple" : ""}`}
          onClick={() => setActiveSection("Home")}
        >
          <span>🏠</span> <span>Home</span>
        </div>
        <div
          className={`menu-item ${activeSection === "Analyse" ? "bg-opf-purple" : ""}`}
          onClick={() => setActiveSection("Analyse")}
        >
          <span>📊</span> <span>Analyse</span>
        </div>
        <div
          className={`menu-item ${activeSection === "About" ? "bg-opf-purple" : ""}`}
          onClick={() => setActiveSection("About")}
        >
          <span>ℹ️</span> <span>About</span>
        </div>
      </nav>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}
