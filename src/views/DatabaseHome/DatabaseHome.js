import React, { useState, useEffect } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import {databaseHomeLabels} from '../../variables/content';
import NavBar from '../../components/NavBar';
import RenderTable from "../../components/RenderTable";
import { DETAILS_TAB, COLLABORATE_TAB, MANAGE_TAB } from "../../labels/tabLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { getCurrentDBName, getCurrentDBID, isObject } from "../../utils/helperFunctions"
import { GET_COMMIT_HEAD } from "../../labels/queryLabels"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Details from './DatabaseDetails'
import Collaborate from './Collaborate'
import ManageDatabase from './ManageDatabase'
import { getQuery } from "../../utils/queryList"
import { hooks } from "../../hooks"
import { getCommitControl } from "../../utils/stateChange"
import { nextCommit, previousCommit } from "../../variables/formLabels"
import { HistoryNavigator } from '../../components/HistoryNavigator/HistoryNavigator'

import * as tag from "../../labels/tags"

const DatabaseHome = (props) => {
    const { loading, user, isAuthenticated } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);
	const [created, setCreated]  =  useState(false);
	const [commitInfo, setCommitInfo] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
    	if(dbClient){
       		if(props.db && (props.db != dbClient.db())) dbClient.db(props.db) 
        	if(props.account && (props.account != dbClient.account())) dbClient.account(props.account)
        }
    }, [props.db, props.account,dbClient])

	if (loading) return <Loading />;

    /*if(props.db){
        dbClient.db(props.db)
        if(props.account) dbClient.account(props.account)
    }*/

    return (
    	<Container fluid className="h-100 pl-0 pr-0">
            <NavBar/>
    	    <Container className="flex-grow-1">
			 	<hr className = "my-space-50" />
    	  	    <legend>{getCurrentDBName(dbClient)}</legend>
				<hr className = "my-space-50"/>
					<HistoryNavigator setCreated = {setCreated}
						setCommitInfo = {setCommitInfo}/>
				<hr className = "my-space-5"/>

				 {isAuthenticated && <Tabs>
				    <Tab label = {DETAILS_TAB}>
					    <hr className = "my-space-15"/>
						<Details created = { created }
							commitInfo = { commitInfo }/>
				    </Tab>
				    <Tab label = {COLLABORATE_TAB}>
						<hr className = "my-space-15"/>
						<Collaborate/>
					</Tab>
					<Tab label = {MANAGE_TAB}>
						<hr className = "my-space-15"/>
						<ManageDatabase/>
					</Tab>
				</Tabs>}

				{(!isAuthenticated) && <Tabs>
				   <Tab label = {DETAILS_TAB}>
					   <hr className = "my-space-15"/>
					   <Details created = { created }
						   commitInfo = { commitInfo }/>
				   </Tab>
			   </Tabs>}

    	    </Container>
    	</Container>
    )
}

export default DatabaseHome;
