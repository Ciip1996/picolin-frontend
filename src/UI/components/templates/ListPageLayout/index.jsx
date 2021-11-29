// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

/** Atoms, Components and Styles */
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ActiveFilters from 'UI/components/molecules/ActiveFilters';

/** API / EntityRoutes / Endpoints / EntityType */
import { globalStyles } from 'GlobalStyles';
import { colors } from 'UI/res';
import { fuseStyles } from 'UI/utils';
import { styles } from './styles';

const ListPageLayoutTitle = props => {
  const { needsBackNavigation, title, loading } = props;
  return (
    <Grid item xs={12}>
      {needsBackNavigation ? (
        <TitleLabel backNavigation text={title} loading={loading} />
      ) : (
        <TitleLabel fontWeight={700} text={title} loading={loading} />
      )}
    </Grid>
  );
};

const ListPageLayoutSelector = props => {
  const { loading, selector } = props;
  return (
    <Grid item xs={12}>
      <div style={styles.selectorContainer}>
        {loading ? (
          <CustomSkeleton
            style={globalStyles.skeletonItem}
            color={colors.inactiveSideBarTab}
          />
        ) : (
          selector
        )}
      </div>
    </Grid>
  );
};

type ListPageLayoutProps = {
  loading: boolean,
  title: string,
  selector?: any,
  children: any,
  needsBackNavigation?: boolean,
  filters: any,
  onFilterRemove: any => any,
  onFiltersReset: () => void,
  mode?: 'template' | 'contained' | 'onPage'
};

const ListPageLayout = (props: ListPageLayoutProps) => {
  const {
    loading,
    title,
    filters,
    selector,
    children,
    onFilterRemove,
    onFiltersReset,
    mode,
    needsBackNavigation
  } = props;

  const customStyle = fuseStyles([
    styles.dataTableLayout,
    mode === 'template' && styles.paddingTemplate,
    mode === 'contained' && styles.paddingContained,
    mode === 'onPage' && styles.paddingOnPage
  ]);

  const gridStyle = fuseStyles([
    mode === 'contained' && styles.paddingGrid,
    mode === 'template' && styles.tableContainer,
    mode === 'onPage' && styles.gridOnPage
  ]);

  return (
    <div style={customStyle} mode={mode}>
      <Grid
        style={mode === 'onPage' ? styles.containerOnPage : null}
        container
        spacing={3}
      >
        {mode === 'template' && (
          <ListPageLayoutTitle
            needsBackNavigation={needsBackNavigation}
            title={title}
            loading={loading}
          />
        )}
        {mode !== 'onPage' && (
          <ListPageLayoutSelector selector={selector} loading={loading} />
        )}

        <Grid style={gridStyle} item xs={12}>
          <ActiveFilters
            filters={filters}
            isLoading={loading}
            onFilterRemove={onFilterRemove}
            onReset={onFiltersReset}
          />
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

ListPageLayout.defaultProps = {
  filters: null,
  loading: false,
  onFilterRemove: () => {},
  onFiltersReset: () => {},
  title: '',
  mode: 'template',
  needsBackNavigation: false,
  selector: undefined
};

export default ListPageLayout;
