import React from 'react';
import { colors } from 'UI/res';

const language =
  localStorage.getItem('language') || process.env.REACT_APP_DEFAULT_LANGUAGE;

const Contents = {
  English: {
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  Spanish: {
    enabled: 'Activo',
    disabled: 'Inactivo'
  }
};

export const StatusLabelOptions = [
  // this mocks an endpoint
  { id: 0, title: Contents[language]?.disabled },
  { id: 1, title: Contents[language]?.enabled }
];

const StatusLabel = ({ value }) => {
  return (
    <div
      style={{
        color: value ? colors.active : colors.error,
        fontWeight: 'bold'
      }}
    >
      {(value === undefined || value === null) && '--'}
      {value === 1 ? Contents[language]?.enabled : null}
      {value === 0 ? Contents[language]?.disabled : null}
    </div>
  );
};

export default StatusLabel;
