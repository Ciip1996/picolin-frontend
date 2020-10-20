// @flow
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { colors } from 'UI/res';
import TextBox from 'UI/components/atoms/TextBox';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';

type ChatInputProps = {
  isFullWidth: boolean
};

const ChatInput = (props: ChatInputProps) => {
  const { isFullWidth } = props;
  const classes = useStyles();

  return (
    <Box width={isFullWidth ? '100%' : '87%'} className={classes.chatInput}>
      <TextBox name="chat" multiline rowsMax={3} rows={1} />
      <div className={classes.uploadIcon}>
        <label htmlFor="icon-button-file">
          <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
          <IconButton color="primary" aria-label="upload picture" component="span">
            <AttachFileIcon style={{ color: colors.black }} />
          </IconButton>
        </label>
      </div>
    </Box>
  );
};

ChatInput.defaultProps = {
  isFullWidth: false
};

export default ChatInput;
