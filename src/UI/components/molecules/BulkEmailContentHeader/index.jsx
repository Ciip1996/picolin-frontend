// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { inventorySectionHeader } from 'UI/constants/dimensions';
import { fuseStyles } from 'UI/utils';
import { MoreIcon, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { fileViewLabels } from 'UI/constants/mockData';
import ActionButton from 'UI/components/atoms/ActionButton';
import { styles } from './style';
import ButtonMenu from '../ButtonMenu';

type BulkEmailContentHeaderProps = {
  sectionHeaderTitle: string,
  placeHolder: string,
  isTemplateSection?: boolean,
  isWithOptions: boolean,
  isWithActionButton: boolean,
  text: string,
  MenuItems: Array<any>
};

const BulkEmailContentHeader = (props: BulkEmailContentHeaderProps) => {
  const {
    sectionHeaderTitle,
    placeHolder,
    isTemplateSection,
    isWithOptions,
    MenuItems,
    isWithActionButton,
    text
  } = props;

  const customStyle = fuseStyles([
    styles.autoCompleteBox,
    isTemplateSection ? styles.isTemplateSection : styles.defaultAutoComplete
  ]);

  return (
    <Box height={inventorySectionHeader} display="flex" alignItems="center">
      <div style={customStyle}>
        <Box margin="0 auto" maxWidth="90%">
          <AutocompleteSelect
            placeholder={placeHolder}
            getOptionLabel={option => option.bulkId}
            options={fileViewLabels}
          />
        </Box>
        <span style={styles.divider} />
      </div>
      <div style={styles.previewContainer}>
        {sectionHeaderTitle}
        {!isWithOptions && isWithActionButton && (
          <ActionButton
            variant="outlined"
            status="success"
            style={styles.actionButton}
            text={text}
          />
        )}

        {isWithOptions && (
          <ButtonMenu isIconButton MenuItems={MenuItems} width="200px">
            <MoreIcon size={18} fill={colors.darkGrey} />
          </ButtonMenu>
        )}
      </div>
    </Box>
  );
};

BulkEmailContentHeader.defaultProps = {
  isTemplateSection: false,
  isWithOptions: false,
  isWithActionButton: false,
  MenuItems: [],
  text: ''
};

export default BulkEmailContentHeader;
