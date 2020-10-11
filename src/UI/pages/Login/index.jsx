import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextBox from 'UI/components/atoms/TextBox';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  root: {
    background: 'linear-gradient(270deg, #ED8A9C 0%, #F5C4A1 100%)',
    boxShadow: '0px 3px 6px #00000029'
  }
});
export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const url = `url ejemplo ${username}/${password}`;
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
          history.push('/example');
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

  const classes = useStyle();
  return (
    <body style={{ background: '#FDF7F4', opacity: '1' }}>
      <div
        style={{
          width: '100%',
          height: '825px',
          boxShadow: '0px 3px 6px #00000029',
          borderTopRightRadius: '20'
        }}
      >
        <Box display="flex" justifyContent="center" p={1}>
          <Box
            style={{
              width: '398px',
              marginTop: '165px',
              height: '438px',
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              borderBottomLeftRadius: 26,
              borderBottomRightRadius: 26
            }}
            bgcolor="#FFFFFF"
          >
            <form onSubmit={onSubmit}>
              <center>
                <h1
                  style={{
                    marginTop: '54px',
                    marginBottom: '55px',
                    font: 'normal normal bold 32px/48px Poppins',
                    color: '#94A6B3',
                    height: '45px',
                    letterspacing: '0px'
                  }}
                >
                  INICIAR SESIÓN
                </h1>
                <TextBox
                  onChange={onChangeu}
                  style={{ width: '315px', height: '40px' }}
                  name="Usuario"
                  label="Usuario"
                />
                <TextBox
                  onChange={onChangep}
                  style={{ marginTop: '34px', width: '315px', height: '40px' }}
                  name="Contraseña"
                  label="Contraseña"
                  type="password"
                />
                <Button
                  className={classes.root}
                  style={{
                    marginTop: '42px',
                    marginBottom: '58px',
                    width: '171px',
                    color: 'white',
                    height: '48px',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24
                  }}
                >
                  <h1
                    style={{
                      width: '61px',
                      font: ' 16px/19px Roboto',
                      marginTop: '15px',
                      marginBottom: '14px',
                      opacity: '1',
                      letterspacing: '0px'
                    }}
                  >
                    ENTRAR
                  </h1>
                </Button>
              </center>
            </form>
          </Box>
        </Box>
      </div>
    </body>
  );
}
