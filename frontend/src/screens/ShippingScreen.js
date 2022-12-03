import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer'

const ShippingScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector(state => state.cart);

  const [address, setAddress] = useState(shippingAddress ? shippingAddress.address : '');
  const [city, setCity] = useState(shippingAddress ? shippingAddress.city : '');
  const [postalCode, setPostalCode] = useState(shippingAddress ? shippingAddress.postalCode : '');
  const [country, setCountry] = useState(shippingAddress ? shippingAddress.country : '');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder='Enter Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder='Enter City'
            value={city}
            onChange={(e) => setCity(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder='Enter Postal Code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder='Enter Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
