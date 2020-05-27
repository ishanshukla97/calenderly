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

### Steps to start (in dev)

1) clone the repo
2) cd into it and run (you should have node and yarn installed)
```yarn```
If you dont have yarn installed run
```npm install```
This step install all the necessary packages to run the project
4) Run the server
with yarn
```yarn dev```
with npm
```npm run dev```
5) Server starts on localhost:4000
6) Enter localhost:4000 in your browser
7) This opens graphql playground where you can run different queries
8) Test register mutation. Type this in playground
```
mutation {
  register (registerCredentials: {
    email: "youremail@gmail.com",
    password: "MoreThan8CharsLong",
    name: "ishan"
  }) {
    __typename 
    ... on Error {
      message
    }
    ... on User {
      id
    }
  }
}
```
9) Test login mutation:
```
mutation {
  login (loginCredentials: {
    email: "youremail@gmail.com",
    password: "MoreThan8CharsLong"
  }) {
    __typename 
    ... on Error {
      message
    }
    ... on LoginToken {
      token
    }
  }
}
```
10) Test createEvent mutation: 
```
mutation {
  createEvent (eventInput: {
    name: "myEvent",
    startDate: "Sun May 24 2020",
    endDate: "Mon May 25 2020",
    description: "optional description"
  }) {
    __typename 
    ... on Error {
      message
    }
    ... on Event {
      name
    }
  }
}
```
11) Test listEvents query:
```
query {
  listEvents {
    name
    startDate
    endDate
    description
  }
}
```
### Languages and technologies
    Apollo, Graphql, Nodejs, Firebase and typescript
