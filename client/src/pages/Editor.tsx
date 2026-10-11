import React from 'react';
import { MoveLeft } from 'lucide-react';
import { Lock,LockOpen } from 'lucide-react';

interface EditorPageProps {
  filename: string;
  content: string;
  holder: string | null;
  clientid: string;
  onContentChange: (newContent: string) => void;
  onAcquireLock: () => void;
  onReleaseLock: () => void;
  onBackToDashboard: () => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  filename,
  content,
  holder,
  clientid,
  onContentChange,
  onAcquireLock,
  onReleaseLock,
  onBackToDashboard,
}) => {
  const isLockHolder = holder === clientid && clientid !== '';

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg">
        <button
          onClick={onBackToDashboard}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md transition-colors"
        >
          <MoveLeft className="w-3 h-3 mr-1" /> Back to Files
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-slate-200 font-bold">📄 {filename}</span>
          <div className="text-xs px-2.5 py-1 rounded-md font-mono bg-slate-950 border border-slate-800">
            {holder ? (
              <span className={isLockHolder ? 'text-emerald-400' : 'text-amber-400'}>
                <Lock className="w-3 h-3 mr-1 inline" /> Held by: {isLockHolder ? 'You' : holder}
              </span>
            ) : (
              <span className="text-slate-400"><LockOpen className="w-3 h-3 mr-1 inline" /> Read-Only View</span>
            )}
          </div>
        </div>

        {!isLockHolder ? (
          <button
            onClick={onAcquireLock}
            disabled={holder !== null}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
          >
            Acquire Edit Lock
          </button>
        ) : (
          <button
            onClick={onReleaseLock}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
          >
            Release Lock
          </button>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        disabled={!isLockHolder}
        placeholder={isLockHolder ? 'Type file content here...' : 'Read-only mode. Acquire lock to edit.'}
        className={`w-full flex-1 min-h-120 p-4 font-mono text-sm rounded-xl border focus:outline-none transition-colors resize-none ${
          isLockHolder
            ? 'bg-slate-900 border-blue-500/50 text-slate-100 focus:border-blue-500 shadow-inner'
            : 'bg-slate-900/40 border-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      />
    </div>
  );
};