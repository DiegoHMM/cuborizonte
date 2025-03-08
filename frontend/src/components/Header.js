// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo.png';  


const baseApiURL = process.env.REACT_APP_API_BASE_URL || '/api/'; 

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
            <Nav.Link href={`${baseApiURL}/docs`} target="_blank" rel="noopener noreferrer">Doc</Nav.Link>
            <Nav.Link href="https://github.com/DiegoHMM/cuborizonte" target="_blank" rel="noopener noreferrer">Sobre</Nav.Link>
            <Nav.Link href="https://www.linkedin.com/in/diego-matos-1758561a3/" target="_blank" rel="noopener noreferrer">Contato</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
