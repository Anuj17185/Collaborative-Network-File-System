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
const LOCK_TTL=1500;
export const aquirelock=(filename:string,client:string,ws:WebSocket,
    onexpire:(filename:string,client:string)=>void):Lockaquire=>{
        const currentlock=activelock.get(filename);
        if(currentlock && currentlock.holder!=client){
            return {
                success:false,
                holder:currentlock.holder,
                ttl:LOCK_TTL
            };
        }
        if(currentlock){
            clearTimeout(currentlock.timer);
        }
        const timer=setTimeout(()=>{
            releaselock(filename,client);
            onexpire(filename,client);
        },LOCK_TTL);

        activelock.set(filename,{holder:client,socket:ws,timer:timer});
        return {success:true,holder:client,ttl:LOCK_TTL};
}
export const releaselock=(filename:string,client:string):boolean=>{
    const file=activelock.get(filename);
    if(!file|| file.holder!=client) return false;
    clearTimeout(file.timer);
    activelock.delete(filename);
    return true;
};
export const renew=(filename:string,client:string,onexpire:(filename:string,client:string)=>void):boolean=>{
    const file=activelock.get(filename);
    if(!file || file.holder!=client){
        return false;
    }
    clearTimeout(file.timer);
    file.timer=setTimeout(()=>{
        releaselock(filename,client);
        onexpire(filename,client);
    },LOCK_TTL);
    return true;
};
export const getfileaccessholder=(filename:string,client:string)=>{
    const filedet=activelock.get(filename);
    const fileholder=filedet?.holder;
    if(fileholder)return fileholder;
    return null;
};
export const disconnect=(ws:WebSocket,ondisconnect:(filename:string,clientid:string)=>void)=>{
    activelock.forEach((file:filedetails,filename:string)=>{
        if(file.socket==ws){
            const holder=file.holder;
            clearTimeout(file.timer);
            activelock.delete(filename);
            ondisconnect(filename,holder);
        }
    })
};