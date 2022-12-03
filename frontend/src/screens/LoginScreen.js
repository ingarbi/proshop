import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from "react-router-dom"
import FormContainer from '../components/FormContainer';
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../actions/userActions.js";

const LoginScreen = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  const redirect = location.search ? `/${location.search.split("=")[1]}` : '/';

  useEffect(() => {

    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>Sign In</Button>
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/redirect'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
