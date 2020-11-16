// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { currencyFormatter } from 'UI/utils';
import { useStyles } from './styles';
// const payment = [
// { id: 0, title: Contents[language]?.cash },
// { id: 1, title: Contents[language]?.card }
// ];
type ItemCardProps = {
  gender: string,
  size: number,
  type: string,
  color: string,
  cost: number,
  description: string,
  characteristic: string
};

const ItemCard = (props: ItemCardProps) => {
  const { gender, size, type, color, cost, description, characteristic } = props;
  const classes = useStyles();
  // const language = localStorage.getItem('language');

  // const [selected, setSelected] = React.useState(false);
  return (
    <Card className={classes.card}>
      <List component="nav" className={classes.List}>
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.title}>{description}</span>} />
          <ListItemText
            secondary={<span className={classes.subtitle}>{currencyFormatter(cost)}</span>}
          />
        </ListItem>
      </List>
      <Grid container>
        <Grid item sm={2}>
          <Chip label={gender} className={classes.Chip} />
        </Grid>
        <Grid item sm={2}>
          <Chip label={`Talla ${size}`} className={classes.Chip} />
        </Grid>
        <Grid item sm={2}>
          <Chip label={type} className={classes.Chip} />
        </Grid>
        <Grid item sm={2}>
          <Chip label={color} className={classes.Chip} />
        </Grid>
        <Grid item sm={2}>
          <Chip label={characteristic} className={classes.Chip} />
        </Grid>
      </Grid>
      <IconButton className={classes.Delete} aria-label="delete">
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

ItemCard.defaultProps = {
  gender: 'Niña',
  size: 24,
  type: 'Ropón',
  color: 'Blanco',
  cost: 999999.98,
  description: 'Ropón Mini: Ariete Blanco ',
  characteristic: 'Chantung de seda'
};
export default ItemCard;
