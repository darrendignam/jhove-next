import React from "react";

interface ProcessedResult {
  valid?: string;
  mimeType?: string;
  format?: string;
  size?: string;
  wellFormed?: string;
  validMessage?: string;
  wellFormedMessage?: string;
  messages?: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  checksum?: string;
  module?: string;
  processedResult?: ProcessedResult;
  rawApiOutput?: Record<string, unknown>;
}

interface AnalyseProps {
  fileInfo: FileInfo | null;
}

export default function Analyse({ fileInfo }: AnalyseProps) {
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
}