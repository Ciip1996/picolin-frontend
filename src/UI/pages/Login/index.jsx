import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import API from 'services/API';
import { useStyles } from './styles';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const url = `/iniciarSesion`; // TODO: change url later
  const history = useHistory();

  const login = async () => {
    try {
      const params = {
        usuario: username,
        password
      };
      const response = await API.post(`${url}`, params);
      if (response?.status === 200) {
        // set token local storage
        console.log(response.data);
        const access = {
          token: response.data.token,
          type: 'bearer'
        };
        localStorage.setItem('access', JSON.stringify(access));
        localStorage.getItem('access');
        history.push('/home'); // TODO: change url later
      }
    } catch (error) {
      // handle error
      debugger;
      console.log('error', error);
    }
  };

  const onChangePassword = e => setPassword(e?.target?.value);
  const onChangeUserName = e => setUsername(e?.target?.value);

  const onSubmit = e => {
    e.preventDefault();
    login();
  };

  const classes = useStyles();
  return (
    <div className={classes.fondo}>
      <Box display="flex" justifyContent="center" p={1}>
        <Box className={classes.box}>
          <form onSubmit={onSubmit}>
            <center>
              <h1 className={classes.h1}>INICIAR SESIÓN</h1>
              <TextField
                onChange={onChangeUserName}
                value={username}
                className={classes.txtusuario}
                name="Usuario"
                label="Usuario"
              />
              <TextField
                onChange={onChangePassword}
                className={classes.txtcontrasena}
                value={password}
                name="Contraseña"
                label="Contraseña"
                type="password"
              />
              <Button className={classes.boton} type="submit">
                <h1 className={classes.txtboton}>ENTRAR</h1>
              </Button>
            </center>
          </form>
        </Box>
      </Box>
    </div>
  );
}
