import { useState,useRef,useCallback, useEffect } from "react";
import type {IncomingMessage, OutgoingMessage } from "../types/message";

export const useWebsocket=(url:string, activeFilename:string)=>{
    const [clientid,setclientid]=useState('');
    const [files,setfiles]=useState<string[]>([]);
    const [content,setcontent]=useState('');
    const [isconnected,setisconnected]=useState<boolean>(false);
    const [holder,setholder]=useState<string | null>(null);
    const [status,setstatus]=useState<string|null>('');

    const clientref=useRef('');
    clientref.current=clientid;
    const activeFileRef=useRef('');
    activeFileRef.current=activeFilename;
    const ws=useRef<WebSocket | null>(null);
    const heartbeatinterval=useRef<ReturnType<typeof setInterval> |null>(null);
    
    const sendmessage=useCallback((msg:OutgoingMessage)=>{
        if(ws.current && ws.current.readyState==WebSocket.OPEN){
            ws.current.send(JSON.stringify(msg));
        }
    },[])

    const stopheartbeat=useCallback(()=>{
        if(heartbeatinterval.current){
            clearInterval(heartbeatinterval.current);
            heartbeatinterval.current=null;
        }
    },[]);

    const startheartbeat=useCallback((filename:string)=>{
        stopheartbeat();
        heartbeatinterval.current=setInterval(()=>{
            sendmessage({
                type:"HEARTBEAT",
                filename:filename,
            } satisfies OutgoingMessage)
        },5000);
    },[sendmessage,stopheartbeat]);
    useEffect(()=>{
        const socket=new WebSocket(url);
        ws.current=socket;

        socket.onopen=()=>{
            if (ws.current !== socket) return;
            setisconnected(true);
            setstatus(null);
        }
        socket.onclose=()=>{
            if (ws.current !== socket) return;
            setisconnected(false);
            stopheartbeat();
        }
        socket.onerror = () => {
            if (ws.current !== socket) return;
            setstatus("WebSocket connection error");
        };
        socket.onmessage=(event)=>{
            try{
                const data:IncomingMessage=JSON.parse(event.data);
                switch(data.type){
                    case "INIT_STATE":{
                        const clientid=data.clientid;
                        setclientid(clientid);
                        const allfiles=data.files;
                        setfiles(allfiles);
                        clientref.current=data.clientid;
                        break;
                    }
                    case "FILE_CONTENT":{
                        const content=data.content;
                        const holder=data.holder;
                        setcontent(content);
                        setholder(holder);
                        break;
                    }
                    case "FILE_CREATED":{
                        const allfiles=data.files;
                        setfiles(allfiles);
                        break;
                    }
                    case "LOCK_GRANTED":{
                        const content=data.content;
                        setholder(data.clientid);
                        setcontent(content);
                        startheartbeat(data.filename);
                        break;
                    }
                    case "LOCK_DENIED":{
                        setcontent(data.content);
                        setholder(data.holder);
                        setstatus("Lock denied");
                        break;
                    }
                    case "LOCK_RELEASED":{
                        if (data.filename !== activeFileRef.current) break;
                        setholder(null);
                        stopheartbeat();
                        setstatus('Lock released');
                        break;
                    }
                    case "LOCK_STATUS_CHANGED":{
                        if (data.filename !== activeFileRef.current) break;
                        setholder(data.holder);
                        break;
                    }

                    case "FILE_UPDATED":{
                        if (data.filename === activeFileRef.current &&
                            data.clientid !== clientref.current) {
                        setcontent(data.content);
                        }
                        break;
                    }
                    case "HEARTBEAT_ACK":{
                        if (data.filename !== activeFileRef.current) break;
                        break;
                    }
                    case "ERROR":{
                        setstatus(data.msg);
                        break;
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        };
        return ()=>{
            stopheartbeat();
            if (ws.current === socket) {
                ws.current = null;
            }
            socket.close();
        };
    },[url,startheartbeat,stopheartbeat]);
    return{
        clientid,
        files,
        content,
        holder,
        status,
        setcontent,
        isconnected,
        sendmessage,
        stopheartbeat
    }
}