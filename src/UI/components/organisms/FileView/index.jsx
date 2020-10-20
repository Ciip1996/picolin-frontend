// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import {
  EmptySentBulkEmail,
  DraftEmptyBulkEmail,
  DraftIcon,
  BulkEmailSentIcon,
  ScheduleNoContent,
  EmptySchedule
} from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import PreviewBulkEmail from 'UI/components/molecules/PreviewBulkEmail';
import { styles, useStyles } from './style';

type EmptyContentProps = {
  mode: 'sent' | 'drafts' | 'schedule'
};

const EmptyContent = (props: EmptyContentProps) => {
  const { mode } = props;
  const size = 170;

  const sizeResponsive = {
    width: size,
    height: size
  };

  return (
    <Box style={styles.emptyImage}>
      {mode === 'sent' && <EmptySentBulkEmail {...sizeResponsive} />}
      {mode === 'drafts' && <DraftEmptyBulkEmail {...sizeResponsive} />}
      {mode === 'schedule' && <EmptySchedule {...sizeResponsive} />}
    </Box>
  );
};

type NoContentProps = {
  mode: 'sent' | 'drafts' | 'schedule'
};

const NoContent = (props: NoContentProps) => {
  const { mode } = props;
  return (
    <Box style={styles.NoContent}>
      {mode === 'sent' && <BulkEmailSentIcon size={150} />}
      {mode === 'drafts' && <DraftIcon size={150} />}
      {mode === 'schedule' && <ScheduleNoContent size={150} />}
    </Box>
  );
};

type FileViewProps = {
  isWithOutContent?: boolean,
  fileViewContent: any,
  mode: 'sent' | 'drafts' | 'schedule',
  handleNewItem: () => any,
  isBulk: boolean,
  isContentSelected: boolean,
  emailSender: string,
  emailAddress: string,
  date: string,
  content: string,
  isResponsiveItem: boolean
};

const FileView = (props: FileViewProps) => {
  const {
    isWithOutContent,
    fileViewContent,
    isContentSelected,
    mode,
    handleNewItem,
    isBulk,
    emailSender,
    emailAddress,
    date,
    content,
    isResponsiveItem
  } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.mainContainer}>
      <Box className={classes.itemsContainer}>
        {isWithOutContent ? (
          <Box className={classes.emptyStateBox}>
            <div>
              <EmptyPlaceholder
                title={isBulk && true ? 'No Bulks Sent' : 'No Emails Sent'}
                subtitle={
                  mode === 'sent'
                    ? `Send a ${isBulk ? 'Bulk' : 'Email'} you can see it here!`
                    : `Let's create ${isBulk ? 'Bulk' : 'an Email'}`
                }
              >
                <EmptyContent mode={mode} />
              </EmptyPlaceholder>
              <Box className={classes.emptyStateButton}>
                <ActionButton
                  isWithLargeContent={mode === 'drafts' && true}
                  text={
                    mode === 'sent' ? 'New Template' : `Create ${isBulk ? 'a Bulk' : 'an Email'}`
                  }
                  onClick={handleNewItem}
                />
              </Box>
            </div>
          </Box>
        ) : (
          <>{fileViewContent}</>
        )}
      </Box>

      <Box
        className={classes.templateBox}
        alignItems={isWithOutContent || !isContentSelected ? 'center' : 'flex-start'}
      >
        {isWithOutContent ? (
          <NoContent mode={mode} />
        ) : (
          <PreviewBulkEmail
            date={date}
            emailSender={emailSender}
            emailAddress={emailAddress}
            isContentSelected={isContentSelected}
            content={content}
            isResponsiveItem={isResponsiveItem}
          />
        )}
      </Box>
    </div>
  );
};

FileView.defaultProps = {
  isWithOutContent: false,
  isBulk: true,
  mode: 'sent'
};

export default FileView;
