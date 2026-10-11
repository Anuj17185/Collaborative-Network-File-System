import express,{type Express,type Request,type Response,type NextFunction} from "express";
import { WebSocketServer,WebSocket,RawData } from 'ws';
import * as filecontroller from './controller/filecontroller';
import * as lockcontroller from './controller/lockcontroller';
import cors from 'cors';
import crypto from 'crypto';
import {IncomingMessage,OutgoingMessage} from './types/message'

const app:Express=express();

app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server=app.listen(8080);
const wss = new WebSocketServer({ server });

const brodcast=(data:OutgoingMessage)=>{
    const payload=JSON.stringify(data);
    wss.clients.forEach((client)=>{
        if(client.readyState==WebSocket.OPEN){
            client.send(payload);
        }
    })
};
wss.on('connection',async(ws:WebSocket)=>{
    const clientid=crypto.randomUUID();

    const avalfiles=await filecontroller.allfiles();
    ws.send(JSON.stringify({type:'INIT_STATE',files:avalfiles,clientid:clientid} satisfies OutgoingMessage));

    ws.on('message',async (rawmsg:RawData)=>{

        try{
            const msgstring=rawmsg.toString();
            const data:IncomingMessage= JSON.parse(msgstring);
            switch(data.type){
                case 'READ_FILE':{
                    const filename=data.filename;
                    const content= await filecontroller.readfile(filename);
                    const holder=lockcontroller.getfileaccessholder(filename,clientid);
                    ws.send(JSON.stringify({type:'FILE_CONTENT',content:content,filename:filename,
                        holder:holder
                    } satisfies OutgoingMessage));
                    break;
                }
                case 'ACQUIRE_LOCK':{
                    const filename=data.filename;
                    const outcome=lockcontroller.aquirelock(filename,clientid,ws,(expiredfile,holder)=>{
                        brodcast({type:'LOCK_RELEASED',
                            filename:expiredfile,
                            clientid:holder,
                            reason:"timeout"
                        });
                    });
                    if(outcome.success){
                        const content=await filecontroller.readfile(filename);
                        ws.send(JSON.stringify({
                            type:'LOCK_GRANTED',
                            content:content,
                            filename:filename,
                            clientid:clientid
                        } satisfies OutgoingMessage))

                        brodcast({type:'LOCK_STATUS_CHANGED',
                            filename:filename,
                            holder:clientid
                        });
                    }
                    else{
                        const holder= lockcontroller.getfileaccessholder(filename,clientid);
                        ws.send(JSON.stringify({
                            type:'LOCK_DENIED',
                            filename:filename,
                            holder:holder
                        } satisfies OutgoingMessage));
                    }
                    break;
                }
                case 'RELEASE_LOCK':{
                    const filename=data.filename;
                    const outcome:boolean=lockcontroller.releaselock(filename,clientid);
                    if(outcome){
                        brodcast({
                            type:'LOCK_RELEASED',
                            filename:filename,
                            clientid:clientid,
                            reason:"released"
                        });
                    }
                    else{
                        ws.send(JSON.stringify({
                            type:"ERROR",
                            msg:"Either the file doesn't exist or the file isn't locked"
                        } satisfies OutgoingMessage));
                    }
                    break;
                }
                case "SAVE_CONTENT":{
                    if(clientid != lockcontroller.getfileaccessholder(data.filename,clientid)){
                        ws.send(JSON.stringify({
                            type:"ERROR",
                            msg:"You don't have write permission"
                        } satisfies OutgoingMessage));
                        return;
                    }
                    const content=data.content||'';
                    const outcome:boolean=await filecontroller.savefile(data.filename,content);
                    if(outcome){
                            brodcast({type:'FILE_UPDATED',
                            filename:data.filename,
                            content:content,
                            clientid:clientid
                        });
                    }
                    break;
                }
                case "HEARTBEAT":{
                    const outcome=lockcontroller.renew(data.filename,clientid,(filename,expiredClientId)=>{
                        brodcast({
                            type: "LOCK_RELEASED",
                            filename,
                            clientid: expiredClientId,
                            reason: "timeout"
                        });
                    });
                    if(outcome){
                        ws.send(JSON.stringify({
                        type: 'HEARTBEAT_ACK',
                        filename: data.filename,
                        clientid:clientid
                        } satisfies OutgoingMessage));

                    }
                    break;
                }
                case 'CREATE_FILE': {
                    const created = await filecontroller.createfile(data.filename, data.content || '');
                    if (created) {
                        const updatedFiles = await filecontroller.allfiles();
                        brodcast({
                        type: 'FILE_CREATED',
                        filename: data.filename,
                        files: updatedFiles,
                        });
                    } 
                    else {
                        ws.send(JSON.stringify({
                        type: 'ERROR',
                        msg: `Failed to create file '${data.filename}'. File might already exist.`,
                        }));
                    }
                    break;
                    }
            }   
        }
        catch(err){
           ws.send(JSON.stringify({
             type: 'ERROR',
             msg: 'Malformed JSON payload.' 
            } satisfies OutgoingMessage
        ));
        }
    })
    ws.on('close',()=>{
        lockcontroller.disconnect(ws,(filename,clientid)=>brodcast({
                type:'LOCK_RELEASED',
                filename:filename,
                clientid:clientid,
                reason:"disconnected"
            }));
        })
    
});
