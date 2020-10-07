// @flow
import React, { useState } from 'react';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import Checkbox from '@material-ui/core/Checkbox';
import InfoIcon from '@material-ui/icons/Info';
import Box from '@material-ui/core/Box';
import ChatInput from 'UI/components/molecules/ChatInput';
import Tooltip from '@material-ui/core/Tooltip';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import { useStyles } from './style';

const TextMessageModal = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <div className={classes.modalTitle}>NEW TEXT Message</div>
      <div className={classes.modalContent}>
        <div className={classes.modalInputsContainer}>
          <TextBox name="phone" label="Text from" disabled value="589369458" inputType="phone" />
          <AutocompleteSelect groupBy={option => option.Names} />
          <div className={classes.checkBoxContainer}>
            <Checkbox checked={checked} onChange={handleChange} color="primary" />
            <Tooltip
              title="Send Group text messages (up to 10 people) to start a text conversation. Our uncheck the box to send a text message to everyone individual, they will be unaware of the recipients."
              placement="right"
            >
              <div className={classes.checkBoxContainer}>
                <div className={classes.checkBoxtitle}>Create Group text</div>
                <div className={classes.infoIcon}>
                  <InfoIcon color="disabled" />
                </div>
              </div>
            </Tooltip>
          </div>
          {!checked && <ChatInput isFullWidth />}
        </div>
      </div>
      <div className={classes.modalActions}>
        <Box mx="28px">
          <ActionButton variant="outlined" text="Cancel" />
        </Box>
        <ActionButton text="Next" />
      </div>
    </div>
  );
};

export default TextMessageModal;
