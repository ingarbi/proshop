import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {

  const [keyWord, setKeyWord] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyWord.trim()) {
      navigate(`/search/${keyWord}`)
    } else {
      navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className="d-flex mt-md-0 mt-sm-2">
      <Form.Control
        type="text"
        name="q"
        placeholder='Search Product...'
        className="me-2"
        onChange={(e) => setKeyWord(e.target.value)}>
      </Form.Control>
      <Button type="submit" variant="outline-light">Search</Button>
    </Form>
  )
}

export default SearchBox
