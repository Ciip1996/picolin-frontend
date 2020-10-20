// @flow
import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import {
  TemplateIcon,
  PlusIcon,
  DraftIcon,
  GearIcon,
  SendIcon,
  ScheduleIcon,
  colors
} from 'UI/res';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Text from 'UI/components/atoms/Text';
import ActionButton from 'UI/components/atoms/ActionButton';
import BulkEmailContent from 'UI/components/organisms/BulkEmailContent';
import { fileViewLabels } from 'UI/constants/mockData';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import ModalNewFolderCreation from 'UI/components/molecules/ModalNewFolderCreation';
import { useStyles, menuStyles, toolTipStyles, chipStyles } from './styles';

type MenuItemProps = {
  isResponsiveItem: boolean,
  onClick: () => any,
  mode: 'sent' | 'template' | 'drafts' | 'email' | 'createTemplate' | 'schedule',
  icon: any,
  text: string,
  className: Object,
  isResponsiveMode: boolean,
  isTotalItemsNeeeded: boolean,
  totalItems: number
};

const MenuItem = (props: MenuItemProps) => {
  const {
    isResponsiveItem,
    onClick,
    mode,
    icon,
    text,
    className,
    isResponsiveMode,
    totalItems,
    isTotalItemsNeeeded
  } = props;

  const classes = toolTipStyles();
  const classesChip = chipStyles();

  const [classesHover, setClassesHover] = useState(classesChip.chip);

  const handleHover = () => {
    setClassesHover(classesChip.chipHover);
  };

  const handleResetHover = () => {
    setClassesHover(classesChip.chip);
  };

  return (
    <>
      {isResponsiveMode ? (
        <Tooltip title={text} classes={classes} placement="right" arrow>
          <Box
            className={className}
            isResponsiveItem={isResponsiveItem}
            mode={mode}
            onClick={onClick}
          >
            <Box mr={!isResponsiveItem && 1}>{icon}</Box>
          </Box>
        </Tooltip>
      ) : (
        <div
          className={classesChip.container}
          onMouseEnter={handleHover}
          onMouseLeave={handleResetHover}
        >
          <Box className={className} mode={mode} onClick={onClick}>
            <Box mr={1}>{icon}</Box>
            <Text variant="body2" text={text} />
          </Box>
          {isTotalItemsNeeeded && <Box className={classesHover}>{totalItems}</Box>}
        </div>
      )}
    </>
  );
};

type BulkEmailMenuItemsProps = {
  mode: 'sent' | 'template' | 'drafts' | 'email' | 'createTemplate' | 'schedule',
  menuItemsLabels: any[],
  isResponsiveItem: boolean,
  totalItems: number
};

const BulkEmailMenuItems = (props: BulkEmailMenuItemsProps) => {
  const { menuItemsLabels, mode, isResponsiveItem, totalItems } = props;
  const classes = menuStyles(props);
  const ActiveStyle = [classes.controlMenuActive, classes.controlMenu];

  return (
    <>
      {menuItemsLabels.map(menuItem => {
        return (
          <>
            {menuItem.visible ? (
              <>
                <MenuItem
                  key={menuItem.id}
                  isResponsiveItem={isResponsiveItem}
                  className={mode === menuItem.item ? ActiveStyle : classes.controlMenu}
                  mode={menuItem.mode}
                  onClick={menuItem.onClick}
                  icon={menuItem.icon}
                  text={menuItem.menuItemText}
                  isResponsiveMode={menuItem.isResponsiveMode}
                  totalItems={totalItems}
                  isTotalItemsNeeeded={menuItem.isTotalItemsNeeeded}
                />
              </>
            ) : null}
          </>
        );
      })}
    </>
  );
};

type BulkEmailLayoutProps = {
  isBulk: boolean,
  onClick: any => void,
  handleAddEmailModal: any => void
};

const BulkEmailLayout = (props: BulkEmailLayoutProps) => {
  const { isBulk, onClick, handleAddEmailModal } = props;
  const [mode, setMode] = useState('sent');
  const [open, setOpen] = React.useState(false);

  const [template, setTemplate] = useState(false);

  const isResponsiveMode = useMediaQuery('(max-width: 1366px)');
  const isResponsiveHeight = useMediaQuery('(max-height: 768px)');

  const classes = useStyles(props);

  const handleSend = () => {
    setMode('sent');
  };

  const handleTemplate = () => {
    setMode('template');
    setTemplate(!template);
  };

  const handleDrafts = () => {
    setMode('drafts');
  };

  const handleSchedule = () => {
    setMode('schedule');
  };

  const handleEmail = () => {
    setMode('email');
  };

  const handleCreateTemplate = () => {
    setMode('createTemplate');
  };

  const handleCreationFolder = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sharedMenuProps = {
    isResponsiveMode,
    visible: true,
    mode
  };

  const menuItemsLabels = [
    {
      id: 1,
      ...sharedMenuProps,
      menuItemText: 'Sent',
      icon: <SendIcon fill={colors.oxford} size={isResponsiveMode ? 24 : 22} />,
      item: 'sent',
      onClick: handleSend
    },
    {
      id: 2,
      ...sharedMenuProps,
      menuItemText: 'Templates',
      icon: <TemplateIcon size={isResponsiveMode ? 24 : 22} />,
      item: 'template',
      onClick: handleTemplate,
      isTotalItemsNeeeded: false
    },
    {
      id: 3,
      ...sharedMenuProps,
      menuItemText: 'Drafts',
      icon: <DraftIcon size={isResponsiveMode ? 24 : 22} />,
      item: 'drafts',
      onClick: handleDrafts,
      isTotalItemsNeeeded: true
    },
    {
      id: 4,
      ...sharedMenuProps,
      menuItemText: 'Schedule Bulks',

      icon: <ScheduleIcon fill={colors.oxford} size={isResponsiveMode ? 24 : 22} />,
      item: 'schedule',
      onClick: handleSchedule,
      isTotalItemsNeeeded: true
    },
    {
      id: 5,
      ...sharedMenuProps,
      menuItemText: 'Opt in / Opt out',
      icon: <GearIcon fill={colors.oxford} size={isResponsiveMode ? 24 : 22} />,
      item: 'email',
      onClick: handleEmail,
      visible: isBulk
    }
  ];

  const totalElements = fileViewLabels.length;

  return (
    <>
      <Box className={classes.mainContainer} maxWidth={isResponsiveMode ? 991 : 1549}>
        <Box className={classes.head}>
          <TitleLabel backNavigation text={isBulk ? 'Bulk Email' : 'Email'} />
        </Box>
        <Box
          className={classes.areaContent}
          height={isResponsiveMode && isResponsiveHeight ? 520 : 700}
          gridTemplateColumns={
            isResponsiveMode
              ? ' 104px minmax(400px, 887px)'
              : 'minmax(200px, 250px) minmax(400px, 1299px)'
          }
        >
          <div className={classes.sideControls}>
            <Box className={classes.containerButton}>
              <ActionButton
                onClick={onClick}
                className={isResponsiveMode ? classes.actionButtonResponsive : classes.actionButton}
                text={isBulk ? 'Bulk Email' : 'Email'}
                variant="contained"
                isResponsive={isResponsiveMode}
                isWithoutText={isResponsiveMode}
              >
                <PlusIcon />
              </ActionButton>
            </Box>

            <BulkEmailMenuItems
              isResponsiveItem={isResponsiveMode}
              mode={mode}
              menuItemsLabels={menuItemsLabels}
              totalItems={totalElements}
            />
          </div>
          <div className={classes.infoContainer}>
            <BulkEmailContent
              isTemplate={template}
              isBulk={isBulk}
              mode={mode}
              onClick={handleCreateTemplate}
              handleAddEmailModal={handleAddEmailModal}
              onCancel={handleSend}
              handleNewItemSent={onClick}
              handleNewItemDraft={onClick}
              onNewTemplateClick={handleCreateTemplate}
              isContentSelected={false}
              handleModalCreation={onClick}
              fileViewLabels={fileViewLabels}
              isResponsiveItem={isResponsiveMode}
              onNewCreationFolder={handleCreationFolder}
              isWithActionButton={mode === 'sent'}
              text={mode === 'sent' ? 'foward' : 'null'}
              onTemplateSave={handleSend}
            />
          </div>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ModalNewFolderCreation />
        </Modal>
      </Box>
    </>
  );
};

BulkEmailLayout.defaultProps = {
  handleAddEmailModal: () => {}
};

export default BulkEmailLayout;
