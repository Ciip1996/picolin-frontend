// @flow
const intialState = {
  app: {
    ui: {
      alerts: []
    },
    domain: null
  },
  notification: {
    ui: {
      isLoading: true,
      hasError: false,
      hasMore: false
    },
    domain: {
      params: {},
      notifications: [],
      total: 0,
      filterTotal: 0
    }
  },
  map: {
    ui: {
      activeTab: 0,
      isSideMenuOpen: true,
      isLoading: false,
      hasLoaded: false,
      selectedRecruiter: null,
      lastError: null
    },
    domain: {
      filters: {},
      recruiters: [],
      markers: []
    }
  },
  dashboard: {
    ui: {
      isSideMenuOpen: false,
      isLoading: false,
      hasLoaded: false
    },
    domain: {
      filters: {},
      recruiters: [],
      markers: []
    }
  }
};

export default intialState;
