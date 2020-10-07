// @flow
const saveFilters = (name: string, data: any) => {
  localStorage.setItem(name, JSON.stringify(data));
};

const getFilters = (name: string): any => {
  const item = localStorage.getItem(name);
  if (item) {
    const { filters, params } = JSON.parse(item);
    return { filters, params };
  }
  return item;
};

export { saveFilters, getFilters };
