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

type SummaryCardProps = {
  subtotal: string
};

const SummaryCard = (props: SummaryCardProps) => {
  const { subtotal } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {subtotal}
      <h1 className={classes.title}>{Contents[language]?.HeaderTitle}</h1>
      <AutocompleteSelect
        className={classes.Payment}
        name="date_filter"
        placeholder={Contents[language]?.Payment}
        // url={Endpoints.Stores}
        // selectedValue={filters.date_filter}
        // onSelect={handleFilterChange}
        // defaultOptions={init}
      />
      <TextBox
        className={classes.Formulary}
        name="payment"
        label={Contents[language]?.Discount}
        type="text"
        // inputRef={register({
        //  required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
        // })}
        // error={!!errors.pwd}
        // helperText={errors.pwd && errors.pwd.message}
      />
      <TextBox
        className={classes.Formulary}
        name="apart"
        label={Contents[language]?.Apart}
        type="text"
        // inputRef={register({
        //  required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
        // })}
        // error={!!errors.pwd}
        // helperText={errors.pwd && errors.pwd.message}
      />
      <FormControlLabel
        value="start"
        className={classes.Invoice}
        control={<Switch color="primary" />}
        label={Contents[language]?.invoice}
        labelPlacement="start"
      />
      <List component="nav" className={classes.List}>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Deposit}</span>}
          />
          <ListItemText secondary={<span className={classes.CostDescription}>N/A</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Subtotal}</span>}
          />
          <ListItemText secondary={<span className={classes.CostDescription}>{subtotal}</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Taxes}</span>}
          />
          <ListItemText secondary={<span className={classes.CostDescription}>$207.84</span>} />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.lblDiscount}</span>}
          />
          <ListItemText secondary={<span className={classes.CostDescription}>$0.00</span>} />
        </ListItem>
        <br />
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.Total}>TOTAL</span>} />
          <ListItemText secondary={<span className={classes.TotalCost}>$1506.84</span>} />
        </ListItem>
      </List>
      <ActionButton
        className={classes.Finish}
        text={Contents[language]?.Conclude}
        // onClick={toggleDrawer('isAddProductDrawerOpen', !uiState.isAddProductDrawerOpen)}
      >
        <AddIcon fill={colors.white} size={18} />
      </ActionButton>
    </Card>
  );
}

SummaryCard.defaultProps = {
  subtotal:'1200'
};

export default SummaryCard;
