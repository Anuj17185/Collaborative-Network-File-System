import { WebSocket } from "ws";
interface Lockaquire{
    success:boolean,
    holder?:string,
    ttl?:number
};
interface filedetails{
    holder:string,
    socket:WebSocket,
    timer:NodeJS.Timeout;
}
const activelock=new Map<string,filedetails>();

export const aquirelock=(filename:string,client:string,ws:WebSocket,
    onexpire:(filename:string,client:string)=>void):Lockaquire=>{
        if(!activelock.has(filename)){
            return {success:false};
        }
        const timer=setTimeout(()=>{
            exports.releaselock(filename,client,ws);
            onexpire(filename,client);
        },1000);

        activelock.set(filename,{holder:client,socket:ws,timer:timer});
        return {success:true,holder:client,ttl:1000};
}
export const releaselock=(filename:string,client:string,ws:WebSocket):boolean=>{
    const file=activelock.get(filename);
    if(!file|| file.holder!=client) return false;
    clearTimeout(file.timer);
    activelock.delete(filename);
    return true;
};
export const renew=(filename:string,client:string,ws:WebSocket,onexpire:(filename:string,client:string)=>void):boolean=>{
    const file=activelock.get(filename);
    if(!file || file.holder!=client){
        return false;
    }
    clearTimeout(file.timer);
    file.timer=setTimeout(()=>{
        exports.releaselock(filename,client,ws);
        onexpire(filename,client);
    },1000);
    return true;
};
export const getfileaccessholder=(filename:string,client:string)=>{
    const filedet=activelock.get(filename);
    const fileholder=filedet?.holder;
    return fileholder;
}
export const disconnect=(ws:WebSocket)=>{
    activelock.forEach((file:filedetails,filename:string)=>{
        if(file.socket==ws){
            clearTimeout(file.timer);
            activelock.delete(filename);
        }
    })
};