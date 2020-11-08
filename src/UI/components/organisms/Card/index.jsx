import React from 'react';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { AddIcon, colors } from 'UI/res';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

// const payment = [
// { id: 0, title: Contents[language]?.cash },
// { id: 1, title: Contents[language]?.card }
// ];

export default function NewSale() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>{Contents[language].Resume}</h1>
      <AutocompleteSelect
        className={classes.textbox1}
        name="date_filter"
        placeholder={Contents[language]?.Payment}
        // url={Endpoints.Stores}
        // selectedValue={filters.date_filter}
        // onSelect={handleFilterChange}
        // defaultOptions={init}
      />
      <TextBox
        className={classes.textbox2}
        name="payment"
        label={Contents[language].Discount}
        type="text"
        // inputRef={register({
        //  required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
        // })}
        // error={!!errors.pwd}
        // helperText={errors.pwd && errors.pwd.message}
      />
      <TextBox
        className={classes.textbox2}
        name="apart"
        label={Contents[language].Apart}
        type="text"
        // inputRef={register({
        //  required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
        // })}
        // error={!!errors.pwd}
        // helperText={errors.pwd && errors.pwd.message}
      />
      <FormControlLabel
        value="start"
        className={classes.Control}
        control={<Switch color="primary" />}
        label={Contents[language].invoice}
        labelPlacement="start"
      />
      <List component="nav" className={classes.List}>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.lblList}>{Contents[language].Deposit}</span>}
          />
          <ListItemText secondary={<span className={classes.lblList2}>N/A</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText primary={<span className={classes.lblList}>{Contents[language].Subtotal}</span>} />
          <ListItemText secondary={<span className={classes.lblList2}>$1299.00</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText primary={<span className={classes.lblList}>{Contents[language].Taxes}</span>} />
          <ListItemText secondary={<span className={classes.lblList2}>$207.84</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText primary={<span className={classes.lblList}>{Contents[language].lblDiscount}</span>} />
          <ListItemText secondary={<span className={classes.lblList2}>$0.00</span>} />
        </ListItem>
        <br />
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.lblList3}>TOTAL</span>} />
          <ListItemText secondary={<span className={classes.lblList4}>$1506.84</span>} />
        </ListItem>
      </List>
      <ActionButton
        className={classes.Button}
        text={Contents[language].Conclude}
        // onClick={toggleDrawer('isAddProductDrawerOpen', !uiState.isAddProductDrawerOpen)}
      >
        <AddIcon fill={colors.white} size={18} />
      </ActionButton>
    </Card>
  );
}
