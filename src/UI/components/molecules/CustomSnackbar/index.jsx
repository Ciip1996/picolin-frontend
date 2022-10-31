// @flow
import React, { forwardRef } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import {
  SuccessIcon,
  AnnouncementIcon,
  ErrorIcon,
  WarningIcon,
  CloseIcon,
  colors
} from 'UI/res';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import { icon as iconDimensions } from 'UI/constants/dimensions';
import {
  type notificationsType,
  notificationIcons
} from 'UI/constants/notifications';
import { THEME } from 'GlobalStyles';
import { useLanguage } from 'UI/utils';
import {
  useStyles,
  useNotificationStyles,
  useAlertStyles,
  styles
} from './styles';
import Contents from './strings';

type CustomSnackbarProps = {
  id: number,
  severity: 'warning' | 'info' | 'success' | 'error',
  title: string,
  code: string | null,
  body: string,
  isNotification: boolean,
  color: string,
  icon: notificationsType,
  onClick: () => void
};

const severityValues = {
  warning: {
    icon: <WarningIcon fill={colors.white} />,
    color: THEME.palette.warning.main
  },
  error: {
    icon: <ErrorIcon fill={colors.white} />,
    color: THEME.palette.error.main
  },
  info: {
    icon: <AnnouncementIcon fill={colors.white} />,
    color: THEME.palette.info.main
  },

  success: {
    icon: <SuccessIcon fill={colors.white} />,
    color: THEME.palette.success.main
  }
};

const ConditionalActionWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

const CustomSnackbar = forwardRef<CustomSnackbarProps, any>(
  (props: CustomSnackbarProps, ref: any) => {
    const {
      severity = 'info',
      title,
      code,
      body = '',
      isNotification,
      color = colors.darkGrey,
      icon,
      onClick = () => {}
    } = props;
    const language = useLanguage();

    const classes = useStyles({
      severity: isNotification ? null : severity
    });
    const alertClasses = useAlertStyles();
    const notificationClasses = useNotificationStyles();

    const { closeSnackbar } = useSnackbar();

    const handleDismiss = () => {
      closeSnackbar(props.id);
    };

    const notification = notificationIcons.find(n => {
      return n.key === icon;
    }) || { icon: <AnnouncementIcon /> };

    const Icon = () =>
      isNotification
        ? {
            ...notification?.icon,
            props: { fill: colors.black, size: iconDimensions.size }
          }
        : { ...severityValues[severity].icon, props: { fill: colors.white } };

    return (
      <Card className={classes.root} ref={ref}>
        <ConditionalActionWrapper
          condition={isNotification}
          wrapper={children => (
            <CardActionArea onClick={onClick}>{children}</CardActionArea>
          )}
        >
          {isNotification && (
            <div
              className={classes.indicator}
              style={{ backgroundColor: color }}
            />
          )}
          <MuiAlert
            icon={<Icon />}
            elevation={6}
            variant="filled"
            classes={isNotification ? notificationClasses : alertClasses}
            severity={!isNotification ? severity : undefined}
          >
            <div className={classes.textContainer}>
              <div className={classes.title} style={styles.truncateText}>
                {title} {code && `${Contents[language]?.labelCode} ${code}`}
              </div>
              <div className={classes.body} style={styles.truncateText}>
                {typeof body === 'string' ? body : JSON.stringify(body)}
              </div>
            </div>
          </MuiAlert>
        </ConditionalActionWrapper>
        <CardActions style={styles.buttonContainer}>
          <IconButton
            style={styles.closeButton}
            size="small"
            onClick={handleDismiss}
          >
            <CloseIcon fill={isNotification ? colors.black : colors.white} />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
);

export default CustomSnackbar;
