/**
 * Controller application for synchronize page
 */
import React, {useState, useEffect} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {DBContextObj} from '../../components/Query/DBContext'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import {PageView} from '../Templates/PageView'
import {DBRemotes} from "./DBRemotes"
import {DBRemoteSummary} from "./DBRemoteSummary"
import {RefreshDatabaseRecord, removeRemote, addRemote, isLocalURL, isHubURL} from "../../components/Query/CollaborateAPI"
import {AddRemote} from "./AddRemote"
import {CreateDatabase} from "../CreateDB/CreateDatabase"

export const Synchronize = () => {
    const {repos, branches, updateRepos, branch} = DBContextObj()
    const { getTokenSilently, loginWithRedirect } = useAuth0();

    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [operation, setOperation] = useState()
    const [isRemote, setIsRemote] = useState()
    const {woqlClient, bffClient, refreshDBRecord } = WOQLClientObj()

    let update_start = Date.now()

   
    function showAddRemote(){
        setOperation("create")
    }

    function showShareDB(){
        setOperation("share")
    }

    function unsetOperation(){
        setOperation(false)
    }

    function doDelete(remote){
        setLoading(true)
        update_start = Date.now()
        removeRemote(remote.title, woqlClient, getTokenSilently)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully removed remote ${remote.title}`,
                time: Date.now() - update_start
            }
            unsetOperation()
            updateRepos()
            setReport(newrep)
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to add remote ${remote.title}`,
                time: Date.now() - update_start,
                error: e
            }
            unsetOperation()
            setReport(newrep)
            updateRepos()
        })
        .finally(() => setLoading(false))
    }

    async function onRefresh(remote){
        let bits = remote.url.split("/")
        let meta = {id: bits[bits.length-1], organization: bits[bits.length-2]}
        if(isHubURL(remote.url)){
            RefreshDatabaseRecord(meta, bffClient, getTokenSilently).then((data) => {
                console.log("got back data", data)
                alert("got it")
            })
            .catch((e) => console.log("got error", e))
        }
        else if(isLocalURL(remote.url, woqlClient)){
            refreshDBRecord(bits.id, bits.organization).then((data) => {
                console.log("got local back", data)
                alert("got it gazooks")
            })
        }
    }

    async function doAddRemote(id, url){
        setLoading(true)
        update_start = Date.now()
        addRemote(id, url, woqlClient, getTokenSilently)
        .then((data) => {
            let newrep = {
                status: TERMINUS_SUCCESS,
                message: `Successfully added remote ${id} and fetched from remote ${url}`,
                time: Date.now() - update_start
            }
            unsetOperation()
            updateRepos()
            setReport(newrep)
        })
        .catch((e) => {
            let newrep = {
                status: TERMINUS_ERROR,
                message: `Failed to add remote ${id} from URL ${url}`,
                time: Date.now() - update_start,
                error: e
            }
            unsetOperation()
            setReport(newrep)
            updateRepos()
        })
        .finally(() => setLoading(false))
    }
    if(!repos || !branches) return null
    let meta = woqlClient.get_database()
    let user = woqlClient.user()   
    return (
        <PageView>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {!loading && !operation &&                 
                <DBRemoteSummary 
                    repos={repos} 
                    woqlClient={woqlClient} 
                    onCreate={showAddRemote} 
                    onShare={showShareDB} 
                    onLogin={loginWithRedirect} 
                />
            }
            {report && 
                <span className="database-summary-listing">
                    <TerminusDBSpeaks report={report} />
                </span>
            }
            {!loading && !operation &&                 
                <DBRemotes 
                    woqlClient={woqlClient}
                    meta={meta}
                    user={user}
                    repos={repos} 
                    branch={branch}                     
                    onLogin={loginWithRedirect} 
                    onDelete={doDelete}
                    onRefresh={onRefresh}
                    getTokenSilently={getTokenSilently}
                />
            }
            {(operation && operation == "share") && 
                <CreateDatabase from_local={meta} />
            }
            {(operation && operation == "create") && 
               <AddRemote 
                    onCreate={doAddRemote} 
                    onCancel={unsetOperation} 
                    repos={repos} 
                />
            }
        </PageView>
    )
}


