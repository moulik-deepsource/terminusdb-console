/**
 * Controller application for branch creation form
 */
import React from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'

/**
 * Creates default main schema graph when chosen (from when api did not include it)
 */
function createStarterGraph(client) {
    return client.createGraph('schema', 'main', "Create Schema Graph Generated by TerminusDB Console")
}

function _is_local_server(client, url){
    return (client.server() == url.substring(0, client.server().length))
}

/**
 * Meta has create db (id, label, comment, organization)
 */
export const CreateLocal = async (meta, client) => {  
    let dbs = client.databases()
    meta.id = _new_local_id(meta.id, dbs)
    if(!meta.label){
        meta.label = meta.id
    }
    meta.label = _new_local_label(meta.label, dbs)
    if(!meta.comment){
        meta.comment = ""
    }
    return client.createDatabase(meta.id, meta, meta.organization).then(() => meta.id)
    //.then(() => createStarterGraph(client))
}

export const CreateRemote = async (meta, client, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    let rmeta = meta
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => {
        if(resp.url) rmeta.remote_url = resp.url
        if(!rmeta.organization_roles) rmeta.organization_roles = ['create'] 
        return CloneDB(rmeta, client, getTokenSilently)
    })
}

export const ForkDB = async (meta, client, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    let rmeta = meta
    meta.fork = true
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => {
        if(resp.url) rmeta.remote_url = resp.url
        if(!rmeta.organization_roles) rmeta.organization_roles = ['create'] 
        return CloneDB(rmeta, client, getTokenSilently)
    })
}



/*
* remote_url 
* id (local)
* label
* comment
*/
export const CloneDB = async (meta, client, getTokenSilently) => {
    let dbs = client.databases()
    let url = meta.remote_url 
    let newid = meta.id
    if(!newid){
        newid = url.substring(url.lastIndexOf('/')+ 1)
    }
    newid = _new_local_id(newid, dbs)
    if(!meta.label){
        meta.label = newid
    }
    meta.label = _new_local_label(meta.label, dbs)
    if(!meta.comment){
        meta.comment = ""
    }
    if(_is_local_server(client, meta.remote_url)){
        client.remote_auth(client.local_auth())
    }
    else {
        const jwtoken = await getTokenSilently()
        client.remote_auth({type: "jwt", key: jwtoken})
    }
    return client.clonedb(meta, newid).then(() => newid)
}


export const ShareLocal = async (meta, client, remoteClient, getTokenSilently) => {  
    let WOQL = TerminusClient.WOQL
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    //client.set_system_db()
    if(meta.schema) delete meta['schema']
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => { 
        let rem = resp.url || meta.remote_url
        let push_to = {
            remote: rem,
            remote_branch: "master",
            message: "publishing db content to hub via console",
        }       
        let q = WOQL.query()
        q.using("/" + client.organization() + "/" + client.db() + "/_meta")
            .add_triple("doc:Remote_origin", "type", "repo:Remote")
            .add_triple("doc:Remote_origin", "repo:repository_name", "origin")
            .add_triple("doc:Remote_origin", "repo:remote_url", push_to.remote)
        return client.query(q, "Setting remote for sharing database on Terminus Hub")
        .then(() => client.push(push_to))
    })
}




/*
* meta has : local_branch / remote_branch / url / commit 
*/
export const Push = async (meta, client, getTokenSilently) => {  
    let from_branch = meta.local_branch || 'master'
    let to_branch = meta.remote_branch || 'master'
    let commit = meta.commit || "Push Generated from TerminusDB Console"
    let push_to = {
        remote: meta.url,
        remote_branch: to_branch,
        message: commit,
    }
    let nClient = client.copy()
    nClient.checkout(from_branch)
    if(_is_local_server(client, meta.url)){
        nClient.remote_auth( nClient.local_auth() )
    }
    else {
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
    }
    return nClient.push(push_to)
}

/*
* meta has : local_branch / remote_branch / url / commit 
*/
export const Pull = async (meta, client, getTokenSilently) => {  
    let to_branch = meta.local_branch || 'master'
    let from_branch = meta.remote_branch || 'master'
    let commit = meta.commit || "Pull Generated from TerminusDB Console"
    let pull_from = {
        remote: meta.url,
        remote_branch: from_branch,
        message: commit,
    }
    let nClient = client.copy()
    nClient.checkout(to_branch)
    //create copy so we don't change internal state of woqlClient inadvertently
    if(_is_local_server(client, meta.url)){
        nClient.remote_auth(nClient.local_auth())
    }
    else {
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
    }
    return nClient.pull(pull_from)
}

function _new_local_id(starter, dbl){
    let ind = 0;
    let base = starter
    let ids = dbl.map((item) => item.id)
    while(ids.indexOf(base) != -1){
        base = starter + "_" + (++ind)
    }
    return base
}

function _new_local_label(starter, dbl){
    let ind = 0;
    let base = starter
    let labs = dbl.map((item) => item.label)
    while(labs.indexOf(base) != -1){
        base = starter + " (" + (++ind) + ")"
    }
    return base
}
