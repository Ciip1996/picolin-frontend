// @flow
import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { CancelSaveButton } from 'UI/constants/dimensions';
import ActionButton from 'UI/components/atoms/ActionButton';
import CustomDatePicker from 'UI/components/atoms/CustomDatePicker';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { CloseIcon, colors, ScheduleIcon, PopperArrow, ArrowLeft } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import BulkEmailComponents from '../BulkEmailComponents';
import { useStyles, usePaperStyles, styles } from './styles';

const ScheduleOptions = () => {
  const [isScheduling, setisScheduling] = useState(false);
  const [open, setOpen] = useState(false);

  const classes = usePaperStyles();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
    setisScheduling(false);
  };

  const handleMode = () => {
    setisScheduling(true);
  };

  const handleGoBack = () => {
    setisScheduling(false);
  };

  const handleDateChange = () => {};

  return (
    <>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleClickAway}
      >
        <Box mx={3} style={styles.popOverContainer}>
          <ActionButton
            text="Send Later"
            onClick={handleClick}
            style={{ width: CancelSaveButton }}
            variant="outlined"
            status="success"
            iconPosition="right"
          >
            <ArrowDropDownIcon />
          </ActionButton>
          {open ? (
            <div className={classes.root}>
              <Paper elevation={2} className={classes.popOverContent}>
                <Box p={isScheduling ? '2px 20px 2px 10px' : '2px 20px'} className={classes.labels}>
                  {isScheduling && (
                    <div className={classes.arrowBack}>
                      <CustomIconButton tooltipText="Go back" onClick={handleGoBack}>
                        <ArrowLeft fill={colors.oxford} size={15} />
                      </CustomIconButton>
                    </div>
                  )}
                  {isScheduling ? 'Pick Day & Time' : 'Schedule Date Send'}
                </Box>
                <div className={classes.scheduleInputs}>
                  {!isScheduling ? (
                    <>
                      <span role="button" className={classes.scheduleOptions}>
                        Today´s afeternoon May 16, 06:00 PM
                      </span>
                      <span role="button" className={classes.scheduleOptions}>
                        Tomorrow morning May 17, 06:00 PM
                      </span>
                      <span role="button" className={classes.scheduleOptions}>
                        Tomorrows afternoon May 17, 06:00 PM
                      </span>
                      <hr className={classes.scheduleDivider} />
                      <button onClick={handleMode} type="button" className={classes.pickDateOption}>
                        <Box mr={1}>
                          <ScheduleIcon fill={colors.darkGrey} size={20} />
                        </Box>
                        Pick date and time
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={classes.datePickerContainer}>
                        <span className={classes.dateTitle}>Schedule Date </span>
                        <CustomDatePicker
                          onDateChange={handleDateChange}
                          name="date_schedule"
                          label="Date & Time"
                          disabled={false}
                          value
                        />
                      </div>
                      <ActionButton style={styles.scheduleActionButton} text="SCHEDULE SEND" />
                    </>
                  )}
                </div>
              </Paper>
              <div className={classes.arrowPosition}>
                <PopperArrow fill={colors.lightgrey} />
              </div>
            </div>
          ) : null}
        </Box>
      </ClickAwayListener>
    </>
  );
};

type BulkEmailModalProps = {
  onClose: any => void,
  variant: 'bulk' | 'email'
};

const BulkEmailModal = (props: BulkEmailModalProps) => {
  const { onClose, variant } = props;
  const classes = useStyles();
  const [mode, setMode] = useState();

  const handleCreateTemplate = () => {
    setMode('createTemplate');
  };

  const handleEmail = () => {
    setMode('email');
  };

  // Popover -------------------------------------

  return (
    <Box className={classes.bulkEmailModalContainer}>
      <Box style={styles.header}>
        <TitleLabel
          backNavigation={mode === 'createTemplate'}
          fontSize={26}
          text={
            variant === 'bulk'
              ? `${mode === 'createTemplate' ? 'New Template' : 'BULK EMAIL'}`
              : 'EMAIL'
          }
          mode="customAction"
          onClick={handleEmail}
        />
        <CustomIconButton onClick={onClose} tooltipPosition="bottom" tooltipText="Close">
          <CloseIcon fill={colors.completeBlack} />
        </CustomIconButton>
      </Box>
      <Box style={styles.content}>
        <BulkEmailComponents
          isEmailModal={variant === 'email' && true}
          mode={mode}
          onClick={handleCreateTemplate}
          onCancel={handleEmail}
          onNewTemplateClick={handleCreateTemplate}
          variant={variant}
          onTemplateSave={onClose}
        />
        {mode !== 'createTemplate' && (
          <Box style={styles.footer}>
            <ActionButton
              text="Cancel"
              onClick={onClose}
              variant="outlined"
              style={{ width: CancelSaveButton }}
            />
            <ScheduleOptions />

            <ActionButton
              text={mode === 'templateFiles' ? 'USE TEMPLATE' : 'SEND NOW'}
              onClick={onClose}
              style={{ width: CancelSaveButton }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

BulkEmailModal.defaultProps = {
  variant: 'bulk'
};

export default BulkEmailModal;
