import React from 'react';
import { colors } from 'UI/res';
import VerifiedIcon from '@mui/icons-material/Verified';

const language =
  localStorage.getItem('language') || process.env.REACT_APP_DEFAULT_LANGUAGE;

const Contents = {
  English: {
    verified: 'Verified',
    notVerified: 'Not Verified'
  },
  Spanish: {
    verified: 'Existencia Verificada',
    notVerified: 'No Verificado'
  }
};

export const ExistencyVerifiedCellOptions = [
  // this mocks an endpoint
  { id: 0, title: Contents[language]?.notVerified },
  { id: 1, title: Contents[language]?.verified }
];

const ExistencyVerifiedCell = ({ value }) => {
  return (
    <div
      style={{
        color: value ? colors.verified : colors.darkGrey,
        fontWeight: 'bold'
      }}
    >
      {(value === undefined || value === null) && '--'}
      {value === 1 ? (
        <>
          <VerifiedIcon />
          {Contents[language]?.verified}
        </>
      ) : null}
      {value === 0 ? Contents[language]?.notVerified : null}
    </div>
  );
};

export default ExistencyVerifiedCell;
