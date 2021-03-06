import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {COPY_REMOTE_FORM, COPY_DB_DETAILS_FORM, COPY_DB_DETAILS} from '../CreateDB/constants.createdb'
import {goDBHome} from '../../components/Router/ConsoleRouter'
import {APIUpdateReport} from '../../components/Reports/APIUpdateReport'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'

export const CloneDatabase = () => {
    const { woqlClient, reconnectToServer, remoteClient } = WOQLClientObj()
    const [updateLoading, setUpdateLoading] = useState(false)
    const [report, setReport] = useState()
    const [sourceURL, setSourceURL] = useState()
    const { getTokenSilently } = useAuth0();

    let update_start = Date.now()

    let basicInfo = {}
    //let fields = COPY_REMOTE_FORM.fields
    let fields = COPY_DB_DETAILS_FORM.fields

    //build values and options from database options
    COPY_REMOTE_FORM.fields.map((item, index) => {
        basicInfo[item.id] = item.value || ''
    })

    function onChangeBasics(field_id, value) {
        if (field_id == 'dbsource') {
            setSourceURL(value)
        }
    }

    let user = woqlClient.user()

    //we should really do some behind the scenes checking of auth situation before actually pulling the trigger, but oh well....
    async function onClone(details) {
        if (!sourceURL) return
        update_start = Date.now()
        setUpdateLoading(true)
        let newid = sourceURL.substring(sourceURL.lastIndexOf('/') + 1)
        let src = {
            remote_url: sourceURL,
            label: details.name || newid,
        }
        if (details.description) src.comment = details.description
        const jwtoken = await getTokenSilently()
        remoteClient.localAuth({type: "jwt", key: jwtoken})

        return remoteClient
            .clonedb(src, newid)
            .then(() => {
                let message = `${COPY_REMOTE_FORM.cloneSuccessMessage} (id: ${sourceURL})`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterCreate(newid, rep)
            })
            .catch((err) => {
                let message = `${COPY_REMOTE_FORM.cloneFailureMessage} (id: ${sourceURL}) `
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, rep) {
        reconnectToServer().then((result) => {
            goDBHome(id, woqlClient.user_organization(), rep)
        })
    }


    function onUpdate(key, val) {
        values[key] = val
        setValues(values)
    }


    //let buttons = user ? COPY_DB_DETAILS_FORM.buttons.submitText : true
    //let buttons = COPY_REMOTE_FORM.buttons
    let buttons = COPY_DB_DETAILS_FORM.buttons

    let copy_fields = COPY_DB_DETAILS_FORM.fields.map((item) => {
        if (item.id == 'sourceId'){
            let dbs = woqlClient.databases();
            let opts = []
            dbs.map((item) => {
                opts.push({value: item.id, label: item.label})
            })
            item.inputElement.options = opts
        }
        return item
    })

    let ics = {}
    copy_fields.map((item) => {
        ics[item.id] = item.value || ''
    })
    const [values, setValues] = useState(ics)

    return (
        <>
            {(updateLoading) && <Loading type={TERMINUS_COMPONENT} />}
            {report && report.error && (
                <APIUpdateReport
                    status={report.status}
                    error={report.error}
                    message={report.message}
                    time={report.time}
                />
            )}

            <TCForm
                onSubmit={onClone}
                layout={[2, 1]}
                onChange={onUpdate}
                fields={copy_fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
