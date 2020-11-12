// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import Contents from './string';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SalesSummaryProps = {
  cash: string,
  card: string
};

const SalesSummary = (props: SalesSummaryProps) => {
  const { cash, card } = props;
  const classes = useStyles();
  return (
    <Card className={classes.content}>
      <ListItem>
        <ListItemText
          primary={<span className={classes.Description}>{Contents[language].cash}</span>}
        />
        <ListItemText secondary={<Chip label={cash} className={classes.cash} />} />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<span className={classes.Description}>{Contents[language].card}</span>}
        />
        <ListItemText secondary={<Chip label={card} className={classes.card} />} />
      </ListItem>
    </Card>
  );
};

export default SalesSummary;
