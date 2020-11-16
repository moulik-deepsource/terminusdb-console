import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {Row, Col, Button} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {JSONEditor} from "./JSONEditor"
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks"
import {TOOLBAR_CSS, CANCEL_EDIT_BUTTON, EDIT_JSON_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER,
    SUBMIT_INPUT_LABEL} from "./constants.document"
import {ControlledTable} from '../Tables/ControlledTable'


export const DocumentView = ({docid, doctype, types, selectDocument, close}) => {
    const [edit, setEdit] = useState(false)
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [currentContext, setCurrentContext] = useState(false)
    const [jsonld, setJsonld] = useState()
    const [content, setContent] = useState()

    const { woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()
    let WOQL = TerminusClient.WOQL

    const docQuery = () => {
        return WOQL.read_object(docid, "v:Object")
    }

    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    useEffect(() => {
        if(qresult){
            let vb = (qresult && qresult.bindings && qresult.bindings[0] && qresult.bindings[0]['Object'] ? qresult.bindings[0]['Object'] : false)
            setJsonld(vb)
        }
    }, [qresult])

    useEffect(() => {
        if(jsonld){
            setCurrentContext(jsonld['@context'])
        }
        if(jsonld && !showContext){
            let nc = {}
            for(var k in jsonld){
                if(k != "@context") nc[k] = jsonld[k]
            }
            setContent(JSON.stringify(nc, false, 2))
        }
        else if(jsonld) {
            setContent(JSON.stringify(jsonld, false, 2))
        }
    }, [jsonld])

    useEffect(() => {
        updateQuery(docQuery())
    }, [docid])


    function setEditMode() {
        //setReport()
        setEdit(true)
    }

    function unsetEditMode() {
        //setReport()
        setEdit(false)
    }

    function getContents(cnt) {
        //if (report && report.status != TERMINUS_INFO) {
        //    setReport()
        //}
        setUpdatedJSON(cnt)
    }


    function cancel(){
        close()
    }

    function updateDocument(commit){
        commit = commit || "Document " + docid + " updated from console document view"
        let WOQL = TerminusClient.WOQL
        let json = parseOutput(updatedJSON)
        if(json){
            let q = WOQL.update_object(json)
            woqlClient.query(q, commit)
            .then(() => {
                updateQuery(docQuery())
                setContent("")
                setJsonld()
                unsetEditMode()
            })
        }
    }

    function parseOutput(json){
        try {
            let mj = JSON.parse(json)
            if(!showContext){
                mj['@context'] = currentContext
            }
            return mj
        }
        catch(e){
            return false
        }
    }

    function toggleEdit(){
        setEdit(!edit)
    }

    return <span>
        <ViewToolbar
            editmode={edit}
            docid={docid}
            toggle={toggleEdit}
            types={types}
            type={doctype}
            onCancel={cancel}
            onUpdate={updateDocument}
        />
        {content &&
            <JSONEditor
                dataProvider={content}
                edit={edit}
                onChange={getContents}
                prefixes={prefixes}
            />
        }
        {!edit && docid &&
            <DocumentLinks docid={docid} selectDocument={selectDocument} />
        }
    </span>
}

export const DocumentLinks = ({docid, types, type, onCancel,  selectDocument}) => {
    let WOQL = TerminusClient.WOQL
    let outs = WOQL.triple(docid, "v:Property", "v:Target").triple("v:Target", "type", "v:Type").sub("system:Document", "v:Type")
    let ins = WOQL.triple("v:Source", "v:Property", docid).triple("v:Source", "type", "v:Type").sub("system:Document", "v:Type")
    const chooseOut = function(cell){
        selectDocument(cell.row.original['Target'])
    }
    const chooseIn = function(cell){
        selectDocument(cell.row.original['Source'])
    }

    const outtab= TerminusClient.View.table();
    outtab.column("Target").click(chooseOut)
    const intab = TerminusClient.View.table();
    intab.column_order("Source", "Type", "Property")
    intab.column("Source").click(chooseIn)
    return (<Row>
        <Col>
            <div className="sub-headings latest-update-heading">Incoming Links</div>
            <ControlledTable query={ins} view={intab} limit={20}/>
        </Col>
        <Col>
            <div className="sub-headings latest-update-heading">Outgoing Links</div>
            <ControlledTable query={outs} view={outtab} limit={20}/>
        </Col>
    </Row>)
}

export const ViewToolbar = ({editmode, report, toggle, docid, types, type, onCancel,  onUpdate}) => {
    const {consoleTime} = DBContextObj()
    const [commit, setCommit] = useState()
    let msg = "Document " + docid
    function updateCommit(e) {
        if (e.target.value != commit) {
            setCommit(e.target.value)
        }
    }

    function getCreateForPage(p) {
        if (!consoleTime) {
            return [
                <Button key="json" className={TOOLBAR_CSS.editOWLButton} onClick={toggle}>
                    {EDIT_JSON_BUTTON}
                </Button>,
                <Button key="Close" className={TOOLBAR_CSS.editOWLButton} onClick={onCancel}>
                    Close
                </Button>
            ]
        }
        return null
    }

    function extractInput() {
        return onUpdate(commit)
    }

    function getSubmitButtons() {
        return [
            <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={toggle}>
                {CANCEL_EDIT_BUTTON}
            </Button>,
            <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput}>
                {UPDATE_JSON_BUTTON}
            </Button>,
        ]
    }

    let cr = getCreateForPage()
    let but = getSubmitButtons()

    function getEditModeBar() {
        return (
            <Row className={TOOLBAR_CSS.updateContainer}>
                <Col md={7} className={TOOLBAR_CSS.commitMsgCol}>
                    <input
                        className={TOOLBAR_CSS.commitInput}
                        onChange={updateCommit}
                        placeholder={COMMIT_PLACEHOLDER}
                    />
                </Col>
                <Col md={5} className={TOOLBAR_CSS.submitButtonsCol}>
                    {but}
                </Col>
            </Row>
        )
    }

    if (editmode) {
        let bar = getEditModeBar()
        if (report) {
            return (
                <>
                    {bar}
                    <Row className={TOOLBAR_CSS.updateReportContainer}>
                        <span className={TOOLBAR_CSS.messageContainer}>
                            <TerminusDBSpeaks report={report} />
                        </span>
                    </Row>
                </>
            )
        }
        return bar
    }

    return (<>
        <Row className={TOOLBAR_CSS.container}>
            <Col md={8} className="schema-toolbar-title">
                {msg}
            </Col>
            <Col md={4} className={TOOLBAR_CSS.createCol}>
                {cr}
            </Col>
        </Row>
        {report &&
            <Row className="generic-message-holder" style={{marginBottom: "1.4em"}}>
                 <TerminusDBSpeaks report={report} />
            </Row>
        }
    </>)
}


export const NewDocumentView = ({doctype, close, prefixes, types, selectDocument}) => {
    const [updatedJSON, setUpdatedJSON] = useState()
    const [showContext, setShowContext] = useState(false)
    const [content, setContent] = useState(getStarterContent(doctype))
    const { woqlClient} = WOQLClientObj()

    function getStarterContent(dt){
        return JSON.stringify({
            "@type": dt,
            "@id": "doc:NEW_ID",
            "rdfs:label": {"@value": "Document Name", "@type": "xsd:string"}
        }, false, 2)
    }

    function getContents(cnt) {
        setUpdatedJSON(cnt)
    }

    function parseOutput(json){
        try {
            let mj = JSON.parse(json)
            if(!mj['@context']) mj['@context'] = prefixes
            return mj
        }
        catch(e){
            return false
        }
    }


    function cancel(){
        close()
    }

    function createDocument(commit){
        let WOQL = TerminusClient.WOQL
        let json = parseOutput(updatedJSON)
        if(json){
            commit = commit || "New " + json['@type'] + " " + json['@id'] + " created from console document page"
            let q = WOQL.update_object(json)
            woqlClient.query(q, commit)
            .then(() => {
                if(selectDocument){
                    close()
                    selectDocument(json['@id'], json['@type'])
                }
            })
        }
    }

    return <span>
        <CreateToolbar
            types={types}
            type={doctype}
            onCancel={cancel}
            onCreate={createDocument}
        />
        {content &&
            <JSONEditor
                dataProvider={content}
                edit={true}
                onChange={getContents}
                prefixes={prefixes}
            />
        }
    </span>
}

export const CreateToolbar = ({types, type, onCancel, onCreate, report}) => {
    const [commit, setCommit] = useState()
    let msg = "Create New " + type + " Document"

    function updateCommit(e) {
        if (e.target.value != commit) {
            setCommit(e.target.value)
        }
    }

    function extractInput() {
        return onCreate(commit)
    }

    function getSubmitButtons() {
        return [
            <Button key="cancel" className={TOOLBAR_CSS.cancelOWLButton} onClick={onCancel}>
                {CANCEL_EDIT_BUTTON}
            </Button>,
            <Button key="sub" className={TOOLBAR_CSS.updateOWLButton} onClick={extractInput}>
                {UPDATE_JSON_BUTTON}
            </Button>,
        ]
    }

    let but = getSubmitButtons()

    function getEditModeBar() {
        return (
            <Row className={TOOLBAR_CSS.updateContainer}>
                <Col md={1} className={TOOLBAR_CSS.commitLabelCol}>
                    {SUBMIT_INPUT_LABEL}
                </Col>
                <Col md={8} className={TOOLBAR_CSS.commitMsgCol}>
                    <input
                        className={TOOLBAR_CSS.commitInput}
                        onChange={updateCommit}
                        placeholder={COMMIT_PLACEHOLDER}
                    />
                </Col>
                <Col md={3} className={TOOLBAR_CSS.submitButtonsCol}>
                    {but}
                </Col>
            </Row>
        )
    }

    let bar = getEditModeBar()
    if (report) {
        return (
            <>
                {bar}
                <Row className={TOOLBAR_CSS.updateReportContainer}>
                    <span className={TOOLBAR_CSS.messageContainer}>
                        <TerminusDBSpeaks report={report} />
                    </span>
                </Row>
            </>
        )
    }
    return bar
}
