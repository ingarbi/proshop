import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { Button, Table } from 'react-bootstrap'
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { listOrder } from '../actions/orderActions'

const OrderListScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, orders } = useSelector(state => state.orderList);
  const { userInfo } = useSelector(state => state.userLogin);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrder());
    } else {
      navigate('/login')
    }

  }, [dispatch, userInfo, navigate])

  return (
    <>
      {
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
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
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {
                        order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i className='fas fa-times' style={{ color: 'red' }}></i>
                        )
                      }
                    </td>
                    <td>
                      {
                        order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i className='fas fa-times' style={{ color: 'red' }}></i>
                        )
                      }
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant='primary' className='btn-sm'>
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        )
      }
    </>
  )
}

export default OrderListScreen
