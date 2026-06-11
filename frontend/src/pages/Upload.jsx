import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import { paperService } from '../services/paperService.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (f) => {
    if (!f) return 'No file selected.';
    if (f.type !== 'application/pdf') return 'Only PDF files are allowed.';
    if (f.size > MAX_FILE_SIZE) return 'File exceeds the 50MB size limit.';
    return null;
  };

  const handleFileSelect = (f) => {
    setError(null);
    setResult(null);
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await paperService.uploadPaper(file);
      if (res.success) {
        setResult(res.data);
        setFile(null);
      } else {
        setError(res.error || 'Upload failed.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        icon={UploadIcon}
        title="Upload Research Papers"
        subtitle="Upload PDF files for vector store ingestion, text chunking, and AI-powered analysis. Maximum 50MB per file."
      />

      {/* Dropzone */}
      <Card>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 transition-all duration-300 ${
            dragActive
              ? 'border-brand-400 bg-brand-500/5 shadow-glow-sm'
              : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-600'
          }`}
        >
          <div className={`p-4 rounded-2xl mb-4 transition-colors ${dragActive ? 'bg-brand-500/15' : 'bg-slate-800/60'}`}>
            <UploadIcon className={`h-10 w-10 transition-colors ${dragActive ? 'text-brand-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Choose a file
              </span>
              <span className="text-sm text-slate-400"> or drag and drop</span>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">PDF only • up to 50MB</p>
          </div>
        </div>
      </Card>

      {/* Selected File */}
      {file && !uploading && (
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-500/10">
                <FileText className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => { setFile(null); setError(null); }} variant="ghost" size="sm" icon={X}>
                Remove
              </Button>
              <Button onClick={handleUpload} icon={UploadIcon}>
                Upload & Process
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {uploading && (
        <Card className="animate-fade-in">
          <Loader text="Uploading and processing PDF... Extracting chunks and generating embeddings." />
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="animate-slide-up border-red-500/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {/* Success Result */}
      {result && (
        <Card className="animate-slide-up border-emerald-500/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent-emerald shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-accent-emerald">Upload Successful</p>
              <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-400">
                <span>Original File:</span><span className="text-slate-200">{result.original_filename}</span>
                <span>Secure Name:</span><span className="text-slate-200 font-mono">{result.saved_filename}</span>
                <span>File Size:</span><span className="text-slate-200">{(result.size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
                <span>Chunks Created:</span><span className="text-slate-200">{result.chunks_count}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Upload;
