// @flow
// import React from 'react';
// import MicrosoftLogin from 'react-microsoft-login';
// import { CardActionArea } from '@material-ui/core';
// import { styles } from './styles';

// type LoginButtonProps = {
//   clientId: string,
//   tenantUrl: string,
//   debug: boolean,
//   authCallback: (err: any, data: any) => void,
//   theme?: 'dark_short' | 'light_short' | 'dark' | 'light'
// };

// const LoginButton = (props: LoginButtonProps) => {
//   const { clientId, tenantUrl, debug, authCallback, theme } = props;

//   const authHandler = (err, data) => {
//     authCallback && authCallback(err, data);
//   };

//   return (
//     <CardActionArea style={styles.buttonContainer}>
//       <MicrosoftLogin
//         prompt="login"
//         clientId={clientId}
//         tenantUrl={tenantUrl}
//         debug={debug}
//         authCallback={authHandler}
//         buttonTheme={theme}
//       />
//     </CardActionArea>
//   );
// };

// LoginButton.defaultProps = {
//   theme: 'dark'
// };

// export default LoginButton;
