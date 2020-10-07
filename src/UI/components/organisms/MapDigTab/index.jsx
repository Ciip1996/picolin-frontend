// @flow
import React from 'react';
import { connect } from 'react-redux';

/** Material Assets and Components */
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

/** Atoms, Components and Styles */
import SideFiltersLayout from 'UI/components/templates/SideFiltersLayout';
import UserCard from 'UI/components/molecules/UserCard';

import { styles } from './styles';

type MapDigTabProps = {
  recruiters: Array<Object>
};
const includeFilters = [
  'keyword',
  'industry',
  'specialty',
  'subspecialty',
  'coach',
  'recruiter',
  'state'
];

const MapDigTab = (props: MapDigTabProps) => {
  const { recruiters } = props;

  return (
    <>
      <Box px={3} py={1}>
        <SideFiltersLayout section="dig" includeFilters={includeFilters} defaultFilters={{}} />
      </Box>
      {recruiters.length > 0 ? (
        <Box height="calc(100vh - 440px)" style={styles.UserContainer}>
          {recruiters.map(item => (
            <UserCard
              key={item.id}
              name={item.full_name}
              industry={item.industry_title}
              initials={item.initials}
              color={item.color}
              info={item}
            />
          ))}
        </Box>
      ) : null}
    </>
  );
};

const mapStateToProps = ({ map }) => {
  return {
    recruiters: map.domain.recruiters
  };
};

const MapDigTabConnected = connect(mapStateToProps, null)(MapDigTab);

export default MapDigTabConnected;
