// @flow
// import convert from 'xml-js';
import FetchUtils from './FetchUtils';

/**
 * This retrieves the Users options
 */
export default class UsersApi {
  static BASE_URI = 'users';

  /**
   * Retrieves names of existing connectors.
   */
  static getUsers(): Promise<Array<string>> {
    // const responseHandler = (resolve, reject, response: any) => {
    //   console.group('getUsers() responseHandler()');
    //   if (response && response.length > 0) {
    //     console.log('response: ', response);
    //     const users = convert.xml2js(
    //       response,
    //       {
    //         attributesKey: '$',
    //         compact: true,
    //         ignoreComment: true,
    //         ignoreDeclaration: true,
    //         ignoreDoctype: true,
    //         ignoreInstruction: true,
    //         nativeType: true,
    //         trim: true,
    //       },
    //     );
    //     console.log('converted to js users: ', users);
    //     console.groupEnd();

    //     resolve(users);
    //   } else {
    //     reject([]);
    //   }
    // };

    const request = {
      uri: UsersApi.BASE_URI,
      method: 'GET',
      errorMessage: 'Unable to retrieve Users.',
      // responseHandler,
      developerModeResponse: '',
    };

    return FetchUtils.getFetchRequest(request);
  }
}
  