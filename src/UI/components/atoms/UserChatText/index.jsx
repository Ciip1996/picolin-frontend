// @flow
import React from 'react';
import { Box } from '@material-ui/core';
import CustomAvatar from '../CustomAvatar';
import { useStyles } from './styles';

type UserChatTextProps = {
  mode: 'sender' | 'receiver',
  chatTextLabels: any[]
};

const UserChatText = (props: UserChatTextProps) => {
  const { mode, chatTextLabels } = props;
  const classes = useStyles();
  return (
    <>
      {chatTextLabels.map(each => {
        return (
          <Box
            className={classes.mainBox}
            flexDirection={each.mode === 'sender' ? 'row' : 'row-reverse'}
            textAlign={each.mode === 'receiver' && 'right'}
            mode={mode}
          >
            <CustomAvatar acron={each.acron} backgroundColor={each.color} />
            <div className={classes.textContainer}>
              <div className={classes.user}>{each.contactName}</div>
              <div className={classes.message}>{each.message}</div>
              <div className={classes.time}>{each.time}</div>
            </div>
          </Box>
        );
      })}
    </>
  );
};

UserChatText.defaultProps = {
  mode: 'sender',
  chatTextLabels: []
};

export default UserChatText;
