'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  accept = 'image/*,.pdf', 
  maxSize = 5 * 1024 * 1024,
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    setError('');
    
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      if (type.includes('/*')) {
        return mimeType.startsWith(type.split('/')[0]);
      }
      return mimeType === type;
    });

    if (!isAccepted) {
      setError('File type not supported');
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={accept}
          onChange={handleChange}
        />

        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-3">
                <CloudArrowUpIcon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                <p className="text-xs text-white/60">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-white/60 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-white/60" />
            <div className="mt-4">
              <p className="text-sm font-medium text-white">
                Drop your file here, or <span className="text-primary-400">browse</span>
              </p>
              <p className="text-xs text-white/60 mt-1">
                Supports: Images, PDF (max {Math.round(maxSize / (1024 * 1024))}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-error mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}