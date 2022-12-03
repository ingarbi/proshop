import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../actions/userActions';
import SearchBox from './SearchBox';

const Header = () => {

  const dispatch = useDispatch();

  const { userInfo } = useSelector(state => state.userLogin);

  const logoutHandler = () => {
    dispatch(logout());
  }

  return (
    <header>
      <Navbar bg="primary" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>PROSHOP</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>
              {
                userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">

                    <LinkContainer to="/profile">
                      <NavDropdown.Item><i className='fas fa-user'></i> Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}><i className='fas fa-power-off'></i> Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className='fas fa-user'></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )
              }
              {
                userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Admin' id="adminmenu">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item><i className='fas fa-users'></i> Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item><i className='fas fa-bag-shopping'></i> Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item><i className='fas fa-basket-shopping'></i> Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </header>
  )
}

export default Header