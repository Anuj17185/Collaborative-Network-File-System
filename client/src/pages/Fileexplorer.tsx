import React,{useState} from 'react';
import {FileUpload} from "../components/Fileupload";
import {FileCard} from "../components/Filecard";

interface FileExplorerProps {
    files:string[];
    onUpload:(filename:string,content:string)=>void;
    onView:(filename:string)=>void;
    onEdit:(filename:string)=>void;
}
export const FileExplorer:React.FC<FileExplorerProps>=({files,onUpload,onView,onEdit})=>{
    const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onUpload(newFileName.trim(), newFileContent);
    setNewFileName('');
    setNewFileContent('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Available Files ({files.length})
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No files on server. Upload or create one below!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {files.map((file) => (
              <FileCard
                key={file}
                filename={file}
                onView={onView}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <FileUpload onUpload={onUpload} />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-300">Create New File</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="e.g. main.ts"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Initial content (optional)"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              rows={3}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-md p-3 font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2 rounded-md transition-colors"
            >
              Create File
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}