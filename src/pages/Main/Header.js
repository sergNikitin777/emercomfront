import React from 'react';
import { connect } from 'react-redux';
import { toggleMobileNavVisibility } from '../../reducers/Layout';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl } from 'react-bootstrap';

const Header = ({
  showMobileMenu,
  toggleMobileNavVisibility
}) => (
    <Navbar fluid={true}>
      <Navbar.Header>
        <button type="button" className="navbar-toggle" data-toggle="collapse" onClick={toggleMobileNavVisibility}>
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </Navbar.Header>

      <Navbar.Collapse>
	  {/*		
        <Nav>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">1</Badge></NavLink>
          </NavItem>
        </Nav>
		<div className="separator"></div>
		*/}	
		
		
        <Navbar.Form pullRight>
          <FormGroup>
            <span className="input-group-addon"><i className="fa fa-search"></i></span>
            <FormControl type="text" placeholder="Найти" />
          </FormGroup>
        </Navbar.Form>
		
        <Nav pullRight>	 	
          <NavItem><i className="spinnable fa fa-cog"></i></NavItem>
		  <NavItem><i className="spinnable fa fa-plus"></i></NavItem>
		  <NavItem><i className="spinnable fa fa-desktop"></i></NavItem>
          <NavDropdown title={<i className="fa fa-globe" />} id="basic-nav-dropdown">
            <MenuItem>Действие 1</MenuItem>
            <MenuItem>Действие 2</MenuItem>
            <MenuItem>Действие 3</MenuItem>
            <MenuItem divider />
            <MenuItem>Действие 4</MenuItem>
          </NavDropdown>		  
		  <NavItem><i className="spinnable fa fa-cog"></i></NavItem>
		  <NavItem><i className="spinnable fa fa-calendar"></i></NavItem>
		  <NavItem><i className="spinnable fa fa-bell"></i></NavItem>	
		  
          <NavItem>Профиль</NavItem>
          <NavDropdown title="Действия" id="right-nav-bar">
            <MenuItem>Действие 1</MenuItem>
            <MenuItem>Действие 2</MenuItem>
            <MenuItem>Действие 3</MenuItem>
            <MenuItem divider />
            <MenuItem>Действие 4</MenuItem>
          </NavDropdown>
          <NavItem>Выйти</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

const mapDispatchToProp = dispatch => ({
  toggleMobileNavVisibility: () => dispatch(toggleMobileNavVisibility())
});

export default connect(null, mapDispatchToProp)(Header);