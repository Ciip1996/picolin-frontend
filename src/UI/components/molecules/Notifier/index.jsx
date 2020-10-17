// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';

import { hideAlert, showAlert } from 'actions/app';
import {
  getTotal as getTotalAction,
  addNotification as addNotificationAction,
  markNotificationAsRead as markNotificationAsReadAction
} from 'actions/notification';

import CustomSnackbar from 'UI/components/molecules/CustomSnackbar';
import DecisionDialog from 'UI/components/organisms/DecisionDialog';

// import { messaging } from 'services/Firebase';
import { isNotificationAvailable } from 'services/FirebaseMessaging';
import { isAuthenticated } from 'services/Authentication';

let displayed = [];

const Notifier = props => {
  const {
    alerts,
    confirmation,
    onHideAlert,
    onShowAlert,
    getTotal,
    addNotification,
    markNotificationAsRead,
    history
  } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = id => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = id => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  useEffect(() => {
    if (isNotificationAvailable) {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.onmessage = (event: any) => {
          const { data, type } = event.data;

          if (type === 'BACKGROUND_MESSAGE_NOTIFICATION') {
            addNotification(data);
          } else if (type === 'CLICK_BACKGROUND_MESSAGE_NOTIFICATION') {
            getTotal();
          } else if (event.data?.firebaseMessaging?.type === 'push-received') {
            const { data: payload } = event.data.firebaseMessaging.payload;
            const { title, code, body, icon, color, click_action } = payload;

            addNotification(payload);

            onShowAlert({
              isNotification: true,
              title,
              code,
              body,
              icon,
              color,
              autoHideDuration: 4000,
              onClick: () => {
                markNotificationAsRead(payload);
                history.push(click_action);
              }
            });
          }
        };
      }
    }
  }, [addNotification, onShowAlert, markNotificationAsRead, getTotal, history]);

  useEffect(() => {
    if (isAuthenticated()) {
      getTotal();
    }
  }, [getTotal]);

  useEffect(() => {
    alerts.forEach(
      ({
        key,
        title,
        code,
        body,
        autoHideDuration,
        severity,
        options = {},
        isNotification = false,
        color,
        icon,
        onClick
      }) => {
        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        enqueueSnackbar(body, {
          key,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          autoHideDuration: autoHideDuration || 4000,
          onExited: (event, myKey) => {
            onHideAlert && onHideAlert(myKey);
            removeDisplayed(myKey);
          },
          content: (myKey, message) => (
            <CustomSnackbar
              id={myKey}
              body={message}
              severity={severity}
              title={title}
              code={code}
              isNotification={isNotification}
              color={color}
              icon={icon}
              onClick={onClick}
            />
          ),
          ...options
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      }
    );
  }, [alerts, closeSnackbar, enqueueSnackbar, onHideAlert]);

  return confirmation ? (
    <DecisionDialog
      withButtons="YesNo"
      severity={confirmation.severity}
      title={confirmation.title}
      message={confirmation.message}
      onConfirm={confirmation.onConfirm}
      confirmButtonText={confirmation.confirmButtonText}
      cancelButtonText={confirmation.cancelButtonText}
    />
  ) : null;
};

const mapStateToProps = ({ app }) => {
  return {
    alerts: app.ui.alerts,
    confirmation: app.ui.confirmation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHideAlert: key => dispatch(hideAlert(key)),
    onShowAlert: alert => dispatch(showAlert(alert)),
    getTotal: () => dispatch(getTotalAction()),
    markNotificationAsRead: notification => dispatch(markNotificationAsReadAction(notification)),
    addNotification: notification => dispatch(addNotificationAction(notification))
  };
};

const NotifierConnected = connect(mapStateToProps, mapDispatchToProps)(withRouter(Notifier));

export default NotifierConnected;
