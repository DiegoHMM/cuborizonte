// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo.png';  

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
      <Navbar.Brand href="#home">
          {/* Usando a logo */}
          <img
            src={logo}
            alt="Logo"
            width="40"   // Defina o tamanho da logo
            height="40"
            className="d-inline-block align-top"
          />{' '}
          BH DataCube
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Início</Nav.Link>
            <Nav.Link href="#about">Sobre</Nav.Link>
            <Nav.Link href="#contact">Contato</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
