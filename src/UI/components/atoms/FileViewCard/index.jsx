// @flow
import React from 'react';
import Text from 'UI/components/atoms/Text';
import { useStyles } from './style';

type FileViewCardProps = {
  bulkId: string,
  subject: string,
  message: string,
  time: string,
  isActiveCard: boolean
};

const FileViewCard = (props: FileViewCardProps) => {
  const { bulkId, subject, message, time, isActiveCard } = props;
  const classes = useStyles(props);
  return (
    <div className={classes.FileView} isActiveCard={isActiveCard}>
      <div className={classes.textContainer}>
        <div className={classes.fileName}>{bulkId}</div>
        <div className={classes.fileSubject}>{subject}</div>
        <Text
          cropped
          fontSize={14}
          fontWeight={300}
          customclassName={classes.fileText}
          variant="body2"
          text={message}
        />
      </div>
      <div className={classes.fileDate}>{time}</div>
    </div>
  );
};

export default FileViewCard;
