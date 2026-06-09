import React, { useState } from 'react';

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Upload Research Papers</h1>
        <p className="mt-2 text-sm text-slate-400">
          Upload PDF files (up to 50MB) for vector store ingestion, text chunking, and database mapping.
        </p>
      </div>

      <div className="flex justify-center rounded-lg border border-dashed border-slate-700 px-6 py-10 bg-slate-900">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 00-6.75 6.75v5.19a.75.75 0 01-.22.53l-1.015 1.014A1.75 1.75 0 003.75 20.25h16.5a1.75 1.75 0 001.235-2.986l-1.015-1.014a.75.75 0 01-.22-.53V10.5a6.75 6.75 0 00-6.75-6.75h-3zm1.5 4.5a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V8.25z" clipRule="evenodd" />
          </svg>
          <div className="mt-4 flex text-sm leading-6 text-slate-300">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-slate-850 font-semibold text-brand-400 focus-within:outline-none hover:text-brand-300">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-slate-400">PDF up to 50MB</p>
          {file && (
            <p className="mt-4 text-sm text-green-400 font-medium">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
