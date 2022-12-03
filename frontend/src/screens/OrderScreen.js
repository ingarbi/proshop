import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PayPalButton } from "react-paypal-button-v2"
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deliverOrder, getOrderDetails, payOrder } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match }) => {

  const { id: orderId } = useParams();

  const [SDKReady, setSDKReady] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector(state => state.userLogin)
  const { order, loading, error } = useSelector(state => state.orderDetails)
  const { loading: loadingPay, success: successPay } = useSelector(state => state.orderPay)
  const { loading: loadingDeliver, success: successDeliver } = useSelector(state => state.orderDeliver)

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSDKReady(true);
      }
      document.body.appendChild(script);
    }

    if (!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSDKReady(true)
      }
    }

  }, [userInfo, navigate, dispatch, orderId, order, successPay, successDeliver])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ?
    <Loader />
    : error ?
      <Message variant='danger'>{error}</Message>
      : <>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>shipping</h2>
                <p>
                  <strong>Name: </strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
                </p>
                {
                  order.isDelivered ? (
                    <Message variant="success">Delivered on {order.deliveredAt}</Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )
                }
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Paymet Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {
                  order.isPaid ? (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )
                }
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message variant='info'>Order is empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {
                      order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid rounded />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </Col>
                            <Col md={4} className="justify-content-center">
                              {item.qty} x ${item.price} = ${item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))
                    }
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup varianr='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {
                  !order.isPaid && (
                    <ListGroup.Item className="d-grid">
                      {loadingPay && <Loader />}
                      {!SDKReady ? <Loader /> : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={successPaymentHandler} />
                      )}
                    </ListGroup.Item>
                  )
                }

                {
                  userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item className="d-grid">
                      {loadingDeliver && <Loader />}
                      <Button className="btn btn-primary" onClick={deliverHandler}>Mark As Delivered</Button>
                    </ListGroup.Item>
                  )
                }
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
}

export default OrderScreen
