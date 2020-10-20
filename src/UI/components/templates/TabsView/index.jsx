// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from 'UI/components/atoms/TabPanel';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { useStyles, useTabPanelStyles, useTabStyles, useWrapperStyles } from './styles';

type TabsViewProps = {
  tabs: Array<Object>,
  selectedTab: number,
  onChangeTabIndex: any => any,
  content: 'start' | 'center',
  panelHeight: number | string | null,
  fullHeight: boolean
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const TabsView = (props: TabsViewProps) => {
  const { tabs, selectedTab, onChangeTabIndex, content, panelHeight, fullHeight } = props;
  const classes = useStyles();
  const wrapperClasses = useWrapperStyles(fullHeight ? { minHeight: '100%' } : { height: '100%' });
  const tabPanelClasses = useTabPanelStyles({ panelHeight });
  const tabClasses = useTabStyles();

  const filteredTabs = tabs.filter(({ visible = true }) => visible);

  return (
    <div className={wrapperClasses.wrapper}>
      <AppBar classes={classes} position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={onChangeTabIndex}
          aria-label="simple tabs example"
          textColor="primary"
          variant="scrollable"
          indicatorColor="primary"
          TabIndicatorProps={{
            style: {
              height: '2px',
              position: 'absolute',
              bottom: '0px'
            }
          }}
        >
          {filteredTabs.map((tab, index) => {
            const { icon } = tab;

            const styledIcon = icon
              ? {
                  ...icon,
                  props: { fill: selectedTab === index ? colors.success : colors.iconInactive }
                }
              : undefined;
            return (
              <Tab
                key={tab.label}
                label={tab.label}
                className={tabClasses.tab}
                icon={styledIcon}
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>
      </AppBar>
      {filteredTabs.map((tab, index) => {
        return (
          <TabPanel
            content={content}
            classes={tabPanelClasses}
            key={tab.label}
            value={selectedTab}
            index={index}
          >
            {tab.view}
          </TabPanel>
        );
      })}
    </div>
  );
};

TabsView.defaultProps = {
  content: 'center',
  panelHeight: null,
  fullHeight: false
};

export default TabsView;
