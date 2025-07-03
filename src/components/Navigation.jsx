import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useTranslation } from 'react-i18next'
import { useTTS } from '../contexts/TTSContext'

const Navigation = () => {
  const { t } = useTranslation()
  const { speak } = useTTS()

  const handleNavClick = (text) => {
    speak(text)
  }

  return (
    <Navbar expand="lg" className="navbar-dark">
      <Container fluid>
        <Navbar.Brand 
          onClick={() => speak('Caterpillar Operator Assistant')}
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-gear-fill me-2"></i>
          CAT Assistant
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link onClick={() => handleNavClick(t('navigation.dashboard'))}>
                <i className="bi bi-speedometer2 me-2"></i>
                {t('navigation.dashboard')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/inspection">
              <Nav.Link onClick={() => handleNavClick(t('navigation.inspection'))}>
                <i className="bi bi-clipboard-check me-2"></i>
                {t('navigation.inspection')}
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/jobs">
              <Nav.Link onClick={() => handleNavClick(t('navigation.jobs'))}>
                <i className="bi bi-list-task me-2"></i>
                {t('navigation.jobs')}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation