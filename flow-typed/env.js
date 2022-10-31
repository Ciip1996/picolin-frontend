declare class process {
  static env: {
    PUBLIC_URL: string,
    REACT_APP_API_URL: string,
    REACT_APP_REDIRECT_URL: string,
    REACT_APP_FEATURE_FLAGS: string,
    REACT_APP_DEFAULT_LANGUAGE: 'Spanish' | 'English',
    REACT_APP_DEFAULT_LOCALE: 'en' | 'es',
    REACT_APP_ENVIRONMENT: 'demo' | 'prod'
  };
}
