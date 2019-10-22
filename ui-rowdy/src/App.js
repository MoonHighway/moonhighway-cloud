import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "./App.css";

const QUERY = gql`
  query {
    totalPhotos
    allPhotos {
      id
      name
      description
      category
      url
      created
      postedBy {
        name
        email
      }
    }
    me {
      email
      name
    }
  }
`;

const MUTATION = gql`
  mutation post($input: PostPhotoForm!) {
    postPhoto(input: $input) {
      id
      name
      description
      category
      url
      created
    }
  }
`;

function App() {
  const { loading, data } = useQuery(QUERY);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [myToken, setToken] = useState(localStorage.getItem("token") || "");
  const [file, setFile] = useState(null);
  const [
    postPhoto,
    { loading: posting, data: postedPhoto, error }
  ] = useMutation(MUTATION, { refetchQueries: [{ query: QUERY }] });

  useEffect(() => {
    localStorage.setItem("token", myToken);
  }, [myToken]);

  const post = () => {
    postPhoto({
      variables: {
        input: { name, description, file }
      }
    });
    setName("");
    setDescription("");
  };

  if (loading)
    return (
      <div className="App">
        <h1>loading...</h1>
      </div>
    );

  if (posting)
    return (
      <div className="App">
        <h1>posting...</h1>
      </div>
    );

  return (
    <div className="App">
      <h2>{process.env.REACT_APP_GRAPHQL_PHOTOS}</h2>

      <input
        type="text"
        value={myToken}
        onChange={e => setToken(e.target.value)}
        placeholder="user token..."
      />
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="photo name..."
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="photo description..."
      />
      <input
        type="file"
        accept="image/jpeg"
        onChange={e => setFile(e.target.files[0])}
      />
      <button onClick={post}>POST</button>
      <pre>{JSON.stringify(error || postedPhoto || data, null, 2)}</pre>
      {data.allPhotos.map(photo => (
        <img key={photo.id} src={photo.url} alt={photo.title} />
      ))}
    </div>
  );
}

export default App;
