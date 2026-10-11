import React, { useState } from 'react';
import { ArrowLeft, FilePlus2 } from 'lucide-react';
import { FileUpload } from '../components/Fileupload';

interface FileUploaderProps {
    onUpload:(filename:string,content:string)=>void;
    onBacktoFiles:()=>void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  onBacktoFiles
}) => {
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
      <div className="flex flex-col gap-6">
        <header className="mx-auto w-full max-w-3xl flex flex-col gap-4">
          <button
            type="button"
            onClick={onBacktoFiles}
            className="inline-flex w-fit items-center gap-2 text-xs text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to files
          </button>
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">
              Add a file
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Upload an existing file or create a new one on the server.
            </p>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <section>
            <FileUpload onUpload={onUpload} />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center gap-3">
              <FilePlus2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-200">
                Create new file
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                Filename
                <input
                  type="text"
                  placeholder="e.g. test.txt"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-blue-500"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-slate-400">
                Initial content
                <textarea
                  placeholder="Optional"
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  rows={6}
                  className="resize-none rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 outline-none focus:border-blue-500"
                />
              </label>

              <button
                type="submit"
                className="mt-1 rounded-md bg-emerald-600 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Create file
              </button>
            </form>
          </section>
        </div>
        </div>
    );
  };