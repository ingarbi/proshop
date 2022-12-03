import React, { useEffect, useState } from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { getUserDetails, updateUserProfile } from "../actions/userActions.js";
import { listMyOrder } from '../actions/orderActions'

const ProfileScreen = () => {

  // const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch();

  const { loading, user, error } = useSelector(state => state.userDetails);
  const { loadingOrders, orders, errorOrders } = useSelector(state => state.orderListMy);

  const { userInfo } = useSelector(state => state.userLogin);
  const { success } = useSelector(state => state.userUpdateProfile);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrder())
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user])

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
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
          <Button type='submit' variant='primary'>Update</Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {
          loadingOrders ?
            <Loader /> : errorOrders ?
              <Message variant='danger'>{errorOrders}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAID</th>
                      <th>DELIVERED</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orders && orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.createdAt.substring(0, 10)}</td>
                          <td>{order.totalPrice}</td>
                          <td>
                            {order.isPaid ? (
                              order.paidAt.substring(0, 10)
                            ) : (
                              <i className='fas fa-times' style={{ color: 'red' }}></i>
                            )}
                          </td>
                          <td>
                            {order.isDelivered ? (
                              order.deliveredAt.substring(0, 10)
                            ) : (
                              <i className='fas fa-times' style={{ color: 'red' }}></i>
                            )}
                          </td>
                          <td>
                            <LinkContainer to={`/order/${order._id}`}>
                              <Button className='btn-sm' varinat='light'>Details</Button>
                            </LinkContainer>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              )
        }
      </Col>
    </Row>
  )
}

export default ProfileScreen;
