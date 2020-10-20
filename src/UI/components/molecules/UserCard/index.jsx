// @flow
import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import { colors } from 'UI/res';
import { selectRecruiter } from 'actions/map';
import { styles, useStyles } from './styles';

// Map Case --------------------------------------------------------------------------

type MapUserCardProps = {
  name: string,
  industry: string,
  color: string,
  onClick: any => any,
  acron: string
};

const MapUserCard = (props: MapUserCardProps) => {
  const { name, industry, color, onClick, acron } = props;
  return (
    <div style={styles.root}>
      <Box style={styles.box} p="0px 18px" onClick={onClick}>
        <CustomAvatar backgroundColor={color} acron={acron} />
        <Box ml={1} marginLeft={2}>
          <Box fontSize={18} color={colors.grey}>
            {name}
          </Box>
          <Box fontSize={14} color={colors.grey}>
            {industry}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

//  SMS Case ----------------------------------------------------------------------------

const SmsUserCard = props => {
  const { smsLabels } = props;
  const classes = useStyles();
  return (
    <>
      {smsLabels.map(each => {
        return (
          <div className={classes.container}>
            <CustomAvatar backgroundColor={each.color} acron={each.acron} />
            <div className={classes.smsDetail}>
              <div className={classes.contactName}>{each.contactName}</div>
              <span className={classes.mesage}>{each.mesage}</span>
            </div>
            <div className={classes.time}>{each.time}</div>
          </div>
        );
      })}
    </>
  );
};

// Main Component ----------------------------------------------------------------------------

type UserCardProps = {
  name: string,
  industry: string,
  initials: string,
  info: any,
  color: string,
  onUserClick?: (info: any) => any,
  mode: 'map' | 'sms',
  smsLabels: any[]
};

const UserCard = (props: UserCardProps) => {
  const { name, industry, color, onUserClick, info, mode, initials, smsLabels } = props;

  const initialsOrDefault = initials || name.substring(0, 3).toUpperCase();

  const handleClick = () => {
    onUserClick && onUserClick(info);
  };

  return (
    <>
      {mode === 'map' ? (
        <MapUserCard
          name={name}
          acron={initialsOrDefault}
          industry={industry}
          color={color}
          info={info}
          onClick={handleClick}
        />
      ) : (
        <>
          <SmsUserCard smsLabels={smsLabels} />
        </>
      )}
    </>
  );
};

UserCard.defaultProps = {
  onUserClick: () => {},
  initials: '',
  name: '',
  mode: 'map'
};

const mapDispatchToProps = dispatch => {
  return {
    onUserClick: info => dispatch(selectRecruiter(info))
  };
};

const UserCardConnected = connect(null, mapDispatchToProps)(UserCard);

export default UserCardConnected;
