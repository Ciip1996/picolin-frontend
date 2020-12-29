import { colors } from 'UI/res/colors/index';
import { input } from 'UI/constants/dimensions';

export const styles = {
  root: {
    width: 'fit-content'
  },
  buttonLayout: {
    height: input.height,
    maxHeight: input.height,
    borderRadius: input.borderRadius,
    alignItems: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    margin: 0,
    position: 'relative',
    backgroundColor: colors.success,
    color: colors.white,
    fontWeight: 500
  },
  label: {
    marginBottom: 0,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 15
  },
  input: {
    display: 'none'
  }
};
