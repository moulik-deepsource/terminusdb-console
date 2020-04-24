/**
 * The history navigator is a UI widget which allows a user to change their branch and time to view the database at
 * any specific time / branch
 */
import React, { useState, useEffect } from "react";
import { subDays, startOfToday, startOfTomorrow, addHours, startOfHour } from "date-fns";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { Container, Row, Col } from "reactstrap";
import BranchSelector from './BranchSelector'
import { DateTimeSlider } from './DateTimeSlider'
import CommitView from './CommitView'

import TerminusClient from '@terminusdb/terminus-client';


export const HistoryNavigator = (props) => {
    let nowts = props.now || parseFloat(startOfHour(addHours(new Date(), 1)).getTime()/1000)
    let timelinemax = props.end || parseFloat(startOfTomorrow().getTime()/1000)
    let timelinemin = props.start || parseFloat(subDays(startOfToday(), 7).getTime()/1000)
    const [branches, setBranches] = useState(props.branches);
    const [ref, setRef] = useState(props.ref);
    const [settingCommit, setSettingCommit] = useState(false);

    const [start, setStart] = useState(timelinemin);
    const [end, setEnd] = useState(nowts);
    const [last, setLast] = useState(nowts);
    const [current, setCurrent] = useState(nowts);
    const [currentCommit, setCommit] = useState();
    const [commitCount, setCommitCount] = useState(0);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    const [branch, setBranch] = useState(props.branch || dbClient.checkout());

    //retrieves details of the available branches
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let bchoices = []
            var res
            while(res = wr.next()){
               bchoices.push({value: res['BranchName']["@value"], label: res['BranchName']["@value"]})
            }
            bchoices.push({value: "test", label: "test"})
            setBranches(bchoices) 
        })    
    }, []);

    //retrieves details of the branch, only when the branch is changed
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchLimits(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let res = wr.first()
            let last = res['Last']['@value']
            let first = res['First']['@value'] || last
            let cc = ((res['Path'] && Array.isArray(res['Path'])) ? res['Path'].length : 1)
            setStart(parseFloat(first))
            setLast(parseFloat(last))
            setCommitCount(cc)
            if(!ref){
                setRef(res['HeadID']["@value"])
            }
        })
    }, [branch]);

    //retrieves details of the commit with id ref 
    useEffect(() => {
        if(ref){
            const q2 = TerminusClient.WOQL.lib().loadCommitDetails(dbClient, ref)
            dbClient.query(q2).then((cresults) => {
                let cwr = new TerminusClient.WOQLResult(cresults, q2)
                let cres = cwr.first()
                let commie = extractCommitData(cres)
                commie.id = ref
                if(settingCommit){
                    setCurrent(commie.time)
                    setSettingCommit(false)
                    if(props.onHeadChange) props.onHeadChange()
                }
                setCommit(commie)
            })
        }
    }, [ref]);

    //retrieves details of the previous commit, only when user changes time
    function userChangesTime(ts){
        if(ts && (Math.floor(current) != Math.floor(ts))){
            setCurrent(ts)
            const fts = String(ts)
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(dbClient, fts)
            dbClient.query(q3).then((lresults) => {
                let lwr = new TerminusClient.WOQLResult(lresults, q3)
                let lres = lwr.first()
                if(lres){
                    let commie = extractCommitData(lres)
                    if(commie.child){
                        dbClient.ref(commie.id)
                    }
                    else dbClient.ref(false)
                    if(commie.id != currentCommit.id){
                         setCommit(commie)
                         if(props.onHeadChange) props.onHeadChange()
                    } 
                }
            })
        }
    }

    //change the commit and change the time on the timeline to the commit time
    function userChangesCommit(cid){
        setSettingCommit(true);
        setRef(cid)
    }

    function extractCommitData(res){
        let commie = {}
        if(res['CommitID'] && res['CommitID']['@value']) commie.id = res['CommitID']["@value"]
        if(res['Time'] && res['Time']["@value"]) commie.time = parseFloat(res['Time']["@value"])
        if(res['Author'] && res['Author']["@value"]) commie.author = res['Author']["@value"]
        if(res['Message'] && res['Message']["@value"]) commie.message = res['Message']["@value"]
        if(res['Parent'] && res['Parent']["@value"])commie.parent = res['Parent']["@value"]
        if(res['Child'] && res['Child']["@value"])commie.child = res['Child']["@value"]
        return commie
    }

    function changeBranch(bid){
        setBranch(bid)
        dbClient.ref(false)
        dbClient.checkout(bid)
        if(props.onHeadChange) props.onHeadChange()
    }

    let cct = (currentCommit ? currentCommit.time : nowts)
    return (
        <Container>
            <span className = "d-fl mb-12">
                <Col md={8} className="mb-8">
                    <DateTimeSlider start={start}
                        onChange={userChangesTime}
                        end={end}
                        current={current}
                        updated={cct} />
                </Col>
                <Col md={1} className="mb-1"/>
                <Col md={3} className="mb-3">
                    <BranchSelector count={commitCount} created={start} branch={branch} branches={branches} onChange={changeBranch}/>
                </Col>             
            </span>
            <span className = "d-fl mb-12">
                <Col md={12} className="mb-12">
                    <CommitView commit={currentCommit} setRef={userChangesCommit} />
                </Col>
            </span>
        </Container>
    )
}