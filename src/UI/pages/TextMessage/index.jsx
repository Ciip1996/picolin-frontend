// @flow
import React from 'react';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { globalStyles } from 'GlobalStyles';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DateDivider from 'UI/components/atoms/DateDivider';
import UserCardConnected from 'UI/components/molecules/UserCard';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import { smsLabels, chatTextLabels, userExample } from 'UI/constants/mockData';
import ButtonMenu from 'UI/components/molecules/ButtonMenu';
import { PhoneCallIcon, MailIcon, MoreIcon, colors, SMSEmptyState } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import Modal from '@material-ui/core/Modal';
import UserChatText from 'UI/components/atoms/UserChatText';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ChatInput from 'UI/components/molecules/ChatInput';
import TextMessageModal from 'UI/components/molecules/TextMessageModal';
import { useStyles } from './style';

const EmptySms = () => {
  const classesempty = useStyles();

  return (
    <div className={classesempty.emptyStateContainer}>
      <div className={classesempty.titleContainer}>
        <p className={classesempty.emptyStateTitle}>SMS not Selected </p>
        <p className={classesempty.emptyStateSubtitle}>Select one to start reading</p>
      </div>
      <SMSEmptyState />
    </div>
  );
};

type TextMessageProps = {
  isContentSelected: boolean,
  isUserWriting: boolean
};

const TextMessage = (props: TextMessageProps) => {
  const { isContentSelected, isUserWriting } = props;
  const [open, setOpen] = React.useState(false);
  const selectedUserChat = userExample;

  const responsiveHeight = useMediaQuery('(max-height:800px)');

  const classes = useStyles(
    responsiveHeight
      ? { minHeight: 650, marginBottom: 40 }
      : { minHeight: 'unset', marginBottom: 'unset' }
  );

  const MenuItems = [
    {
      icon: <PhoneCallIcon fill={colors.completeBlack} />,
      title: 'Call',
      visible: true
    },
    {
      icon: <MailIcon fill={colors.completeBlack} />,
      title: 'Edit',
      visible: true
    }
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ContentPageLayout>
      <div style={globalStyles.contentLayout}>
        <TitleLabel backNavigation text="Text Message" />
        <div className={classes.mainContainer}>
          <div className={classes.topBar}>
            <div className={classes.autoCompleteContainer}>
              <div className={classes.autoComplete}>
                <AutocompleteSelect placeholder="Search " />
              </div>
              <Divider className={classes.autoCompleteDivider} orientation="vertical" flexItem />
            </div>
            <div className={classes.tobBarContent}>
              <div className={classes.smsTitle}>
                {isContentSelected ? selectedUserChat : 'NOTHING SELECTED'}
              </div>
              <ButtonMenu isIconButton MenuItems={MenuItems} width="200px">
                <MoreIcon size={18} fill={colors.darkGrey} />
              </ButtonMenu>
            </div>
          </div>
          <div className={classes.smsContentContainer}>
            <div className={classes.userSms}>
              <DateDivider date="15 Jun" />
              <UserCardConnected mode="sms" smsLabels={smsLabels} />
              <Box className={classes.FAB}>
                <Tooltip interactive={false} title="Create Sms" placement="left">
                  <Fab
                    onClick={handleOpen}
                    size="medium"
                    component="span"
                    color="primary"
                    variant="round"
                    aria-label="add"
                  >
                    <AddIcon size={26} />
                  </Fab>
                </Tooltip>
              </Box>
            </div>
            <div className={classes.smsContent}>
              {isContentSelected ? (
                <>
                  <div className={classes.chatContent}>
                    <UserChatText chatTextLabels={chatTextLabels} />
                  </div>
                  <div className={classes.chatInputContainer}>
                    <ChatInput />
                    {isUserWriting && (
                      <div className={classes.userWriting}>{selectedUserChat} is writing... </div>
                    )}
                  </div>
                </>
              ) : (
                <EmptySms />
              )}
            </div>
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <TextMessageModal />
        </Modal>
      </div>
    </ContentPageLayout>
  );
};

TextMessage.defaultProps = {
  isContentSelected: true,
  isUserWriting: true
};

export default TextMessage;
