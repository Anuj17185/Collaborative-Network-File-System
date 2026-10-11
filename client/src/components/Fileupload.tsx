import React, { useState } from 'react';
import {FileUp} from 'lucide-react';

interface FileUploadProps {
  onUpload: (filename: string, content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);
  const [filename, setFilename] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setSelectedFile({ name: file.name, content: text });
      setFilename(file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !filename.trim()) return;

    onUpload(filename.trim(), selectedFile.content);

    setSelectedFile(null);
    setFilename('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-slate-300">Upload File</h3>

      <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 p-5 rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center gap-2">
        <span className="text-2xl"><FileUp className="w-6 h-6" /></span>
        <span className="text-xs text-slate-300 font-medium">
          {selectedFile ? 'Change selected file' : 'Click to choose file from device'}
        </span>
        <span className="text-[10px] text-slate-500">Supports .txt, .md, .json, .js, .ts</span>
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>

      {selectedFile && (
        <form onSubmit={handleSubmitUpload} className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              Target Filename on Server:
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. upload.txt"
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              If an error occurs or name conflicts, edit the filename above and try again.
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-md transition-colors shadow-sm"
          >
            Confirm Upload
          </button>
        </form>
      )}
    </div>
  );
};