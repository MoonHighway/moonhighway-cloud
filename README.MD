# Sample Cloud

A sample cloud of examples built on Apollo Federation.

![MH Cloud Diagram](https://github.com/MoonHighway/moonhighway-cloud/blob/master/MH_Cloud_Diagram.png)

## Test Operations for the Hue Review

### Create an Account or Login

```graphql
# Create or Authorize a User

mutation authorize($email: String!, $password: String!) {
  authorize(email: $email, password: $password) {
    token
    user {
      name
    }
  }
}

mutation create($create: CreateUserForm!) {
  createAccount(input: $create) {
    token
    user {
      email
      name
    }
  }
}
```

#### Query Variables

```json
{
  "email": "biscuit@cats.com",
  "password": "badPassword",
  "create": {
    "email": "jungle@cats.com",
    "name": "Jungle Cat",
    "password": "badPassword"
  }
}
```

### Check you User Info

```graphql
query myInfo {
  me {
    email
    name
    postedColors {
      id
      title
      value
      reviews {
        advRating
        reviews {
          rating
          comment
        }
      }
    }
  }
}
```

#### Http Headers

```json
{
  "authorization": "Bearer <TOKEN>"
}
```

### Add Some Colors

```graphql
mutation add($title: String!, $value: String!) {
  addColor(title: $title, value: $value) {
    id
    title
    createdBy {
      email
      name
    }
  }
}
```

```json
{
  "title": "Grand",
  "value": "#00FF00"
}
```

### List Some Colors

```graphql
query allColors {
  allColors {
    id
    title
    value
    createdBy {
      name
    }
    reviews {
      advRating
      yourReview {
        rating
        comment
      }
      reviews {
        rating
        comment
      }
    }
  }
}
```

### Rate a Color a Color

```graphql
mutation rateColor($input: ReviewForm!) {
  addReview(input: $input) {
    id
    rating
    comment
    color {
      title
      value
    }
    user {
      email
      name
    }
  }
}
```

### Query Variables

```json
{
  "input": {
    "itemID": "O6z9tliSS",
    "rating": 2,
    "comment": "This color isn't beautiful"
  }
}
```

## Test Operations for Rowdy

```graphql

```

```json

```

### Create an Account or Login

```graphql

```

```json

```

### Check your User Info

```graphql

```

```json

```

### Add some photos

```graphql

```

```json

```

### List Some photos

```graphql

```

```json

```

### Review a Photo

```graphql

```

```json

```

### Check the Reviews

```graphql

```

```json

```
