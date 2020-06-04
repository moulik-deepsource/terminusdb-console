const server=process.env.TERMINUSDB_SERVER || "http://localhost:6363/" 

const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

let key = process.env.TERMINUSDB_KEY || user0bj.password 

const userName=user0bj.username || 'admin'

const db=process.env.TERMINUSDB_DB || process.env.TERMINUSDB_SERVER

if(!key){
	key=window.sessionStorage.getItem("apiKey");
}

export const localSettings = {server : server,
                              key : key,  
                              db : db}
