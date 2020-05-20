import React from "react";
import { DialogueBox } from "./DialogueBox"
import { CONNECTION_FAILURE, CONNECTION_FAILURE_ADVICE } from "./constants"
import { Container} from "reactstrap";
import {WOQLClientObj} from "../../init/woql-client-instance";

const ConnectionErrorPage = () => {

	const { setKey } = WOQLClientObj();

	const setKeyUpdate =(evt) =>{
		evt.preventDefault();
		setKey(undefined);
	}

    return (
    	<DialogueBox message = { CONNECTION_FAILURE_ADVICE} header = {CONNECTION_FAILURE}>
    		<button className="btn btn-lg btn-block btn btn-primary" onClick={setKeyUpdate}>Enter your passwod</button>
    	</DialogueBox>
    )
}
export default ConnectionErrorPage;
