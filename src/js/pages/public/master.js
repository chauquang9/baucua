import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../../../sass/master.scss';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

class Master extends Component {
    render() {
      return (
          <div className='container'>
            <AppBar position="static">
              <Container maxWidth="xl">
                <div className='left-header'>
                  <Link to={'/'}>Home</Link>
                </div>
                <div className='right-header'>
                  <Link to={'/login'}>Login</Link>
                </div>
              </Container>
            </AppBar>
            <div className='container content'>
              {this.props.children}
            </div>
            <footer>

            </footer>
          </div>
      );
    }
}

export default Master;
