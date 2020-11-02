// @flow
import React from 'react';

import Chip from '@material-ui/core/Chip';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import type { Filters } from 'types/app';
import { useStyles } from './styles';
import Contents from './strings';

type ActiveFiltersProps = {
  filters: Filters,
  isLoading: boolean,
  onFilterRemove: any => any,
  onReset: () => void
};

const ActiveFilters = (props: ActiveFiltersProps) => {
  const { filters, isLoading, onFilterRemove, onReset } = props;
  const classes = useStyles();
  const language = localStorage.getItem('language');

  const handleDeleteClick = (filterId: string) => {
    onFilterRemove && onFilterRemove(filterId);
  };

  const activeFilters = filters
    ? Object.keys(filters)
        .map(key => ({ id: key, value: filters[key]?.value || filters[key] }))
        .filter(filter => filter.value)
    : {};

  const filtersSkeleton = (numberOfFilters: number) => {
    return Array.from({ length: numberOfFilters + 1 })
      .map((_, index) => index)
      .map(index => <CustomSkeleton key={`filter-${index}`} width="10%" height={30} radius={15} />);
  };

  return (
    activeFilters.length > 0 && (
      <div className={classes.root}>
        {isLoading ? (
          filtersSkeleton(activeFilters.length)
        ) : (
          <>
            <b>Filters: </b>
            {activeFilters.map(filter => (
              <Chip
                key={filter.id}
                label={filter.value.title || filter.value.full_name || filter.value}
                onDelete={() => {
                  handleDeleteClick(filter.id);
                }}
                color="primary"
                className={classes.chip}
              />
            ))}
            {activeFilters.length > 1 && (
              <Chip
                label={Contents[language].labelFilter}
                onDelete={onReset}
                className={classes.chip}
              />
            )}
          </>
        )}
      </div>
    )
  );
};

ActiveFilters.defaultProps = {};

export default ActiveFilters;
