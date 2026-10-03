import express,{type Express,type Request,type Response,type NextFunction} from "express";
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app:Express=express();

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
