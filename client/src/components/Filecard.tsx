import React from 'react';
import {Eye,SquarePen,File} from 'lucide-react';

interface FileCardProps {
  filename: string;
  onView: (filename: string) => void;
  onEdit: (filename: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ filename, onView, onEdit }) => (
  <div className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-3 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <span className="text-lg"><File className="w-5 h-5" /></span>
      <span className="text-sm font-mono text-slate-200">{filename}</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(filename)}
        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
      >
        <Eye className="w-3 h-3" />
      </button>
      <button
        onClick={() => onEdit(filename)}
        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
      >
        <SquarePen className="w-3 h-3" />
      </button>
    </div>
  </div>
);