import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from "react-router-dom"
import FormContainer from '../components/FormContainer';
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { listProductDetails, updateProduct } from "../actions/productActions.js";
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = () => {

  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch();

  const { loading, error, product } = useSelector(state => state.productDetails);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(state => state.productUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }

  }, [dispatch, navigate, product, productId, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description
    }))
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
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
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder='Enter Price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='file'
                  onChange={uploadFileHandler}>
                </Form.Control>
                <Form.Control
                  type="text"
                  placeholder='Enter Image url'
                  value={image}
                  disabled
                  onChange={(e) => setImage(e.target.value)}>
                </Form.Control>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group className="mb-3" controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Enter Brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Enter Category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="countInStock">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder='Enter Count In Stock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Enter Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}>
                </Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>Update</Button>
            </Form>
          )
        }

      </FormContainer>
    </>
  )
}

export default ProductEditScreen
