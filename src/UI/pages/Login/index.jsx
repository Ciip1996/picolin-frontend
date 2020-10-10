import React from 'react';
import Box from '@material-ui/core/Box';
import TextBox from 'UI/components/atoms/TextBox';
import Button from '@material-ui/core/Button';

export default function LogIn() {
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
              borderBottomRightRadius: 26,
              boxShadow: '0px 3px 6px #00000029'
            }}
            bgcolor="#FFFFFF"
          >
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
              <TextBox style={{ width: '315px', height: '40px' }} name="Usuario" label="Usuario" />
              <TextBox
                style={{ marginTop: '34px', width: '315px', height: '40px' }}
                name="Contraseña"
                label="Contraseña"
                type="password"
              />

              <Button
                style={{
                  marginTop: '42px',
                  marginBottom: '58px',
                  width: '171px',
                  color: 'white',
                  height: '48px',
                  backgroundColor: '#F5C4A1',
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
          </Box>
        </Box>
      </div>
    </body>
  );
}
