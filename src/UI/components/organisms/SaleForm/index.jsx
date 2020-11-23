// @flow
import React, { useState, useEffect, Component } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

// import { PRODUCT_DESCRIPTION_VALIDATION } from 'UI/utils';
import type { MapType } from 'types';
// import InputContainer from 'UI/components/atoms/InputContainer';

import ActionButton from 'UI/components/atoms/ActionButton';
import Contents from './strings';
import { useStyles } from './styles';

type SaleFormProps = {
  initialValues: MapType
};

const SaleForm = (props: SaleFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');
  const classes = useStyles();
  const [comboValues, setComboValues] = useState<MapType>(initialValues);

  const { errors } = useFormContext();

  /* useEffect(() => {
    register({ name: 'diaperRacks' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'footwear' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'Sabana' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'Ajuar' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [language, register]); */

  const handleSubmit = e => {
    e.preventDefault();
    console.log(form);
  };
  // class Contact extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       DiaperRacks: '',
  //       footwear: '',
  //       Sabana: '',
  //       Ajuar: ''
  //     };
  //     this.DiaperRacksChange = this.DiaperRacksChange.bind(this);
  //     this.footwearChange = this.footwearChange.bind(this);
  //     this.SabanaChange = this.SabanaChange.bind(this);
  //     this.AjuarChange = this.AjuarChange.bind(this);
  //   }

  //   DiaperRacksChange(e) {
  //     this.setState({
  //       DiaperRacks: e.target.value
  //     });
  //   }

  //   footwearChange(e) {
  //     this.setState({
  //       footwear: e.target.value
  //     });
  //   }

  //   SabanaChange(e) {
  //     this.setState({
  //       Sabana: e.target.value
  //     });
  //   }

  //   AjuarChange(e) {
  //     this.setState({
  //       Ajuar: e.target.value
  //     });
  //   }

  // render() {
  const [form, setDiaperRacks] = useState({ DiaperRacks: '', footwear: '', Sabana: '', Ajuar: '' });
  // const [DiaperRacks, setDiaperRack] = useState({ DiaperRacks: '', footwear: '' });

  const DiaperRack = [
    { id: 0, title: 'Vestido Azul' },
    { id: 1, title: 'Vestido Rojo' }
  ];

  const footwear = [
    { id: 0, title: 'Calzado Azul' },
    { id: 1, title: 'Calzado Rojo' }
  ];

  const Sabana = [
    { id: 0, title: 'Sabana Azul' },
    { id: 1, title: 'Sabana Rojo' }
  ];

  const Ajuar = [
    { id: 0, title: 'Ajuar Azul' },
    { id: 1, title: 'Ajuar Rojo' }
  ];

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <form onSubmit={handleSubmit}>
        <br />
        <span className={classes.title}>{Contents[language].AddPackages}</span>
        <AutocompleteSelect
          // name="diaperRacks" // TODO: Check the real translation os this word
          // selectedValue={comboValues.diaperRacks}
          value={form.DiaperRacks}
          className={classes.Formulary}
          // onChange={e => setDiaperRack(e.target.value)}
          onChange={e => setDiaperRacks({ ...form, DiaperRacks: e.target.value })}
          placeholder={Contents[language]?.diaperRacks}
          error={!!errors?.diaperRacks}
          errorText={errors?.diaperRacks && errors?.diaperRacks?.message}
          defaultOptions={DiaperRack}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
        <AutocompleteSelect
          // name="footwear" // TODO: Check the real translation os this word
          // selectedValue={comboValues.footwear}
          className={classes.Formulary}
          type="text"
          value={form.footwear}
          onChange={e => setDiaperRacks({ ...form, footwear: e.target.value })}
          placeholder={Contents[language]?.footwear}
          error={!!errors?.footwear}
          errorText={errors?.footwear && errors?.footwear.message}
          defaultOptions={footwear}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />

        <AutocompleteSelect
          // name="Sabana" // TODO: Check the real translation os this word
          // selectedValue={comboValues.Sabana}
          className={classes.Formulary}
          type="text"
          value={form.Sabana}
          onChange={e => setDiaperRacks({ ...form, Sabana: e.target.value })}
          placeholder={Contents[language]?.Sabana}
          error={!!errors?.Sabana}
          errorText={errors?.Sabana && errors?.Sabana.message}
          defaultOptions={Sabana}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
        <AutocompleteSelect
          // name="Ajuar" // TODO: Check the real translation of this word too
          // selectedValue={comboValues.Ajuar}
          className={classes.Formulary}
          type="text"
          value={form.Ajuar}
          onChange={e => setDiaperRacks({ ...form, Ajuar: e.target.value })}
          placeholder={Contents[language]?.Ajuar}
          error={!!errors?.Ajuar}
          errorText={errors?.Ajuar && errors?.Ajuar.message}
          defaultOptions={Ajuar}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
        <br />
        <span>{JSON.stringify(form)}</span>
        <center>
          <br />
          <br />
          <br />
          <ActionButton text={Contents[language].Add} type="submit" />
        </center>
      </form>
    </Box>
  );
  // }
  // }
};

SaleForm.defaultProps = {
  initialValues: {}
};

export default SaleForm;
