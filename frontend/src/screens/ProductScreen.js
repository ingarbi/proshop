import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, FormGroup, Image, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { createProductReview, listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Rating from '../components/Rating'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = (props) => {

  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector(state => state.userLogin);
  const { loading, error, product } = useSelector(state => state.productDetails);
  const { success: successProductReview, error: errorProductReview } = useSelector(state => state.productReviewCreate);

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted")
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(productId))
  }, [dispatch, productId, successProductReview])

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(productId, { rating, comment }))
  }

  return (
    <>
      <Link className="btn btn-outline-primary my-3" to="/">Go Back</Link>
      {
        loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Meta
              title={product.name}
              description={product.description}
            />
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={4}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {product.rating && (<Rating value={product.rating} text={`${product.numReviews} reviews`} />)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: ${product.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={2}>
                <Card>
                  <ListGroup>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                      </Row>
                    </ListGroup.Item>
                    {
                      product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty:</Col>
                            <Col>
                              <Form.Control
                                as='select'
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}>
                                {
                                  [...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                  ))
                                }
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )
                    }
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          disabled={product.countInStock === 0}
                          onClick={addToCartHandler}
                        >
                          Add To Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                  {
                    product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} text='' />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))
                  }
                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {
                      errorProductReview && <Message variant="danger">{errorProductReview}</Message>
                    }
                    {
                      userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <FormGroup controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control className="mb-3" as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                              <option value=''>Select...</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excellent</option>
                            </Form.Control>
                          </FormGroup>
                          <Form.Group controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              className="mb-3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}>
                            </Form.Control>
                          </Form.Group>
                          <Button type="submit" variant="primary">Submit</Button>
                        </Form>
                      ) : (
                        <Message>
                          Please <Link to='/login'> Sign in </Link> to write a review
                          {' '}
                        </Message>
                      )
                    }
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )
      }
    </>
  )
}

export default ProductScreen