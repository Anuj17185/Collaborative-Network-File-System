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

exports.aquirelock=(filename:string,client:string,ws:WebSocket,
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
exports.releaselock=(filename:string,client:string,ws:WebSocket):boolean=>{
    const file=activelock.get(filename);
    if(!file|| file.holder!=client) return false;
    clearTimeout(file.timer);
    activelock.delete(filename);
    return true;
};
exports.renew=(filename:string,client:string,ws:WebSocket,onexpire:(filename:string,client:string)=>void):boolean=>{
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
exports.getfileaccessholder=(filename:string,client:string)=>{
    const filedet=activelock.get(filename);
    const fileholder=filedet?.holder;
    return fileholder;
}
exports.disconnect=(ws:WebSocket)=>{
    activelock.forEach((file:filedetails,filename:string)=>{
        if(file.socket==ws){
            clearTimeout(file.timer);
            activelock.delete(filename);
        }
    })
};