import React from 'react';

function Dropzone({ onFileSelect }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center rounded-lg border border-dashed border-slate-700 px-6 py-10 bg-slate-900">
      <div className="text-center">
        <div className="mt-4 flex text-sm leading-6 text-slate-300 justify-center">
          <label htmlFor="dropzone-upload" className="relative cursor-pointer rounded-md bg-slate-850 font-semibold text-brand-400 focus-within:outline-none hover:text-brand-300">
            <span>Upload a file</span>
            <input id="dropzone-upload" type="file" className="sr-only" accept=".pdf" onChange={handleChange} />
          </label>
        </div>
        <p className="text-xs leading-5 text-slate-400">PDF up to 50MB</p>
      </div>
    </div>
  );
}

export default Dropzone;
