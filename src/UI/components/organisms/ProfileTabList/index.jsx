// @flow
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { TabCardDefinition } from 'types/app';

import { globalStyles } from 'GlobalStyles';
import { EmptyActivityLogs } from 'UI/res/images';
import ActionButton from 'UI/components/atoms/ActionButton';
import ProfileTabListCard from 'UI/components/molecules/ProfileTabListCard';
import { AddIcon, colors } from 'UI/res';
import { styles } from './styles';

type ProfileTabListProps = {
  loading: boolean,
  items: any[],
  addButtonText: string,
  emptyPlaceholderTitle: string,
  emptyPlaceholderSubtitle: string,
  emptyStateImage: typeof EmptyActivityLogs,
  cardDefinition?: TabCardDefinition,
  onNewClick?: () => any,
  onEditClick?: (item: any) => void,
  onItemClick?: (item: any) => void,
  onDeleteClick?: (item: any) => void,
  isWithLargeContent: boolean
};

const ProfileTabList = (props: ProfileTabListProps) => {
  const {
    loading,
    items,
    addButtonText,
    cardDefinition,
    emptyPlaceholderTitle,
    emptyPlaceholderSubtitle,
    emptyStateImage: EmptyStateImage,
    onNewClick,
    onEditClick,
    onItemClick,
    onDeleteClick,
    isWithLargeContent
  } = props;

  return (
    <>
      {!loading ? (
        <>
          {items.length === 0 ? (
            <EmptyPlaceholder title={emptyPlaceholderTitle} subtitle={emptyPlaceholderSubtitle}>
              <EmptyStateImage width="20vh" style={styles.spacing} />
              <ActionButton
                isWithLargeContent={isWithLargeContent}
                text={addButtonText}
                type="button"
                onClick={onNewClick}
                width="100px"
              >
                <AddIcon size={18} fill={colors.white} />
              </ActionButton>
            </EmptyPlaceholder>
          ) : (
            <div style={styles.root}>
              {items.map(item => (
                <ProfileTabListCard
                  key={item.id}
                  item={item}
                  definition={cardDefinition}
                  onEditClick={onEditClick}
                  onItemClick={onItemClick}
                  onDeleteClick={onDeleteClick}
                />
              ))}
              <div style={globalStyles.floatingButtonContainer}>
                <Tooltip title={addButtonText} placement="left">
                  <Fab
                    onClick={onNewClick}
                    size="medium"
                    component="span"
                    color="primary"
                    variant="round"
                    aria-label="add"
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={styles.loadingStateContainer}>
          <EmptyPlaceholder title="Loading content." subtitle="Please hang on.">
            <CircularProgress />
          </EmptyPlaceholder>
        </div>
      )}
    </>
  );
};

ProfileTabList.defaultProps = {
  addButtonText: 'ADD NEW',
  emptyPlaceholderTitle: 'Nothing done yet! Let’s add some.',
  emptyPlaceholderSubtitle: 'To create one, click on the + button.',
  emptyStateImage: EmptyActivityLogs,
  cardDefinition: { showAvatar: false, infoLabelsResolver: () => [] },
  onNewClick: undefined,
  onEditClick: undefined,
  onItemClick: undefined,
  onDeleteClick: undefined,
  isWithLargeContent: false
};

export default ProfileTabList;
