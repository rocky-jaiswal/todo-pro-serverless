const devConfig = {
  GOOGLE_REDIRECT_URI_V1: 'http://localhost:5173/googleCallback',
};

const prodConfig = {
  GOOGLE_REDIRECT_URI_V1: 'http://localhost:5173/googleCallback',
};

export class ApplicationConfiguration {
  public getConfig(key: keyof typeof prodConfig) {
    if (process.env.APP_ENVIRONMENT === 'development') {
      return devConfig[key];
    }

    return prodConfig[key];
  }
}
