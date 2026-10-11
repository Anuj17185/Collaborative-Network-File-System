
import { useState } from 'react';
import { useWebsocket } from './hooks/useWebsocket';
import { Navbar } from './components/navbar';
import { StatusLogger } from './components/StatusLogger';
import { FileExplorer} from './pages/Fileexplorer';
import { EditorPage } from './pages/Editor';
import {FileUploader} from './pages/Fileuploadpage';
import './App.css'

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor' | 'upload'>('dashboard');
  const [selectedFile, setSelectedFile] = useState<string>('');
    const websocketUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    const {clientid,files,content,holder,status,setcontent,isconnected,
        sendmessage,
      stopheartbeat} = useWebsocket(websocketUrl, selectedFile);
  const handleviewfile=(filename:string)=>{
    setSelectedFile(filename);
    sendmessage({type:'READ_FILE',filename:filename});
    setView('editor');
  }
  const handleeditfile=(filename:string)=>{
    setSelectedFile(filename);
    sendmessage({type:'ACQUIRE_LOCK',filename:filename});
    setView('editor');
  }
  const handlecreatefile=(filename:string,content:string)=>{
    sendmessage({type:'CREATE_FILE',filename:filename,content:content});
  }
  const handlebacktodashboard=()=>{
    if(holder==clientid && selectedFile){
      sendmessage({type:'RELEASE_LOCK',filename:selectedFile});
      stopheartbeat();
    }
    setView('dashboard');
    setSelectedFile('');
  }
  const handlecontentchange=(newcontent:string)=>{
    setcontent(newcontent);
    if(holder==clientid && selectedFile){
      sendmessage({type:'SAVE_CONTENT',filename:selectedFile,content:newcontent});
    }
  }
  const handlerelease=()=>{
    if(holder==clientid && selectedFile){
      sendmessage({type:'RELEASE_LOCK',filename:selectedFile});
      stopheartbeat();
    }
  }
  return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6">
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col gap-6">
        <Navbar isconnected={isconnected} clientid={clientid} />
        <StatusLogger status={status} />
        {view === 'dashboard' ? (
          <FileExplorer  files={files} onView={handleviewfile} onEdit={handleeditfile} onUploadclick={()=>setView('upload')} />
          ): view === 'upload' ? (
            <FileUploader onUpload={handlecreatefile} onBacktoFiles={()=>setView('dashboard')} />
          ) : (<EditorPage 
            filename={selectedFile}
            holder={holder}
            clientid={clientid}
            content={content} 
            onContentChange={handlecontentchange}
            onBackToDashboard={handlebacktodashboard}
            onReleaseLock={handlerelease}
            onAcquireLock={()=>sendmessage({type:'ACQUIRE_LOCK',filename:selectedFile})}
             />)}
      </div>
  </div>
  );
}