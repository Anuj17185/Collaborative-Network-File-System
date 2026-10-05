import express,{type Express,type Request,type Response,type NextFunction} from "express";
import { WebSocketServer } from 'ws';
import * as filecontroller from './controller/filecontroller';
import * as lockcontroller from './controller/lockcontroller';
import cors from 'cors';

interface msg{
    type: 'INIT_STATE' | 'ACQUIRE_LOCK' | 'LOCK_GRANTED' | 'LOCK_DENIED' | 'HEARTBEAT' | 'HEARTBEAT_ACK' | 'RELEASE_LOCK' | 'LOCK_RELEASED' | 'SAVE_CONTENT' | 'FILE_UPDATED' | 'ERROR',
    client?:string,
    filename?:string,
    ttl?:string,
    content?:string
}

const app:Express=express();

app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server=app.listen(3000);
const wss=new WebSocketServer({server});


wss.on('connection',(ws)=>{
    console.log("connected");

    ws.on('message',(rawmsg)=>{
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
