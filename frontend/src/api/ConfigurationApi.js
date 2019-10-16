// @flow
import FetchUtils from './FetchUtils';
import config from '../../configuration.properties';

/**
 * This retrieves the configuration options
 */
export default class ConfigurationApi {
  static BASE_URI = 'configuration';

  /**
   * Retrieves names of existing connectors.
   */
  static getConfiguration(): Promise<Array<string>> {
    const request = {
      uri: ConfigurationApi.BASE_URI,
      method: 'GET',
      errorMessage: 'Unable to retrieve configuration options.',
      developerModeResponse: config,
    };

    return FetchUtils.getFetchRequest(request);
  }
}
  