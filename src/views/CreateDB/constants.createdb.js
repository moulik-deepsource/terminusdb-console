export const CREATE_BREADCRUMB = "Create"
export const COPY_BREADCRUMB = "Copy"
export const LOCAL_BREADCRUMB = "Local"
export const REMOTE_BREADCRUMB = "Remote"
export const CREATE_REMOTE = "New Database Details"
export const COPY_REMOTE = "Remote Copy Details"
export const CREATE_LOCAL = "New Database Details"
export const COPY_LOCAL = "Database Details"
export const LOCAL_OR_REMOTE = "Local or Remote"

export const OPTIONS_PANE_CSS = "col-md-12 justify-content-center"
export const OPTIONS_PANE_COL_CSS = "col-md-5"
export const CARD_CONTAINER_CSS = "square db-view-cards"


export const DBCARD_IMG_CSS = "newdb-card-img"
export const DBCARD_CONTAINER_CSS = "contentSquare"
export const DBCARD_TITLE_CSS = "mb-4 db-view-card-title"
export const DBCARD_BODY_CSS = "db-view-card-text"

import { TERMINUS_IMAGE_BASE } from "../../constants/images"

const createLocallyImg = TERMINUS_IMAGE_BASE  + "create-locally.png"
const createRemoteImg = TERMINUS_IMAGE_BASE  + "create-remote.png"
const createImg = TERMINUS_IMAGE_BASE + "create-db.png"
const copyImg = TERMINUS_IMAGE_BASE + "copy-db.png"
const copyLocallyImg = TERMINUS_IMAGE_BASE + "copy-locally.png"
const copyRemoteImg = TERMINUS_IMAGE_BASE + "copy-remote.png"

export const CREATE_DATABASE_LOCALLY = "Local Database"
export const CREATE_DATABASE_HUB = "TerminusHUB Database"

//const cloneImg = TERMINUS_IMAGE_BASE + "clone.png"
//const forkImg = TERMINUS_IMAGE_BASE + "fork.png"


export const CREATE_OR_COPY_CARD = {
    create:{
        id : 'create_db',
        title: 'Create New Database',
        text: 'Create a brand-new, empty database',
        image: createImg
    },
    copy:{
        id : 'copy_db',
        title: 'Copy Existing Database',
        text: 'Copy an existing database',
        image: copyImg
    }
}

export const CREATE_CARD = {
    local:{
        id : 'create_db_local',
        title: 'Create Local Database',
        text: 'The database will be created on this server and only locally accessible',
        image: createLocallyImg
    },
    remote:{
        id : 'create_db_remote',
        title: 'Create on TerminusDB.com',
        text: 'Host your database on terminusdb.com and share with collaborators through our secure sharing hub',
        image: createRemoteImg
    }
}

export const COPY_CARD = {
    local:{
        id: 'copy_db_local',
        title: 'Copy from this Server',
        text: 'Rapidly copy any database from this terminusdb server',
        image: copyLocallyImg
    },
    remote:{
        id: 'copy_db_remote',
        title: 'Copy from Remote Server',
        text: 'You can copy a database from any terminusdb server - you may have to provide security credentials',
        image: copyRemoteImg
    }
}

export const CREATE_DB_FORM = {
    createButtonText: "Create New Database",
    schemaGraphCommitMessage: "Main Schema Graph Created by console during DB create",
    schemaFailedMessage: " but failed to create main schema graph",
    noSchemaGraphMessage: " Database is schema free. If you want to enable quality control and advanced WOQL features, you must add a schema to this database",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database",
    createRemoteSuccessMessage: "Successfully Created Database",
    cloneRemoteFailureMessage: "Failed to create local clone after create",
    createRemoteFailureMessage: "Creation of database failed",
    buttons: {
        submitText: "Create New Database"
    }
}


export const SHARE_DB_FORM = {
    buttons: {
        submitText: "Share on Terminus Hub"
    }
}

export const DB_DETAILS_FORM = {
    fields: [
        {
            id: "dbid",
            value: "",
            label: 'Database ID',
            help: "The database ID forms part of the URL - spaces are not allowed",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter ID of new database"
            }
        },
        {
            id: "dbname",
            label: 'Database Name',
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter name of new database"
            }
        },
        {
            id: "sharing",
            label: 'Sharing',
            inputElement: {
                type: "select",
                options: [{value: "public", label: "Public"}, {value: "private", label: "Private"}, {value: "local", label: "Local Only - No Sharing"}],
                placeholder: "Public"
            }
        },
        {
            id: "iconUrl",
            label: 'Image Url to use for your database',
            inputElement: {
                type: "input",
                placeholder: "Enter URL of an image with valid format"
            }
        },
        {
            id: "icon",
            label: 'Pick an icon to use for your database',
            inputElement: {
                type: "icon",
                placeholder: "Select icon"
            }
        },
        {
            id: "description",
            label: 'Description',
            value: "",
            inputElement: {
                type: "textarea",
                placeholder: "Enter a short text describing the database, its scope and purpose",
            },
        },
    ],
}

export const DB_LOAD_DATA_FORM = {
    importButton: "Load Data"
}

export const DB_CSV_CREATE_FORM = {
    csvWrapperClassName: "advanced-settings-create-form",
    title: "Create Database From CSVs",
    createButton: "Create Database From CSVs",
    addButton: "Add More CSVs",
    csvError: "Error in inserting CSV",
    csvSuccess: "Successfully inserted CSV",
    defaultCommitMsg: "create database with CSVs"
}

export const DB_ADVANCED_FORM = {
    advancedWrapperClassName: "advanced-settings-create-form",
    advancedButtonClassName: "advanced-button btn-minor lead mt-4 btn",
    advancedSectionClassName: "advanced-section-create-form",
    hideAdvanced: "Hide Advanced Settings",
    showAdvanced: "Show Advanced Settings",
    fields: [
        {
            id: "schema",
            value: true,
            label: 'Create Schema Graph',
            helpCols: 9,
            help: "By default, databases are created with a schema graph for defining rules about stored data. If you want a schema-free database, uncheck the box here.",
            inputElement: {
                label: "Create schema graph main",
                type: "checkbox"
            },
        },
        {
            id: "data_url",
            label: 'Base URL for Data',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI",
            },
            help: "All data in TerminusDB is addressable by URL - you can choose the default URL prefix that you want to use for your internal data. This can be useful, for example, if you want to create a linked data application where all data is dereferencable",
        },
        {
            id: "schema_url",
            label: 'Base URL for schema elements',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI"
            },
            help: "Every TerminusDB database has a local namespace scm: available for defining local schema elements. You can choose the URL that you want this prefix to derefence to - by convention schema URLs end in a '#' character.",
        }
    ]
}

export const COPY_LOCAL_FORM = {
    detailsWrapperClassName: "copy-db-details-form",
    detailsHeaderClassName: "copy-db-details-header",
    detailsHeader: "",
    intro: "TerminusDB allows you to clone whole databases, to create a brand new database with all the structure, history and contents intact.  Cloned databases are entirely new databases, a complete, independent copy, but they remain linked to the original - you can push and pull updates to the original version",
    cloneFailureMessage: "Failed to clone ",
    cloneSuccessMessage: "Successfully cloned ",
    actionText: "Copy Local Database",
    fields: [
        {
            id: "dbsource",
            value: "",
            cowDuck: false,
            mandatory: true,
            label: 'Copy From',
            inputElement: {
                type: "select",
                placeholder: "Choose Database to Copy",
            }
        },
        {
            id: "newid",
            value: "",
            cowDuck: false,
            mandatory: true,
            label: 'New ID',
            inputElement: {
                type: "input",
                placeholder: "Choose a new ID for the copy",
            }
        }
    ],
    buttons: {
        submitText: "Create Copy"
    }
}

export const COPY_REMOTE_FORM = {
    detailsWrapperClassName: "copy-db-details-form",
    detailsHeaderClassName: "copy-db-details-header",
    detailsHeader: "",
    cloneFailureMessage: "Failed to clone ",
    cloneSuccessMessage: "Successfully cloned ",
    actionText: "Copy Remote Database",
    sample: {
        dbid: "sales-marketing-01",
        dbname: "Marketing Statistics (imported)",
        description: "The sales and marketing latest analysis outputs and source data. This constitutes the most up to date and reliable data we have as it feeds from the main PoS system and updates are published hourly. Please be careful before pushing to main as it is live!"
    },
    fields: [
        {
            id: "dbsource",
            value: "",
            mandatory: true,
            label: 'Copy From',
            inputElement: {
                type: "input",
                placeholder: "Enter URL of TerminusDB Database",
            },
            help: "The URL of the database is normally of the form: https://my.host.com/db/<organization_id>/<database_id>"
        }
    ],
    buttons: {
        submitText: "Copy Remote Database"
    }
}



export const COPY_DB_DETAILS_FORM = {
    fields: [
        {
            id: "copy",
            value: "TerminusDB",
            label: 'Copy From',
            mandatory: true,
            inputElement: {
                type: "select",
                disabled: false,
                options: [{value: "remote", label: "TerminusDB"}, {value: "local", label: "Local Database"}],
                placeholder: "TerminusDB"
            }
        },
        {
            id: "sourceId",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose local database to copy from",
                options: []
            },
            label: 'Source'
        },
        {
            id: "dbId",
            value: "",
            label: 'New Database Id',
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter new database Id to clone"
            }
        },
        /*{
            id: "sourceID",
            label: 'Source',
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose database URL from which you would want to copy from",
                options: []
            }
        }*/
    ],
    buttons: {
        submitText: "Copy Database"
    }
}

/*export const COPY_DB_DETAILS_FORM = {
    fields: [
        {
            id: "dbid",
            label: 'Original ID',
            inputElement: {
                type: "input",
                disabled: true
            }
        },
        {
            id: "dbname",
            label: 'New DB Name',
            inputElement: {
                type: "input",
            }
        },
        {
            id: "description",
            label: 'New DB Description',
            inputElement: {
                type: "textarea",
            }
        }
    ]
}
*/

export const CREATE_REMOTE_FORM = {
    createButtonText: "Create New Database",
    actionText: "Creating Databases on TerminusDB.com",
    shareText: "Share",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database: ",
    fields: [
        {
            id: "dbid",
            label: 'Database ID',
            inputElement: {
                type: "input",
                placeholder: "Enter New DB ID"
            },
            help: "Help on how to choose a good id"
        },
        {
            id: "dbname",
            label: 'Database Name',
            inputElement: {
                type: "input",
                placeholder: "Choose your database's name"
            }
        },
        {
            id: "topic",
            label: 'Topic',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Finance"}, {value: "z", label: "Science"}],
                placeholder: "Select a topic"
            },
        },
        {
            id: "region",
            label: 'Region',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Europe"}, {value: "z", label: "North America"}],
                placeholder: "Select region"
            },
        },
        {
            id: "audience",
            label: 'Audience',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "All Collaborators"}, {value: "z", label: "Team A"}],
                placeholder: "Choose Audience"
            },
        },
        {
            id: "description",
            label: 'Description',
            inputElement: {
                type: "textarea",
                placeholder: "Enter a description of the purpose of the database"
            },
            help: "Help on what goes here"

        },
        {
            id: "privacy",
            label: 'Privacy',
            inputElement: {
                type: "select",
                placeholder: "Public or Private",
                options: [{value: "public", label: "Public"}, {value: "private", label: "Private"}]
            }
        },
        {
            id: "license",
            label: 'License',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Creative Commons"}, {value: "z", label: "Open Source"}],
                placeholder: "Choose License"
            }
        },
        {
            id: "legalese",
            label: 'Agreement',
            inputElement: {
                type: "textarea",
                disabled: true,
            }
        },
        {
            id: "disclaimer",
            label: 'Terms and conditions',
            inputElement: {
                type: "checkbox",
                label: "I confirm I agree to the above conditions"
            }
        }
    ],
    sample: {
        legalese: "I agree to abide by the terms and conditions of the TerminusDB user agreement, and furthermore attest that I possess the legal right to share this data publicly",
    },
    buttons: {
        submitText: "Create Database"
    }
}

export const CREATE_LOCAL_INTRO = "Create a new database on your local TerminusDB server"
export const CREATE_REMOTE_INTRO = "You can choose to create a new database on your local server, or save it directly to your TerminusHub account for sharing with others"

export const CREATE_WITH_CSV="Create Database From CSVs"
export const ADD_MORE_CSV="Add More CSVs"
