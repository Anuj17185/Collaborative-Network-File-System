import { WebSocket } from "ws";
import fs from "fs/promises";
import path from "path";
const dirpath=path.join(__dirname,"server","storage","files");
exports.readfile=async(filename:string):Promise<string>=>{
    try{
        const file=path.basename(filename);
        const filepath=path.join(dirpath,file);
        const content=await fs.readFile(filepath,'utf-8');
        return content;
    }
    catch(err){
        console.error(err);
        return "";
    };
};
exports.savefile=async(filename:string,content:string):Promise<boolean>=>{
    try{
        const file=path.basename(filename);
        const filepath=path.join(dirpath,file);
        await fs.writeFile(filepath,content,'utf-8');
        return true;
    }
    catch(err:any){
        console.error("got error while saving file");
        return false;
    }
};
exports.createfile=async (filename:string,content:string):Promise<boolean>=>{
    try{
        const file=path.basename(filename);
        const filepath=path.join(dirpath,file);
        await fs.writeFile(filepath,content,{flag:'wx',encoding:'utf-8'});
        return true;
    }
    catch(err:any){
        if(err==="EEXIST"){
            console.log("file already exists");
        }
        return false;
    }
};
exports.allfiles=async ():Promise<string[]>=>{
    try{
        const files=await fs.readdir(dirpath,{withFileTypes:true});
        const allfile=[];
        for(const file in files){
            const f=path.basename(file);
            allfile.push(file);
        }
        return allfile;
    }
    catch(err:any){
        console.error(err);
        return [];
    }
};