import React from 'react';
import ReactDOM from 'react-dom';
//import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';


const theme = {
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },/*
    error: {
      main: red.A400,
    },
    */
    background: {
      default: '#4468ca',
    },
    layout: {
      margin: 0,
      padding: 0,
      border: 0,
      fontSize: '100%',
      font: 'inherit',
      verticalAlign: 'baseline',
    }
  },
  typography: {

  },
  '@global': {
    'html, body, #root': {
      margin: 0,
      padding: 0,
      border: 0,
      fontSize: '100%',
      font: 'inherit',
      verticalAlign: 'baseline',
    }
  },
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    {/* <CssBaseline/> */}
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
