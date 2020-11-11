import React from 'react';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { AddIcon, colors } from 'UI/res';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

// const payment = [
// { id: 0, title: Contents[language]?.cash },4
// { id: 1, title: Contents[language]?.card }
// ];

type SummaryCardProps = {
  total: string,
  subtotal: string,
  data: string
};

const SummaryCard = (props: SummaryCardProps) => {
  const { data, subtotal, total } = props;
  const classes = useStyles();
  debugger;
  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>DETALLE DE VENTA</h1>
      <List component="nav" className={classes.List}>
        <div>
          <ListItem divider className={classes.Item}>
            <ListItemText primary={<span className={classes.Description}>{data.title}</span>} />
            <ListItemText
              secondary={<span className={classes.CostDescription}>{data.content}</span>}
            />
          </ListItem>
        </div>
        <br />
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.Total}>TOTAL</span>} />
          <ListItemText secondary={<span className={classes.TotalCost}>{total}</span>} />
        </ListItem>
      </List>
    </Card>
  );
};

SummaryCard.defaultProps = {
  subtotal: '$1,299.00',
  total: '$1506.84',
  data: [
    { title: '1 ROPON mini ariete blanco', content: '$1,200.00' },
    { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' },
    { title: '1 CALZADO NIÑA NACAR', content: '$119.5' },
    { title: '1 PAÑALEROS BEIGE', content: '$160.0' },
    { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' },
    { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' }
  ]
};

export default SummaryCard;
