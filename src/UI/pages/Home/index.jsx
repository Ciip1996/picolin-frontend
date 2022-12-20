// @flow
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { PageTitles } from 'UI/constants/defaults';
import { getCurrentUser } from 'services/Authentication';
import { type User } from 'types/app';
import { useLanguage, useIsDemoEnvironment } from 'UI/utils';
import ReactLogo from 'UI/res/images/react.png';
import MySQLLogo from 'UI/res/images/mysql.png';
import NodeJSLogo from 'UI/res/images/node-js.svg';
import FlowLogo from 'UI/res/images/flow.svg';
import MaterialUIIcon from 'UI/res/images/material-ui.png';
import ESLintIcon from 'UI/res/images/eslint.png';
import PrettierIcon from 'UI/res/images/prettier.svg';

import { useStyles, styles } from './styles';
import Contents from './strings';

const Home = () => {
  const classes = useStyles();
  const user: User = getCurrentUser();
  const wasReloaded = localStorage.getItem('reloaded');
  const language = useLanguage();
  const isDemo = useIsDemoEnvironment();

  useEffect(() => {
    document.title = language && PageTitles[language].Home;

    const forceRefreshingUIRestrictions = () => {
      // A page reloaded is needed the first time we login in order to refresh the UI components
      // with access for Admin / employees. Otherwise it wont refresh them.
      if (!wasReloaded) {
        localStorage.setItem('reloaded', 'true');
        window.location.reload();
      }
    };
    forceRefreshingUIRestrictions();
  }, [language, wasReloaded]);

  const titleLabel = wasReloaded
    ? `${Contents[language]?.welcomeFirst} ${user?.userName || ''} ${
        Contents[language]?.welcomeSecond
      }`
    : Contents[language]?.loading;

  return (
    <>
      <ContentPageLayout>
        <div className={classes.root}>
          <Grid
            className={classes.container}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <TitleLabel
              customStyle={styles.mainTitle}
              fontSize={47}
              text={titleLabel}
            />
            {isDemo && (
              <>
                <div
                  style={{ textAlign: 'center' }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: wasReloaded
                      ? `<p>This project was developed by <a href="https://www.github.com/Ciip1996">@Ciip1996</a> and <a href="https://www.github.com/MoniGascaF">@MoniGascaF</a> the code can be found on a private repo at  <a href="https://github.com/Ciip1996/picolin-frontend">https://github.com/Ciip1996/picolin-frontend</a>. If you would like to see the code please contact me at <a href="mailto:bytepacheco@gmail.com"/>bytepacheco@gmail.com<a/> or through <a href="https://www.linkedin.com/in/ciip"/>my LinkedIn.<a/></p>`
                      : ''
                  }}
                />
                <br />
                <p>This project was created using the following tech stack:</p>
                <div style={styles.techStackIconsContainer}>
                  <img
                    src={NodeJSLogo}
                    title="Node.js"
                    alt="Node.js Icon"
                    width={150}
                    height={70}
                  />
                  <img
                    src={ReactLogo}
                    title="React.js"
                    alt="React.js Icon"
                    width={80}
                    height={70}
                  />
                  <img
                    src={MySQLLogo}
                    title="MySQL"
                    alt="MySQL Icon"
                    width={120}
                    height={70}
                  />
                  <img
                    src={FlowLogo}
                    title="Flow Typing Library"
                    alt="Flow Icon"
                    width={150}
                    height={70}
                  />
                  <img
                    src={MaterialUIIcon}
                    title="Material UI Library"
                    alt="Material UI Icon"
                    width={70}
                    height={70}
                  />
                  <img
                    src={ESLintIcon}
                    title="ESLint Library and Extention for VSCode"
                    alt="ESLint Icon"
                    width={70}
                    height={70}
                  />
                  <img
                    src={PrettierIcon}
                    title="Prettier Library and Extention for VSCode"
                    alt="Prettier Icon"
                    width={70}
                    height={70}
                  />
                </div>
              </>
            )}

            <br />
            <TitleLabel
              fontSize={14}
              text={wasReloaded ? Contents[language]?.translationCaption : ''}
            />
          </Grid>
        </div>
      </ContentPageLayout>
    </>
  );
};
export default withRouter(Home);
