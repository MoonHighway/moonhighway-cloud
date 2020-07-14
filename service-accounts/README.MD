# Accounts Service

A service to manager users and accounts across multiple applications.

## Test Queries

```graphql
query me {
  me {
    name
    email
    created
  }
}

mutation createAcount($input: CreateUserForm!) {
  createAccount(input: $input) {
    token
    user {
      name
    }
  }
}

mutation authorize($email: String!, $password: String!) {
  authorize(email: $email, password: $password) {
    token
    user {
      name
    }
  }
}
```

### Sample Query Variables

```json
{
  "email": "tahoe@fakesite.com",
  "password": "badPassword",
  "input": {
    "name": "Eve Porcello",
    "email": "chicago@fakesite.com",
    "password": "badPassword"
  }
}
```
