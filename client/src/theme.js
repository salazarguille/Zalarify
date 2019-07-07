import { red } from '@material-ui/core/colors';
// import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = {
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
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
};

export default theme;
