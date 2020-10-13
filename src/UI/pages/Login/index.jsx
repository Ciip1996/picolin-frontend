import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextBox from 'UI/components/atoms/TextBox';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const url = `url example ${username}/${password}`; // TODO: change url later
  const history = useHistory();

  const Validacion = async () => {
    axios
      .get(url)
      .then(response => {
        // handle success
        if (response.data === '1') {
          alert('Login successful!');
          setPassword('');
          setUsername('');
          history.push('/example'); // TODO: change url later
        } else {
          alert('Credentials are wrong!');
        }
      })
      .catch(error => {
        // handle error
        console.log('error', error);
      });
  };

  const onChangep = e => setPassword(e.target.value);
  const onChangeu = e => setUsername(e.target.value);

  const onSubmit = e => {
    e.preventDefault();
    Validacion();
  };

  const classes = useStyles();
  return (
    <div className={classes.fondo}>
      <Box display="flex" justifyContent="center" p={1}>
        <Box className={classes.box}>
          <form onSubmit={onSubmit}>
            <center>
              <h1 className={classes.h1}>INICIAR SESIÓN</h1>
              <TextBox
                onChange={onChangeu}
                className={classes.txtusuario}
                name="Usuario"
                label="Usuario"
              />
              <TextBox
                onChange={onChangep}
                className={classes.txtcontrasena}
                name="Contraseña"
                label="Contraseña"
                type="password"
              />
              <Button className={classes.boton}>
                <h1 className={classes.txtboton}>ENTRAR</h1>
              </Button>
            </center>
          </form>
        </Box>
      </Box>
    </div>
  );
}
