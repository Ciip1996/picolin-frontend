// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Hidden from '@material-ui/core/Hidden';
import CustomSkeleton from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/CustomSkeleton';
import Box from '@material-ui/core/Box';
import { globalStyles } from 'GlobalStyles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { useStyles, styles } from './styles';

type ProfilePageLayoutProps = {
  isLoading: boolean,
  title: string,
  profileView: any,
  recruiterBar: any,
  tabsView: any
};

const ProfilePageLayout = (props: ProfilePageLayoutProps) => {
  const {
    isLoading,
    title,
    profileView: ProfileView,
    recruiterBar: RecruiterBar,
    tabsView: TabsView
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TitleLabel backNavigation text={title} loading={isLoading} />
      <Grid container direction="row" spacing={4} className={classes.wrapper}>
        <Grid item sm={12} md={5}>
          {RecruiterBar && (
            <Hidden mdUp>
              <div
                className={isLoading ? classes.layoutTopOnLoading : classes.layoutTop}
                style={styles}
              >
                {RecruiterBar}
              </div>
            </Hidden>
          )}
          {isLoading ? (
            <Box display="flex" flexDirection="column" height="100%">
              <Box mb={1}>
                <Box
                  style={globalStyles.skeletonTitleBar}
                  display="flex"
                  alignItems="center"
                  px={2}
                >
                  <CustomSkeleton width={230} onContainer height={18} radius={30} />
                </Box>
              </Box>
              <Box
                display="flex"
                flex={1}
                flexDirection="column"
                padding="10px 20px"
                bgcolor={colors.appBackgroundContrast}
              >
                <Box display="flex" flex={1} flexDirection="column" mb={1.5}>
                  {Array.from(Array(5)).map((e, i) => (
                    <Box key={i.toString()} style={globalStyles.skeletonContainer}>
                      <CustomSkeleton style={globalStyles.skeletonCol} />
                      <CustomSkeleton style={globalStyles.skeletonCol} />
                    </Box>
                  ))}
                </Box>
                <CustomSkeleton style={globalStyles.skeletonSeparator} />
                <Grid container>
                  <Grid item md={4} sm={4}>
                    <CustomSkeleton style={globalStyles.skeletonItem} />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <CustomSkeleton style={styles.skeletonBar} />
                </Box>
                <Box mt={2}>
                  <CustomSkeleton style={styles.skeletonBar} />
                </Box>
              </Box>
            </Box>
          ) : (
            <div className={classes.leftContainer}>{ProfileView}</div>
          )}
        </Grid>
        <Grid item sm={12} md={7} className={classes.columnRight}>
          <div className={classes.rightContainer}>
            {RecruiterBar && (
              <Hidden smDown>
                <div className={isLoading ? classes.layoutTopOnLoading : classes.layoutTop}>
                  {RecruiterBar}
                </div>
              </Hidden>
            )}
            {isLoading ? (
              <Box
                mt="12px"
                width="100%"
                marginTop={0}
                display="flex"
                flexDirection="column"
                flex={1}
              >
                <Box
                  style={globalStyles.skeletonTitleBar}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-around"
                >
                  <CustomSkeleton onContainer width="28%" radius={30} />
                  <CustomSkeleton onContainer width="28%" radius={30} />
                  <CustomSkeleton onContainer width="28%" radius={30} />
                </Box>
                <Box style={styles.skeletonTabsBackground}>
                  {Array.from(Array(6)).map((e, i) => (
                    <Box key={i.toString() + e} style={globalStyles.skeletonContainer}>
                      {Array.from(Array(4)).map((f, j) => (
                        <CustomSkeleton
                          key={j.toString() + f}
                          style={globalStyles.profileSkeletonItem}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
                {/* <Box mt={1.5}>
                  <CustomSkeleton style={globalStyles.skeletonTitleBar} />
                </Box> */}
              </Box>
            ) : (
              <div className={classes.layoutBottom}>{TabsView}</div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

ProfilePageLayout.defaultProps = {
  recruiterBar: undefined
};

export default withRouter(ProfilePageLayout);
