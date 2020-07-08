import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Avatar, Button, CssBaseline, Box,
} from '@material-ui/core';
import * as yup from 'yup';
import { PropTypes } from 'prop-types';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { validKey } from '../Trainee';
import Fields from '../mainComponent';
import { loginIcons } from '../../config/constant';
import callApi from '../../libs/utils/api';
import { MyContext } from '../../contexts';


const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

const useStyles = (theme) => ({
  button: {
    marginTop: theme.spacing(16),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    // marginTop: '40%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  space: {
    marginTop: '6%',
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      fetchData: '',
      hasError: false,
      error: {
        email: '',
        password: '',
      },
      touched: {
        email: false,
        password: false,
      },
    };
  }

  fetchData = (value) => {
    const { email, password } = this.state;

    this.setState({ loading: true }, async () => {
      const response = await callApi('post', 'user/login', {
        email,
        password,
      });
      this.setState({ loading: false }, () => {
        if (response.status === 'ok') {
          localStorage.setItem('Token', response.data);
          const { history } = this.props;
          history.push('/trainee');
        } else {
          value.openSnackBar(response.message, response.status);
        }
      });
    });
  }

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value }); this.setState({
      [prop]: event.target.value,
    }, () => {
      this.getError(prop);
    });
  };


  hasErrors = () => {
    const { hasError } = this.state;
    schema
      .isValid(this.state)
      .then((valid) => {
        if (!valid !== hasError) {
          this.setState({ hasError: !valid });
        }
      });
  }


  isTouched = (field) => {
    const { touched } = this.state;
    this.setState({
      touched: {
        ...touched,
        [field]: true,
      },
    }, () => {
      this.getError(field);
    });
  }

  getError = (field) => {
    const { error, touched } = this.state;
    if (touched[field]) {
      schema.validateAt(field, this.state).then(() => {
        if (error[field] !== '') {
          this.setState({
            error: {
              ...error,
              [field]: '',
            },
          });
        }
      }).catch((err) => {
        if (err.message !== error[field]) {
          this.setState({
            error: {
              ...error,
              [field]: err.message,
            },
          });
        }
      });
    }
    return error[field];
  }

  render() {
    const {
      loading,
    } = this.state;
    this.hasErrors();

    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box mx="auto" bgcolor="background.paper" p={2} className={classes.box} boxShadow={3} marginTop="30%">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4">
              Log in
            </Typography>
            <form className={classes.form} noValidate>
              {
                Object.keys(loginIcons).map((key, i) => (
                  <Fields
                    // eslint-disable-next-line react/no-array-index-key
                    key={`key${i}`}
                    helperText={this.getError(key)}
                    label={key}
                    error={!!this.getError(key)}
                    onChange={this.handleChange(key)}
                    onBlur={() => this.isTouched(key)}
                    icons={loginIcons[key]}
                    type={validKey(key)}
                    className={classes.space}
                  />

                ))
              }
              <MyContext.Consumer>
                {(value) => (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading || this.hasErrors()}
                    onClick={() => { this.fetchData(value); }}
                  >
                    {loading && (
                      <CircularProgress color="secondary" />
                    )}
                    {loading && <span> Signing in...</span>}
                    {!loading && <span>Sign in</span>}
                  </Button>
                )}
              </MyContext.Consumer>
            </form>
          </div>
        </Box>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Login);

Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,

};
