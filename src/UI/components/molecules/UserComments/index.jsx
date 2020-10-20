// @flow
import React from 'react';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { styles } from './style';

type UserCommentsProps = {
  avatarInitials: string,
  date: string,
  author: string,
  note: string
};

const UserComments = (props: UserCommentsProps) => {
  const { avatarInitials, date, author, note } = props;
  return (
    <div style={styles.reasonsContainer}>
      <Box pr={2}>
        <CustomAvatar backgroundColor={colors.success} acron={avatarInitials} />
      </Box>
      <div>
        <Box display="flex">
          <Text variant="subtitle1" text={author} fontSize={16} />
          <span style={styles.date}>{date}</span>
        </Box>
        <div style={styles.reasonsText}>{note}</div>
      </div>
    </div>
  );
};

export default UserComments;
