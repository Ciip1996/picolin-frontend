// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import TextBox from 'UI/components/atoms/TextBox';
import { minWidthTextBox } from 'UI/constants/dimensions';
import InputContainer from 'UI/components/atoms/InputContainer';
import IconButton from '@material-ui/core/IconButton';
import { DeleteIcon, EditIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { colors } from 'UI/res/colors';
import { contentIcon, dividerColor } from './styles';

type HiringAuthorityPreviewProps = {
  data: Array<any>,
  onHiringAuthorityEdit: (item: any) => void,
  onHiringAuthorityDelete: (item: any) => void
};

const HiringAuthorityPreview = (props: HiringAuthorityPreviewProps) => {
  const { data, onHiringAuthorityEdit, onHiringAuthorityDelete } = props;

  const handleEditClick = item => {
    onHiringAuthorityEdit && onHiringAuthorityEdit(item);
  };

  const handleDeleteClick = item => {
    onHiringAuthorityDelete && onHiringAuthorityDelete(item);
  };

  return (
    <div>
      {data.length > 0 &&
        data.map((item, index) => {
          const isExistingHA = item.id && item.hiring_authority_id;
          return (
            <Box
              display="flex"
              flexWrap="wrap"
              maxWidth={1360}
              width="100%"
              key={index.toString()}
              pr={4}
              py={1}
            >
              <Box width="100%" display="flex" px={6}>
                <div style={contentIcon}>
                  {/* Edition is not allowed here for previously existing HA */}
                  {!isExistingHA && (
                    <IconButton aria-label="edit" onClick={() => handleEditClick(item)}>
                      <EditIcon fontSize="small" fill={colors.black} />
                    </IconButton>
                  )}
                  <IconButton aria-label="delete" onClick={() => handleDeleteClick(item)}>
                    <DeleteIcon fontSize="small" fill={colors.black} />
                  </IconButton>
                </div>
              </Box>
              <InputContainer>
                <TextBox
                  label="First Name"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="first_name"
                  disabled
                  value={item.first_name}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Last Name"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="last_name"
                  disabled
                  value={item.last_name}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Industry: Specialty"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="specialty"
                  disabled
                  value={`${item.specialty?.industry_title || item.specialty?.industry?.title}: ${
                    item.specialty?.title
                  }`}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Subspecialty"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="subspecialty"
                  disabled
                  value={item.subspecialty_id ? item.subspecialty.title : ''}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Functional title"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="position"
                  disabled
                  value={item.position?.title}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Title"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="title"
                  disabled
                  value={item.title}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Email"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="work_email"
                  disabled
                  value={item.work_email}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Phone"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="work_phone"
                  disabled
                  value={item.work_phone}
                  inputType="phone"
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="ext"
                  label="Ext"
                  placeholder="999"
                  minWidth={minWidthTextBox}
                  value={item.ext}
                  disabled
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Other Email"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="personal_email"
                  disabled
                  value={item.personal_email}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  label="Other Phone"
                  width="100%"
                  minWidth={minWidthTextBox}
                  name="personal_phone"
                  disabled
                  value={item.personal_phone}
                  inputType="phone"
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="other_ext"
                  label="Ext"
                  placeholder="999"
                  minWidth={minWidthTextBox}
                  value={item.other_ext}
                  disabled
                />
              </InputContainer>
              <Box width="100%" display="flex">
                {data.length > 1 && index - 1 < data.length - 2 && <div style={dividerColor} />}
              </Box>
            </Box>
          );
        })}
    </div>
  );
};

HiringAuthorityPreview.defaultProps = {};

export default HiringAuthorityPreview;
