// @flow
import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { THEME } from 'GlobalStyles';
import { styles } from './styles';

type ContentPageLayoutProps = {
  children: any,
  customStyle: Object
};

const ContentPageLayout = (props: ContentPageLayoutProps) => {
  const { children, customStyle, ...rest } = props;
  return (
    <ThemeProvider theme={THEME}>
      <div style={{ ...styles.wrapper, ...customStyle }} {...rest}>
        {children}
      </div>
    </ThemeProvider>
  );
};

ContentPageLayout.defaultProps = {
  customStyle: {}
};

export default ContentPageLayout;
