import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from "react-router-dom"
import FormContainer from '../components/FormContainer';
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../actions/userActions.js";

const RegisterScreen = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch();

  const { loading, userInfo, error } = useSelector(state => state.userRegister);

  const redirect = location.search ? location.search.split("=")[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="name"
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}>
          </Form.Control>
        </Form.Group>
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
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder='Enter Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>Register</Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
