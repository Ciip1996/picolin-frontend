// @flow
import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import { showAlert as showAlertAction } from 'actions/app';
import { getErrorMessage } from 'UI/utils';
import API from 'services/API';

type LinkEntitiesFormProps = {
  title: string,
  placeholder: string,
  sourceEntity: any,
  idFieldName: string,
  saveUrl: string,
  listUrl: string,
  additionalSearchColumns: string[],
  displayTemplate: (item: any) => any,
  onCompleted: (item: any) => void,
  onClosed: () => void,
  showAlert: any => void
};

const LinkEntitiesForm = (props: LinkEntitiesFormProps) => {
  const {
    title,
    placeholder,
    sourceEntity,
    idFieldName,
    saveUrl,
    listUrl,
    additionalSearchColumns,
    displayTemplate,
    onCompleted,
    onClosed,
    showAlert
  } = props;

  const [selectedItem, setSelectedItem] = useState();

  const form = useForm();

  const { register, errors, setValue } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  useEffect(() => {
    register({ name: idFieldName }, { required: `Please select a ${sourceEntity.singular}` });
  }, [register, sourceEntity, idFieldName]);

  const handleItemSelect = (name?: string, value: any) => {
    setSelectedItem(value);
    setValue(name, value ? value.id : value, true);
  };

  const getOptionSelected = (option, value) => option.id === value.id;

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.post(saveUrl, formData);
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: `The ${sourceEntity.singular} was matched successfully`
        });

        const newItem = response.data;
        onCompleted(newItem);
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title,
        body: getErrorMessage(err)
      });
    }
    setUiState(prevState => ({
      ...prevState,
      isSaving: false,
      isSuccess: false
    }));
  };

  return (
    <FormContext {...form}>
      <DrawerFormLayout
        title={title}
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onClosed}
        uiState={uiState}
      >
        <Box>
          <AutocompleteSelect
            name={idFieldName}
            selectedValue={selectedItem}
            placeholder={placeholder || `Search a ${sourceEntity.singular}`}
            url={listUrl}
            onSelect={handleItemSelect}
            getOptionSelected={getOptionSelected}
            error={!!errors[idFieldName]}
            errorText={errors[idFieldName] && errors[idFieldName].message}
            typeahead
            typeaheadLimit={50}
            typeaheadParams={{
              entityType: sourceEntity.id,
              inColumns: additionalSearchColumns.join(',')
            }}
            renderOption={displayTemplate}
          />
          {selectedItem && <Box my={4}>{displayTemplate(selectedItem)}</Box>}
        </Box>
      </DrawerFormLayout>
    </FormContext>
  );
};

LinkEntitiesForm.defaultProps = {
  additionalSearchColumns: []
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const LinkEntitiesFormConnected = connect(null, mapDispatchToProps)(LinkEntitiesForm);

export default LinkEntitiesFormConnected;
