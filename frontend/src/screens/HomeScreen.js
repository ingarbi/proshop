import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from "react-bootstrap"
import Product from '../components/Product'
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';

const HomeScreen = () => {

  const { keyword } = useParams();
  const { pageNumber } = useParams() || 1;
  const dispatch = useDispatch();

  const { loading, error, products, pages, page } = useSelector(state => state.productList);

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      {!keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-light">Go Back</Link>}
      <h1>Latest Products</h1>
      {
        loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {
                products.map(product => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </>
        )
      }

    </>
  )
}

export default HomeScreen