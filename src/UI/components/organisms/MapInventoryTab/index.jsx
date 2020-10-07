// @flow
import React from 'react';

/** Material Assets and Components */

// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

/** Atoms, Components and Styles */
import SideFiltersLayout from 'UI/components/templates/SideFiltersLayout';

import { entityTypes } from 'UI/constants/entityTypes';
import { styles } from './styles';

const includeFilters = [
  'entityType',
  'keyword',
  'industry',
  'specialty',
  'subspecialty',
  'position',
  'type',
  'coach',
  'recruiter',
  'state',
  'zip',
  'radius'
];

const defaultFilters = { entityType: entityTypes[0] };

const MapInventoryTab = () => {
  return (
    <>
      <Box style={styles.InventoryContainer}>
        <SideFiltersLayout
          section="inventory"
          includeFilters={includeFilters}
          defaultFilters={defaultFilters}
        />
      </Box>
    </>
  );
};

export default MapInventoryTab;
