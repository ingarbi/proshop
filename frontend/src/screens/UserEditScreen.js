import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from "react-router-dom"
import FormContainer from '../components/FormContainer';
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { getUserDetails, updateUser } from "../actions/userActions.js";
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = () => {

  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch();

  const { loading, user, error } = useSelector(state => state.userDetails);
  const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = useSelector(state => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }

  }, [dispatch, navigate, user, userId, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({
      _id: userId,
      name,
      email,
      isAdmin
    }))
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {
          loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>error</Message>
          ) : (
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
              <Form.Group className="mb-3" controlId="isadmin">
                <Form.Check
                  type="checkbox"
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}>
                </Form.Check>
              </Form.Group>
              <Button type='submit' variant='primary'>Update</Button>
            </Form>
          )
        }

      </FormContainer>
    </>
  )
}

export default UserEditScreen
