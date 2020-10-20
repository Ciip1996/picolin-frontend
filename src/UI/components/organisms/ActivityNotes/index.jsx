// @flow
import React from 'react';
import { connect } from 'react-redux';
import ActivityNoteCard from 'UI/components/molecules/ActivityNoteCard';
import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { getErrorMessage, nestTernary } from 'UI/utils/index';

import API from 'services/API';
import ActionButton from 'UI/components/atoms/ActionButton';
import { globalStyles } from 'GlobalStyles';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import CircularProgress from '@material-ui/core/CircularProgress';
import { EmptyActivityLogs, EmptyNotes, AddIcon, colors } from 'UI/res';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

import { styles } from './styles';

type ActivityNotesProps = {
  loading: boolean,
  items: any[],
  type: 'activity' | 'note',
  endpoint: string,
  showAlert: any => void,
  onItemsChange: (type: string, items: any[]) => void,
  onNewClick: (type: string) => void,
  onEditClick: (type: string, item: any) => void,
  onItemClick: (type: string, item: any) => void,
  showConfirm: any => void
};

const ActivityNotes = (props: ActivityNotesProps) => {
  const {
    loading,
    items,
    type,
    endpoint,
    showAlert,
    showConfirm,
    onItemsChange,
    onNewClick,
    onEditClick,
    onItemClick
  } = props;

  const handleDeleteClick = async (itemId: number) => {
    showConfirm({
      severity: 'warning',
      title: 'Please confirm',
      message: `Are you sure you want to delete this ${type}?`,
      onConfirm: async ok => {
        if (!ok) {
          return;
        }

        try {
          const response = await API.delete(`${endpoint}/${itemId}`);
          if (response.status === 200) {
            const newItems = items.filter(item => item.id !== itemId);
            onItemsChange(type, newItems);
            showAlert({
              severity: 'success',
              title: 'Awesome',
              body: `The ${type} was deleted successfully`
            });
          }
        } catch (error) {
          showAlert({
            severity: 'error',
            title: 'Error',
            body: getErrorMessage(error)
          });
        }
      }
    });
  };

  const handleEditClick = (itemId: number) => {
    onEditClick(
      type,
      items.find(item => item.id === itemId)
    );
  };

  const handleItemClick = (itemId: number) => {
    onItemClick(
      type,
      items.find(item => item.id === itemId)
    );
  };

  return (
    <>
      {!loading ? (
        <>
          {items.length === 0 ? (
            nestTernary(
              type === 'activity',
              <EmptyPlaceholder
                title="Nothing done yet! Let’s register your activities."
                subtitle="To create one, click on the + button."
              >
                <EmptyActivityLogs width="20vh" style={styles.spacing} />

                <ActionButton
                  text="ACTIVITY"
                  type="button"
                  onClick={() => onNewClick(type)}
                  width="100px"
                  iconPosition="left"
                >
                  <AddIcon fill={colors.white} size={18} />
                </ActionButton>
              </EmptyPlaceholder>,
              <EmptyPlaceholder
                title="You don’t have any notes. This space is made specially for you."
                subtitle=" To create a note, click on the + button"
              >
                <EmptyNotes width="20vh" style={styles.spacing} />

                <ActionButton
                  text="NOTE"
                  type="button"
                  onClick={() => onNewClick(type)}
                  width="100px"
                  iconPosition="left"
                >
                  <AddIcon fill={colors.white} size={18} />
                </ActionButton>
              </EmptyPlaceholder>
            )
          ) : (
            <div style={styles.root}>
              {items.map(item => (
                <ActivityNoteCard
                  key={item.id}
                  item={item}
                  title={type === 'activity' ? item.activityLogType.title : item.title || 'Note'}
                  onDeleteClick={handleDeleteClick}
                  onEditClick={handleEditClick}
                  onClick={handleItemClick}
                />
              ))}
              <div style={globalStyles.floatingButtonContainer}>
                <Tooltip
                  title={type === 'activity' ? 'ADD NEW ACTIVITY' : 'ADD NEW NOTE'}
                  placement="left"
                >
                  <Fab
                    onClick={() => onNewClick(type)}
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

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

const ActivityNotesConnected = connect(null, mapDispatchToProps)(ActivityNotes);

export default ActivityNotesConnected;
