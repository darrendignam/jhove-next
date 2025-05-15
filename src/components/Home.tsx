import React from "react";
import Image from "next/image";

interface HomeProps {
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedModule: string;
  handleModuleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Home({
  isDragging,
  setIsDragging,
  handleFileDrop,
  handleFileSelect,
  selectedModule,
  handleModuleChange,
}: HomeProps) {
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
}