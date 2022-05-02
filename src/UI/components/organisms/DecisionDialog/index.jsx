// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import { ErrorIcon, WarningIcon, SuccessIcon, CloseIcon, colors } from 'UI/res';
import Text from 'UI/components/atoms/Text';
import { closeConfirmation as closeConfirmationAction } from 'actions/app';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import ActionButton from 'UI/components/atoms/ActionButton';
import { styles, useStyles } from './styles';

const Transition = React.forwardRef((props, ref) => {
  return <Grow ref={ref} {...props} />;
});

const severityValues = {
  warning: {
    icon: <WarningIcon size={48} fill={colors.orange} />,
    color: colors.orange
  },
  error: {
    icon: <ErrorIcon size={48} fill={colors.error} />,
    color: colors.error
  },
  success: {
    icon: <SuccessIcon size={48} fill={colors.active} />,
    color: colors.active
  }
};

type DecisionDialogProps = {
  title: string,
  message: string,
  confirmButtonText: string,
  cancelButtonText: string,
  severity: 'warning' | 'error' | 'success',
  withButtons: 'YesNo' | 'Confirmation',
  onConfirm: boolean => any,
  closeConfirmation: () => any,
  isHighLightActionOnLeft: boolean
};

const DecisionDialog = (props: DecisionDialogProps) => {
  const {
    title,
    message,
    confirmButtonText,
    cancelButtonText,
    severity,
    withButtons,
    onConfirm,
    closeConfirmation,
    isHighLightActionOnLeft
  } = props;

  const [open, setOpen] = useState(true);

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    closeConfirmation();
  };

  const handleConfirm = () => {
    handleClose();
    onConfirm(true);
  };

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <CustomIconButton
          style={styles.closeIcon}
          tooltipText="Close"
          onClick={handleClose}
        >
          <CloseIcon fill={colors.black} />
        </CustomIconButton>
        <div style={styles.bodyContainer}>
          {severityValues[severity].icon}
          <div style={styles.textContainer}>
            <Text
              variant="subtitle1"
              text={title}
              fontSize={22}
              fontWeight={700}
            />
            <Text variant="body2" text={message} />
          </div>
        </div>
        <DialogActions className={classes.actions}>
          {withButtons === 'YesNo' && (
            <div className={classes.buttonMargin}>
              <ActionButton
                variant={isHighLightActionOnLeft ? 'contained' : 'outlined'}
                className={classes.button}
                onClick={handleClose}
                text={cancelButtonText}
              />
            </div>
          )}
          {withButtons && (
            <ActionButton
              variant={isHighLightActionOnLeft ? 'outlined' : 'contained'}
              className={classes.button}
              onClick={handleConfirm}
              text={confirmButtonText}
            />
          )}
        </DialogActions>
        <div
          style={{
            ...styles.footerBar,
            backgroundColor: severityValues[severity].color
          }}
        />
      </Dialog>
    </div>
  );
};

DecisionDialog.defaultProps = {
  confirmButtonText: 'si',
  cancelButtonText: 'no',
  severity: 'warning',
  withButtons: null,
  isHighLightActionOnLeft: false
};

const mapDispatchToProps = dispatch => {
  return {
    closeConfirmation: () => dispatch(closeConfirmationAction())
  };
};

const DecisionDialogConnected = connect(
  null,
  mapDispatchToProps
)(DecisionDialog);

export default DecisionDialogConnected;
