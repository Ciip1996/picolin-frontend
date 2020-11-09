import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
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
            primary={<span className={classes.title}>Ropón Mini: Ariete Blanco dffaf</span>}
          />
          <ListItemText secondary={<span className={classes.subtitle}>$399.00</span>} />
        </ListItem>
      </List>
      <Grid container>
        <Grid item xs={12} sm={2}>
          <Chip label="Basic" className={classes.Gender} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Chip label="Basic" className={classes.Size} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Chip label="Talla 1" className={classes.Type} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Chip label="Basic" className={classes.Color} />
        </Grid>
      </Grid>
      <IconButton className={classes.Delete} aria-label="delete">
        <CloseIcon />
      </IconButton>
    </Card>
  );
}
