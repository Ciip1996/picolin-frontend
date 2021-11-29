// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

import { styles, useStyles } from './styles';

type NotificationsSkeletonProps = {
  rows: number
};

const NotificationsSkeleton = (props: NotificationsSkeletonProps) => {
  const classes = useStyles();
  const { rows } = props;

  return (
    <>
      {Array.from(Array(rows)).map((each, i) => (
        <Card className={classes.root} key={i.toString()}>
          <CardActions style={styles.iconContainer}>
            <CustomSkeleton
              variant="circle"
              width={20}
              height={20}
              style={styles.icon}
            />
          </CardActions>
          <CardContent>
            <div className={classes.textContainer}>
              {Array.from(Array(3)).map((e, j) => (
                <div key={j.toString()} style={styles.title}>
                  <CustomSkeleton width="100%" height={10} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardActions style={styles.indicatorContainer}>
            <CustomSkeleton
              variant="circle"
              width={12}
              height={12}
              style={styles.indicator}
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
};

NotificationsSkeleton.defaultProps = {
  rows: 10
};

export default NotificationsSkeleton;
