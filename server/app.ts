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

const server=app.listen(3000);
const wss=new WebSocketServer({server});


wss.on('connection',async(ws:WebSocket)=>{
    const clientid=crypto.randomUUID();

    const avalfiles=await filecontroller.allfiles();
    ws.send(JSON.stringify({type:'INIT_STATE',filse:avalfiles,clientid:clientid}));

    ws.on('message',(rawmsg:RawData)=>{
        const msgstring=rawmsg.toString();
        console.log(msgstring);

        try{
            const data= JSON.parse(msgstring);
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    })
});
