import React from 'react';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

const CellSkeleton = ({ children, searching }) => {
  return searching ? (
    <CustomSkeleton width="90%" height={18} />
  ) : (
    <>{children}</>
  );
};

export default CellSkeleton;
