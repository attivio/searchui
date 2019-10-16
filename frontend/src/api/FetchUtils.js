// @flow
import { isEmpty } from 'lodash';
import { AuthUtils } from '@attivio/suit';

type ErrorMessage = string | (exceptionMessage: string) => string;

type FetchRequestParams = {
  /**
   * Required. Specify the uri to make the request against.
   */
  uri: string;
  /**
   * Required. Indicate the HTTP request type.
   */
  method: 'GET' | 'PUT' | 'POST';
  /**
   * Optional. A function that if defined must, at minimum, specify a resolution with resolve.
   *  Additional parameters are always provided. If defined, this is executed after successful
   *  request with a json or text response type. If not specified, the call will resolve with the
   *  response without modification.
   */
  responseHandler?: (resolve: any, reject: (errorMessage?: string) => any, response: any) => any;
  /**
   * Optional. May be a string or a function that accepts an exceptionMessage string and returns a
   *  string. This will be used in error catching and rejections if the call fails.
   */
  errorMessage?: ErrorMessage;
  /**
   * Optional. May be a string, or an object. If specifying with an object, each key must be a
   *  string and will be used as the query param key, each param value may be a string or an array
   *  of strings.
   */
  queryParams?: string | {};
  /** Optional. If specified will be passed through as a request parameter unmodified. */
  body?: any;
};

export default class FetchUtils {
  static formatQueryParam(queryParam?: string, queryValues?: string | Array<string>): string {
    if (!queryParam) {
      return '';
    }
    const encodedQueryParam = encodeURIComponent(queryParam);

    if (queryParam && !queryValues) {
      return encodedQueryParam;
    } else if (typeof queryValues === 'string') {
      const encodedQueryValues = encodeURIComponent(queryValues);
      return `${encodedQueryParam}=${encodedQueryValues}`;
    } else if (Array.isArray(queryValues)) {
      if (queryValues.length < 1) {
        return encodedQueryParam || '';
      }
      const formattedQueryValues = queryValues.reduce((
        query: string,
        queryValue: string
      ): string => {
        if (!queryValue || typeof queryValue !== 'string') {
          // eslint-disable-next-line no-console
          console.warn(`You attempted to use the invalid variable: ${queryValue} as a query param - ignoring it.`);
          return query;
        }
        const encodedQueryValue = encodeURIComponent(queryValue);
        return query
          ? `${query},${encodedQueryValue}`
          : encodedQueryValue;
      }, '');
      return `${encodedQueryParam}=${formattedQueryValues}`;
    }
    // $FlowFixMe: flow thinks queryValue can be undefined.
    return `${encodedQueryParam}=${queryValues}`;
  }

  /**
   * Converts a queryParam object into an encoded string. If the queryParam is a string, it's
   * returned unmodified.
   */
  static parseQueryParams(queryParams: {} | string): string {
    if (!queryParams || (typeof queryParams !== 'string' && isEmpty(queryParams))) {
      return '';
    } else if (typeof queryParams === 'string') {
      return FetchUtils.formatQueryParam(queryParams);
    }
    return Object.keys(queryParams).reduce((collectedQueryParams, queryKey) => {
      const queryParam = queryKey || '';
      const queryValues = queryParams[queryKey] || '';
      const formattedQueryParam = FetchUtils.formatQueryParam(queryParam, queryValues);
      if (!formattedQueryParam) {
        return collectedQueryParams;
      }
      return collectedQueryParams
        ? `${collectedQueryParams}&${formattedQueryParam}`
        : formattedQueryParam;
    }, '');
  }

  /**
   * Combines an errorObject with an errorMessage. If both are omitted, a generic error message
   *   will be returned.
  */
  static formatErrorMessage(errorObject: any, errorMessage?: ErrorMessage): string {
    const exceptionMessage = errorObject && errorObject.message ? errorObject.message : '';
    const exceptionCode = errorObject.errorCode ? ` (${(errorObject.errorCode: string)})` : '';
    let errorSuffix = 'There was an error executing the request.';
    if (exceptionMessage || exceptionCode) {
      errorSuffix = exceptionMessage && exceptionCode
        ? `${exceptionMessage} ${exceptionCode}`
        : `${exceptionMessage}${exceptionCode}`;
    }
    let finalExceptionMessage = `An error occurred. ${errorSuffix}`;
    if (errorMessage && typeof errorMessage === 'string') {
      finalExceptionMessage = `${errorMessage}: ${finalExceptionMessage}`;
    } else if (errorMessage && typeof errorMessage === 'function') {
      finalExceptionMessage = errorMessage(finalExceptionMessage);
    }

    return finalExceptionMessage;
  }

  /**
   * Returns a fetch request as a promise.
   */
  static getFetchRequest({
    uri,
    method,
    responseHandler,
    errorMessage,
    queryParams,
    body = null,
    developerModeResponse,
  }: FetchRequestParams): Promise<any> {
    return new Promise((resolve, reject) => {
      const isDevelop = FetchUtils.isDeveloperMode();
      if (isDevelop && developerModeResponse) {
        console.group('FetchUtils(): developer mode: ', uri);
        console.log('developerModeResponse: ', developerModeResponse);
        console.groupEnd();
        resolve(developerModeResponse);
      }
      const authConfig = AuthUtils.getConfig();

      const baseUri = authConfig
        ? `${authConfig.ALL.baseUri}/rest/${uri}`
        : '';
      if (!baseUri) {
        console.error('Unable to fetch config');
      }
      const formattedQueryParams = queryParams ? FetchUtils.parseQueryParams(queryParams) : '';
      const formattedUri = formattedQueryParams ? `${baseUri}?${formattedQueryParams}` : baseUri;

      const headers = new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
      const params = {
        method,
        headers,
        credentials: 'include',
        body,
      };

      const fetchRequest = new Request(formattedUri, params);

      fetch(fetchRequest).then((response: any) => {
        const contentType = response && response.headers
          ? response.headers.get('content-type')
          : null;
        if (response.ok) {
          if (contentType && contentType.includes('text')) {
            response.text().then((textResponse: any) => {
              // If authentication fails, the server does not respond with a 404, instead, it
              //  returns the login page.
              if (textResponse && textResponse.includes('j_security_check')) {
                window.location.reload();
              } else if (responseHandler) {
                responseHandler(resolve, reject, textResponse);
              } else {
                resolve(textResponse);
              }
            }).catch((textParsingError: any) => {
              const formattedErrorMessage = FetchUtils
                .formatErrorMessage(textParsingError, errorMessage);
              reject(formattedErrorMessage);
            });
          } else if (!contentType) {
            // This occurs on a successful request with an empty response.
            resolve();
          } else {
            // Normal json response
            response.json().then((jsonResponse: any) => {
              if (responseHandler) {
                responseHandler(resolve, reject, jsonResponse);
              } else {
                resolve(jsonResponse);
              }
            }).catch((jsonParsingError: any) => {
              reject(FetchUtils.formatErrorMessage(jsonParsingError));
            });
          }
        } else {
          // The request came back other than a 200-type response code

          // Something went really wrong - no json response describes what happened.
          if (!contentType) {
            const formattedErrorMessage = FetchUtils.formatErrorMessage('UNKNOWN SERVER ERROR', errorMessage);
            reject(formattedErrorMessage);
          }
          // There should be JSON describing it...
          response.json().then((error: any) => {
            const formattedErrorMessage = FetchUtils.formatErrorMessage(error, errorMessage);
            reject(formattedErrorMessage);
          }).catch((badJsonError: any) => {
            const formattedErrorMessage = FetchUtils.formatErrorMessage(badJsonError, errorMessage);
            reject(formattedErrorMessage);
          });
        }
      }).catch((error) => {
        // Catch exceptions from the main "then" function
        const formattedErrorMessage = FetchUtils.formatErrorMessage(error, errorMessage);
        reject(formattedErrorMessage);
      });
    });
  }
  
  /**
   * Convert the URL of the current page to be a base path.
   * Will return the first segment of the URL if there is one, or
   * if not, then will return just the slash.
   * NOTE: Shallow context path only - This will not work properly if the servlet's
   * context path is more than one level deep.
   */
  static getBasePath(knownRoutes: Array<string>): string {
    let path = window.location.pathname;
    // Make sure it starts with a slash
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    // Find the next slash, if any
    const slashIndex = path.indexOf('/', 1);
    if (slashIndex >= 0) {
      // Remove anything after (and including) the second slash
      path = path.substring(0, slashIndex);
    }
    // Check to see if the first segment we found is one of
    // the known routes we expect. In this case, we assume
    // It's not part of the base path and return / instead.
    if (knownRoutes.find((route) => {
      return route === path;
    })) {
      path = '/';
    }
    return path;
  }

  static isDeveloperMode() {
    return window.location.origin.includes('localhost');
  }
}
