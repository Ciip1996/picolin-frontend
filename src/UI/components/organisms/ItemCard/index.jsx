import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

// const payment = [
// { id: 0, title: Contents[language]?.cash },
// { id: 1, title: Contents[language]?.card }
// ];

export default function NewSale() {
  const classes = useStyles();
  const [selected, setSelected] = React.useState(false);
  return (
    <Card className={classes.card}>
      <List component="nav" className={classes.List}>
        <ListItem className={classes.Item}>
          <ListItemText
            primary={<span className={classes.title}>Ropón Mini: Ariete Blanco</span>}
          />
          <ListItemText secondary={<span className={classes.title2}>$399.00</span>} />
        </ListItem>
      </List>
      <Chip label="Basic" className={classes.Chip} />
      <Chip label="Basic" className={classes.Chip2} />
      <Chip label="Basic" className={classes.Chip2} />
      <Chip label="Basic" className={classes.Chip2} />
      <IconButton className={classes.Circle} aria-label="delete">
        <CloseIcon />
      </IconButton>
    </Card>
  );
}
