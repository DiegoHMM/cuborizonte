// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo.png';  

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
      <Navbar.Brand href="#home">
          <img
            src={logo}
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />{' '}
          BH DataCube
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Início</Nav.Link>
            <Nav.Link href="http://150.164.2.42:8080/products" target="_blank" rel="noopener noreferrer">Catálogo</Nav.Link>
            <Nav.Link href="https://github.com/DiegoHMM/cuborizonte" target="_blank" rel="noopener noreferrer">Sobre</Nav.Link>
            <Nav.Link href="https://www.linkedin.com/in/diego-matos-1758561a3/" target="_blank" rel="noopener noreferrer">Contato</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
