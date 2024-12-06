import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBNavbarBrand,
  MDBCollapse,
  MDBNavbarToggler
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'; 
import '../../App.css'


export default function Navbar() {
  const [showNav, setShowNav] = useState(false);

  const handleToggle = () => {
    setShowNav(!showNav);
    console.log("Menu aberto:", !showNav); 
  };
  
  return (
    <MDBNavbar className='animated-background' expand='lg' light bgColor='light'>
      <MDBContainer className="navbar-left">
        <MDBNavbarBrand href='#'>
          <img
            src='/SH.png'
            height='30'
            alt='Brand Logo'
            loading='lazy'
            style={{ width: '90px', height: '90px', borderRadius: '5px' }}
          />
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
          aria-label='Toggle navigation'
          onClick={handleToggle}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse show={showNav} navbar style={{ display: showNav ? 'block' : 'none' }}>
          <MDBNavbarNav right className='mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link'>
                  Hospedagens
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <Link to='/hosting' className='nav-link text-dark text-decoration-none'> <MDBIcon icon='clipboard-list' className='me-2' /> Registro de hospedagens</Link>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <Link to='/AddHosting' className='nav-link text-dark text-decoration-none'><MDBIcon icon='plus-circle' className='me-2' />Adicionar hospedagem</Link>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link'>
                  Clientes
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <Link to='/listCustomer' className='nav-link text-dark text-decoration-none'><MDBIcon fas icon="users" className='me-2'  />Cadastrados</Link>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <Link to='/addCustomer' className='nav-link text-dark text-decoration-none'><MDBIcon fas icon="plus-circle" className='me-2'  />Adicionar cliente</Link>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link'>
                  Contabilidade
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <Link to='/expenses' className='nav-link text-dark text-decoration-none'><MDBIcon fas icon="exchange-alt" className='me-2' />Entrada e saída</Link>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <Link to='/addExpense'className='nav-link text-dark text-decoration-none'><MDBIcon fas icon="plus-circle"className='me-2'  />Adicionar despesa</Link>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' link href='/login'>
                Sair
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
