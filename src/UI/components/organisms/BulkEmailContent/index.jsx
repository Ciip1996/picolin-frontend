// @flow
import React from 'react';
import { loremIpsum } from 'UI/constants/mockData';
import FileViewContainer from 'UI/components/templates/FileViewContainer';
import { EditIcon, colors, FowardIcon, ScheduleCancel } from 'UI/res';
import BulkEmailTemplates from '../BulkEmailTemplates';
import CreateEmailTemplate from '../CreateEmailTemplate';
import OptInOptOutList from '../OptInOptOutList';

type BulkEmailContentProps = {
  handleAddEmailModal: () => any,
  isBulk: boolean,
  mode: 'sent' | 'template' | 'drafts' | 'email' | 'createTemplate' | 'schedule',
  onCancel: () => any,
  handleNewItemSent: () => any,
  handleNewItemDraft: () => any,
  onNewTemplateClick: () => any,
  onNewCreationFolder: () => any,
  isContentSelected: boolean,
  fileViewLabels: any[],
  isResponsiveItem: boolean,
  isWithActionButton: boolean,
  onTemplateSave: () => any,
  text: string
};

const BulkEmailContent = (props: BulkEmailContentProps) => {
  const {
    isBulk,
    mode,
    handleAddEmailModal,
    onCancel,
    handleNewItemSent,
    handleNewItemDraft,
    isContentSelected,
    fileViewLabels,
    isResponsiveItem,
    isWithActionButton,
    onNewTemplateClick,
    onNewCreationFolder,
    onTemplateSave,
    text
  } = props;

  const MenuItems = [
    {
      icon: <FowardIcon size={20} fill={colors.black} />,
      title: 'Foward',
      visible: true
    },
    {
      icon: <EditIcon size={20} fill={colors.black} />,
      title: 'Edit Schedule',
      visible: true
    },
    {
      icon: <ScheduleCancel size={20} fill={colors.black} />,
      title: 'Schedule Cancel',
      visible: true
    }
  ];

  return (
    <>
      {mode === 'template' && (
        <BulkEmailTemplates
          isContentSelected={isContentSelected}
          onNewTemplateClick={onNewTemplateClick}
          isBulkEmailPage
          onNewCreationFolder={onNewCreationFolder}
          isResponsiveItem={isResponsiveItem}
        />
      )}
      {mode === 'email' && <OptInOptOutList onClick={handleAddEmailModal} />}
      {mode === 'createTemplate' && (
        <CreateEmailTemplate onTemplateSave={onTemplateSave} onCancel={onCancel} />
      )}
      {mode === 'sent' || mode === 'drafts' || mode === 'schedule' ? (
        <FileViewContainer
          mode={mode}
          handleNewItem={mode === 'sent' ? handleNewItemSent : handleNewItemDraft}
          isBulk={isBulk}
          placeHolder={
            mode !== 'drafts' ? 'Filter files by Name' : 'Search by name, phone, number, etc'
          }
          sectionHeader={
            mode === 'schedule'
              ? `Scheduled ${isBulk ? 'Bulk Email' : 'Email'} Sent Preview`
              : `${isBulk ? 'Bulk' : 'Email'}  ${mode === 'drafts' ? 'Draft' : ''} Preview`
          }
          isContentSelected={mode === 'schedule' && true}
          date="Jun 24,2020, 11:34 pm"
          emailSender="hola@gmail.com"
          emailAddress="hola@gmail.com"
          content={loremIpsum}
          isWithActions={mode === 'schedule' && true}
          isWithOptions={mode === 'schedule' && true}
          MenuItems={MenuItems}
          fileViewLabels={fileViewLabels}
          isResponsiveItem={isResponsiveItem}
          isWithActionButton={isWithActionButton}
          text={text}
        />
      ) : null}
    </>
  );
};

BulkEmailContent.defaultProps = {
  mode: 'sent',
  isBulk: true,
  handleAddEmailModal: () => {},
  isWithActionButton: false,
  text: ''
};

export default BulkEmailContent;
