// @flow
import isNil from 'lodash/isNil';
import type { Filters } from 'types/app';

/** This functions transforms a filters object like { industry: { paramName: industryId, value: {id: 1, title: 'An industry'}}}
 *  into another object ready to populate ui components like { industry: { id: 1, title: 'An industry'}} }
 */
export const filtersToUi = (filters: Filters) => {
  const transformedFilters = {};
  Object.keys(filters).forEach(key => {
    transformedFilters[key] = filters[key].value;
  });
  return transformedFilters;
};

/** This functions transforms a filters object like { industry: { paramName: industryId, value: {id: 1, title: 'An industry'}}}
 *  into another object ready to be sent as query parameters like { industryId: 1 }
 */
export const filtersToParams = (filters: Filters) => {
  const transformedFilters = {};
  Object.keys(filters).forEach(key => {
    transformedFilters[filters[key].paramName] = !isNil(filters[key].value.id)
      ? filters[key].value.id
      : filters[key].value;
  });
  return transformedFilters;
};
