import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Stethoscope } from 'lucide-react';

interface UploadFormProps {
  onSubmit: (data: string) => void;
  isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, isLoading }) => {
  const [medicalData, setMedicalData] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMedicalData(content);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicalData.trim()) {
      onSubmit(medicalData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Stethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Upload Medical Data</h2>
          <p className="text-sm text-gray-600">Paste patient records or upload a file for AI analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your medical file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports TXT, DOC, DOCX, PDF files up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label htmlFor="medical-data" className="block text-sm font-medium text-gray-700">
            Or paste medical data directly
          </label>
          <textarea
            id="medical-data"
            value={medicalData}
            onChange={(e) => setMedicalData(e.target.value)}
            placeholder="Paste patient medical records, lab results, or clinical notes here..."
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!medicalData.trim() || isLoading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Summary
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setMedicalData('')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};