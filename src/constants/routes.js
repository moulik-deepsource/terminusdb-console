export const DB_ROUTE = '/db'
//Top-Level (Server) Routes
export const PROFILE_ROUTE = process.env.TERMINUS_BFF_URL + "hub/profile"
export const PAYMENT_ROUTE = process.env.TERMINUS_BFF_URL + "hub/payment"
export const SERVER_ROUTE = '/'
export const CREATE_DB_ROUTE = '/newdb'
export const CLONE_DB_ROUTE = '/clone'
export const HUB_RECORD_ROUTE = '/hub'
export const COLLABORATE_DB_ROUTE = '/clone/collaborators'

//Route To Terminus (Master) DB
export const TERMINUS_ROUTE = '/_system'

//Specific DB Route
export const SPECIFIC_DB_ROUTE = '/:aid/:dbid'
export const SPECIFIC_ORG_ROUTE = '/:aid'

//Routes within DB
export const DB_SCHEMA_ROUTE = '/schema'
export const DB_DOCUMENT_ROUTE = '/document'
export const DB_METRICS_ROUTE = '/metrics'
export const DB_QUERY_ROUTE = '/query'
export const SPECIFIC_DOC_ROUTE = '/:docid'


export const DB_SCHEMA_BUILD_ROUTE = '/model'

//sub routes of schema
export const SCHEMA_PROPERTIES_ROUTE = '/properties'
export const SCHEMA_OWL_ROUTE = '/owl'
export const SCHEMA_GRAPHS_ROUTE = '/graphs'
export const SCHEMA_PREFIXES_ROUTE = '/prefixes'
export const SCHEMA_CLASSES_ROUTE = '/classes'
export const SCHEMA_MODEL_ROUTE = '/'

//sub routes of db home
export const DB_MANAGE = '/manage'
export const DB_SYNCHRONISE = '/synchronize'
