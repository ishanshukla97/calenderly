# Calenderly

A simple graphql server with JWT authentication and event creation. Made for a code assessment task.

### endpoints
register, login and createEvent

### To run in dev environment
    Place your firebase credentials in src/keys/dev/index.ts
    Also place a secret for JWT
    eg: 
    ```
    export const Secret = 'Your jwt secret';
    export const serviceAccountKey = {
        "type": "service_account",
        "project_id": ...,
        "private_key_id": ...,
        "private_key": ...
        ...
    }
    
    ```

### To run in prod environment
    Make sure you provide the above variables as environment variables

### Languages and technologies
    Apollo, Graphql, Nodejs, Firebase and typescript