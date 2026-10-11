import React from 'react';
import {FileCard} from "../components/Filecard";

interface FileExplorerProps {
    files:string[];
    onView:(filename:string)=>void;
    onEdit:(filename:string)=>void;
    onUploadclick:()=>void;
}
export const FileExplorer:React.FC<FileExplorerProps>=({files,onView,onEdit,onUploadclick})=>{
    return (
        <div>
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Available Files ({files.length})
                </h2>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md font-medium transition-colors" onClick={onUploadclick}>
                    Upload
                </button>
            </div>
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
        </div>
    );
}