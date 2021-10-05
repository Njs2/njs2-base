NJS2 config.json file
================================================


Keys | Values | Description
| :--- | :---: | :---:
MODE  | DEV/PROD | Deployemnet mode
SERVER_MODE  | LOCAL/LAMBDA | Server mode
PROJECT_TITLE | <string> | Project title
PROJECT_DESCRIPTION | <string> | Project description
PROJECT_VERSION | <string> | Project version
API_ENDPOINT | <string> | API endpoint
API_PORT | <number> | API port
SOCKET_SYSTEM_TYPE | SOCKET_IO/API_GATEWAY | Socket system type
SOCKET_PORT | <number> | Socket port
WSS_BASE_URL | <string> | WSS base url
LAMBDA_FUNCTION_NAME | <string> | Lambda function name for running room-init
SALT_ROUNDS | <number> | Salt rounds

## AUTH Config

Keys | Values | Description
| :--- | :---: | :---:
AUTH_MODE | JWT/JWT_SQL/JWT_REFRESH | Auth mode
JWT_SECRET | <string> | JWT secret
JWT_ID_KEY | <string> | JWT id key
DB_TABLE_NAME | <string> | DB table name
DB_ID_KEY | <string> | DB id key
DB_ACCESS_KEY | <string> | DB access key
DB_REFRESH_KEY | <string> | DB refresh key

## ENCRYPTION Config
Keys | Values | Description
| :--- | :---: | :---:
ENCRYPTION_MODE | optional/strict | Encryption mode
ENCRYPTION_KEY | <string> | Encryption key
ENCRYPTION_IV | <string> | Encryption iv

## BASE Config
Keys | Values | Description
| :--- | :---: | :---:
USE_LAMBDA_ROLE | YES/NO | Use lambda role - true will use the role and false will use the credentials from below keys
AWS_REGION | <string> | AWS region
AWS_ACCESS_KEY_ID | <string> | AWS access key id
AWS_SECRET_ACCESS_KEY | <string> | AWS secret access key
AWS_ROLE_ARN | <string> | AWS role arn

## SQL Config
Keys | Values | Description
| :--- | :---: | :---:
DATABASE_TYPE | mysql/postgresql | Database type
SQL_DB_HOST | <string> | SQL db host
SQL_DB_NAME | <string> | SQL db name
SQL_DB_USER | <string> | SQL db user
SQL_DB_PASSWORD | <string> | SQL db password
SQL_DB_PORT | <number> | SQL db port
