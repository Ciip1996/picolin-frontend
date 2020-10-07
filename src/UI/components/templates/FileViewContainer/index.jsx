// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import FileView from 'UI/components/organisms/FileView';
import FileViewCard from 'UI/components/atoms/FileViewCard';
import BulkEmailContentHeader from 'UI/components/molecules/BulkEmailContentHeader';
import ActionButton from 'UI/components/atoms/ActionButton';
import { useStyles } from './style';

type BulkEmailContentProps = {
  mode: 'sent' | 'drafts' | 'schedule',
  isBulk: boolean,
  sectionHeader: string,
  placeHolder: string,
  handleNewItem: () => any,
  isContentSelected: boolean,
  emailSender: string,
  emailAddress: string,
  date: string,
  content: string,
  isWithActions: boolean,
  isWithOptions: boolean,
  MenuItems: Array<any>,
  fileViewLabels: any[],
  isResponsiveItem: boolean,
  isWithActionButton: boolean,
  text: string
};
const FileViewContainer = (props: BulkEmailContentProps) => {
  const {
    mode,
    isBulk,
    sectionHeader,
    placeHolder,
    handleNewItem,
    emailSender,
    emailAddress,
    isContentSelected,
    date,
    content,
    isWithActions,
    isWithOptions,
    MenuItems,
    fileViewLabels,
    isResponsiveItem,
    isWithActionButton,
    text
  } = props;
  const classes = useStyles(props);

  return (
    <div mode={mode} isBulk={isBulk} className={classes.main}>
      <BulkEmailContentHeader
        sectionHeaderTitle={sectionHeader}
        isWithOptions={isWithOptions}
        placeHolder={placeHolder}
        MenuItems={MenuItems}
        isWithActionButton={isWithActionButton}
        text={text}
      />
      <Box
        className={
          isWithActions && !isResponsiveItem
            ? classes.containerWithActions
            : classes.templatesContainer
        }
      >
        <FileView
          mode={mode}
          handleNewItem={handleNewItem}
          isBulk={isBulk}
          date={date}
          emailSender={emailSender}
          emailAddress={emailAddress}
          content={content}
          isContentSelected={isContentSelected}
          isWithOutContent={mode === 'drafts' && true}
          isResponsiveItem={isResponsiveItem}
          fileViewContent={
            <>
              {fileViewLabels.map(label => (
                <FileViewCard
                  key={label.id}
                  bulkId={label.bulkId}
                  subject={label.subject}
                  message={label.message}
                  time={label.time}
                  isActiveCard={label.isActiveCard}
                />
              ))}
            </>
          }
        />
      </Box>
      {isWithActions && !isResponsiveItem && (
        <div className={classes.actions}>
          <ActionButton text="Send Now" />
        </div>
      )}
    </div>
  );
};

FileViewContainer.defaultProps = {
  mode: 'send',
  isBulk: true,
  isWithOptions: false,
  MenuItems: [],
  fileViewLabels: '',
  isWithActionButton: false,
  text: 'string'
};

export default FileViewContainer;
