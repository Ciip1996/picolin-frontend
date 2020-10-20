// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import Grid from '@material-ui/core/Grid';
import { ArrowLeft, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';

const Title = props => {
  const {
    text,
    loading,
    fontWeight,
    fontSize,
    shadow,
    color,
    textTransform,
    margin,
    customStyle
  } = props;
  const classes = useStyles();

  return (
    <Typography variant="h1" component="div">
      {loading ? (
        <Grid container>
          <Grid item md={3} sm={4}>
            <CustomSkeleton style={globalStyles.skeletonItem} color={colors.inactiveSideBarTab} />
          </Grid>
        </Grid>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          style={{ fontWeight, color, textTransform, fontSize, ...customStyle }}
          className={classes.titleLabel}
        >
          <p style={{ margin }} className={shadow ? classes.shadow : undefined}>
            {text}
          </p>
        </Box>
      )}
    </Typography>
  );
};

const NavigationTitle = props => {
  const { text, loading, fontWeight, onClick, fontSize } = props;

  return (
    <>
      {loading ? (
        <Grid container>
          <Grid item md={3} sm={4}>
            <CustomSkeleton style={globalStyles.skeletonItem} color={colors.inactiveSideBarTab} />
          </Grid>
        </Grid>
      ) : (
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <CustomIconButton onClick={onClick} tooltipText="Go Backward">
              <ArrowLeft fill={colors.oxford} size={16} />
            </CustomIconButton>
          </Box>
          <TitleLabel
            customStyle={{ textTransform: 'uppercase' }}
            margin="0"
            text={text}
            loading={loading}
            fontWeight={fontWeight}
            fontSize={fontSize}
          />
        </Box>
      )}
    </>
  );
};

type TitleLabelProps = {
  text: string,
  fontWeight?: number,
  fontSize?: any,
  shadow?: boolean,
  color?: string,
  margin?: string,
  customStyle?: Object,
  textTransform?: string,
  loading?: boolean,
  backNavigation?: boolean,
  mode: 'goBack' | 'customAction',
  onClick: () => any
};

export default function TitleLabel(props: TitleLabelProps) {
  const {
    text,
    loading,
    fontWeight,
    fontSize,
    shadow,
    color,
    textTransform,
    margin,
    customStyle,
    backNavigation,
    onClick,
    mode
  } = props;
  const history = useHistory();

  const handleGoBackButton = () => {
    history.goBack();
  };

  return (
    <>
      {backNavigation ? (
        <NavigationTitle
          loading={loading}
          onClick={mode === 'goBack' ? handleGoBackButton : onClick}
          fontWeight={fontWeight}
          text={text}
          fontSize={fontSize}
        />
      ) : (
        <Title
          text={text}
          loading={loading}
          fontWeight={fontWeight}
          fontSize={fontSize}
          shadow={shadow}
          color={color}
          textTransform={textTransform}
          margin={margin}
          customStyle={customStyle}
        />
      )}
    </>
  );
}
TitleLabel.defaultProps = {
  fontWeight: 700,
  fontSize: 32,
  shadow: false,
  color: colors.black,
  margin: '0',
  customStyle: {},
  textTransform: 'unset',
  loading: false,
  backNavigation: false,
  mode: 'goBack',
  onClick: () => {}
};
