import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { input, letterSpacing } from 'UI/constants/dimensions';

export const useOtherClasses = makeStyles(theme => ({
  label: {
    fontFamily: theme.typography.fontFamilyContent,
    transform: 'translate(14px, 14px) scale(1)'
  },
  select: {
    ...theme.input,
    margin: 0
  },
  selectGlobal: {
    borderRadius: `0px ${input.borderRadius}px ${input.borderRadius}px 0px`,
    height: input.height,
    border: 0
  },
  selectMenu: {
    maxWidth: '100%',
    textTransform: props => (props.isGlobal ? 'uppercase' : 'unset'),
    fontFamily: theme.typography.fontFamilyContent
  }
}));

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.input
  },
  select: {
    ...theme.selectBox.select,
    display: 'unset',
    paddingLeft: '15px',
    lineHeight: `${input.height}px`,
    margin: 0,
    '&:focus': {
      borderRadius: input.borderRadius,
      backgroundColor: 'unset'
    }
  }
}));

export const useGlobalSelectSyles = makeStyles(theme => ({
  outlined: {
    background: colors.success,
    color: colors.white,
    letterSpacing
  },
  select: {
    ...theme.selectBox.select,
    textTransform: 'uppercase',
    borderRadius: `0px ${input.borderRadius}px ${input.borderRadius}px 0px`,
    '&:focus, &:hover': {
      background: '#6373E8',
      borderRadius: `0px ${input.borderRadius}px ${input.borderRadius}px 0px`
    }
  },
  icon: {
    color: 'white'
  }
}));
