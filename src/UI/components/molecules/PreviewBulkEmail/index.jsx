// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { EmptyEmail } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import { useStyles } from './styles';

type PreviewContentProps = {
  emailSender: string,
  emailAddress: string,
  date: string,
  isResponsiveItem: boolean,
  content: string
};

const PreviewContent = (props: PreviewContentProps) => {
  const { emailSender, emailAddress, date, content, isResponsiveItem } = props;

  const classes = useStyles(props);
  return (
    <>
      <div className={isResponsiveItem ? classes.mainResponsive : classes.main}>
        <div className={classes.infoContainer}>
          <div className={classes.initialData}>
            <div className={classes.subtitle}>From:</div> <div>{emailSender}</div>
          </div>
          <div className={classes.initialData}>
            <div className={classes.subtitle}>To:</div>
            <div>{emailAddress}</div>
          </div>
          <div className={classes.initialData}>
            <div className={classes.subtitle}>Date:</div>
            <div className={classes.dateColor}>{date}</div>
          </div>
        </div>

        <div className={classes.content}>{content}</div>
      </div>
      {isResponsiveItem && (
        <div className={classes.actionsResponsive}>
          <ActionButton isResponsive text="Send now" />
        </div>
      )}
    </>
  );
};

type PreviewBulkEmailProps = {
  emailSender: string,
  emailAddress: string,
  date: string,
  isContentSelected: boolean,
  content: string,
  isResponsiveItem: boolean
};

const PreviewBulkEmail = (props: PreviewBulkEmailProps) => {
  const { isContentSelected, date, emailSender, emailAddress, content, isResponsiveItem } = props;
  return (
    <>
      {isContentSelected ? (
        <>
          <PreviewContent
            date={date}
            emailSender={emailSender}
            content={content}
            emailAddress={emailAddress}
            isResponsiveItem={isResponsiveItem}
          />
        </>
      ) : (
        <EmptyPlaceholder title="No Email Selected" subtitle="Select an email to read">
          <Box m="6% 0">
            <EmptyEmail />
          </Box>
        </EmptyPlaceholder>
      )}
    </>
  );
};

export default PreviewBulkEmail;
