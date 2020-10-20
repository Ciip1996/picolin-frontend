// @flow
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { fuseStyles } from 'UI/utils';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import {
  colors,
  InBoundCall,
  MissedCall,
  OutBoundCall,
  PhoneCallIcon,
  MailIcon,
  SMSIcon
} from 'UI/res';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import { styles, useStyles } from './style';

// Hover Elements ----------------------------------------------------------------------------

type CallTypeIconProps = {
  callType: 'inbound' | 'outBound' | 'missedCall'
};

const CallTypeIcon = (props: CallTypeIconProps) => {
  const { callType } = props;

  const customStyle = fuseStyles([styles.callType, styles.missedCall]);
  return (
    <div style={styles.callTypeContainer}>
      {callType === 'inbound' && <InBoundCall size={20} />}
      {callType === 'outBound' && <OutBoundCall size={20} />}
      {callType === 'missedCall' && <MissedCall size={20} />}
      <span style={callType === 'missedCall' ? customStyle : styles.callType}>
        {callType === 'inbound' && <> Inbound</>}
        {callType === 'outBound' && <> Outbound</>}
        {callType === 'missedCall' && <> Missed Call</>}
      </span>
    </div>
  );
};

type CallContainerProps = {
  color: string,
  acron: string,
  contactName: string,
  numberOrExtension: string,
  callType: 'inbound' | 'outBound' | 'missedCall',
  time: string
};

const CallContainer = (props: CallContainerProps) => {
  const { color, acron, contactName, numberOrExtension, callType, time } = props;

  const [isHovered, setisHovered] = useState(false);

  const handleShowIcons = () => {
    setisHovered(true);
  };

  const handleHideIcons = () => {
    setisHovered(false);
  };

  const customStyle = fuseStyles([styles.container, isHovered && styles.containerHover]);

  const classes = useStyles();

  return (
    <Grid
      container
      onMouseEnter={handleShowIcons}
      onMouseLeave={handleHideIcons}
      style={customStyle}
    >
      <Grid item xs={4} className={classes.userRow}>
        <CustomAvatar backgroundColor={color} acron={acron} />
        <div className={classes.contactInfo}>
          <div className={classes.contactName}>{contactName}</div>
          <span className={classes.number}>{numberOrExtension}</span>
        </div>
      </Grid>
      <Grid item xs={4} className={classes.itemGridMiddle}>
        <CallTypeIcon callType={callType} />
      </Grid>
      <Grid item xs={4} className={classes.itemGridEnd}>
        {isHovered && (
          <>
            <CustomIconButton tooltipText="Mail">
              <MailIcon fill={colors.black} size={20} />
            </CustomIconButton>
            <CustomIconButton tooltipText="New SMS">
              <SMSIcon fill={colors.black} size={20} />
            </CustomIconButton>
            <CustomIconButton tooltipText="Call">
              <PhoneCallIcon fill={colors.black} size={20} />
            </CustomIconButton>
          </>
        )}

        <div className={classes.time}>{time}</div>
      </Grid>
    </Grid>
  );
};

type CallRowProps = {
  callsLabels: any[]
};

const CallRow = (props: CallRowProps) => {
  const { callsLabels } = props;

  return (
    <>
      {callsLabels.map(each => {
        return (
          <CallContainer
            color={each.color}
            acron={each.acron}
            contactName={each.contactName}
            numberOrExtension={each.numberOrExtension}
            callType={each.callType}
            time={each.time}
          />
        );
      })}
    </>
  );
};

CallRow.defaultProps = {
  callsLabels: []
};

export default CallRow;
