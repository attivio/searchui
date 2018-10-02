/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.attivio.suitback.controllers.UserController.UserDetails;
import com.google.gson.Gson;

@Controller
public class RestProxy {
  static final String API_KEY_PARAM = "apikey";
  
  static final Logger LOG = LoggerFactory.getLogger(RestProxy.class);
  
  @ResponseStatus(value=HttpStatus.FORBIDDEN, reason="Not authenticted") // 403
  static class NotLoggedInException extends Exception {
    private static final long serialVersionUID = 8277052796269904693L;

    public NotLoggedInException() {
      super("You must be logged in to access this URL");
    }
  }
  
  @Value("${suit.attivio.protocol:http}")
  String attivioProtocol;
  @Value("${suit.attivio.hostname:localhost}")
  String attivioHostname;
  @Value("${suit.attivio.port:17000}")
  int attivioPort;
  @Value("${suit.attivio.username:aieadmin}")
  String attivioUsername;
  @Value("${suit.attivio.password:attivio}")
  String attivioPassword;
  @Value("${suit.attivio.authToken:}")
  String attivioAuthToken;
  @Value("${security.saml.entityId:}")
  String entityId;

  /**
  * Forward query requests through to the real Attivio server only after
  * adding the current user's info
  */
  @RequestMapping("/rest/searchApi/search")
  @ResponseBody
  public ResponseEntity<String> mirrorQuery(@RequestBody(required=false) String body, HttpMethod method, HttpServletRequest request,
    HttpServletResponse response) throws URISyntaxException, UnsupportedEncodingException, NotLoggedInException {
    UserDetails userInfo = UserController.getUserDetails();
    String newBody = body;
    if (userInfo != null) {
      // Parse the request object and add the username to it so the
      // search is done on that user's behalf
      if (body != null && body.length() > 0) {
        Gson gson = new Gson();
        @SuppressWarnings("unchecked")
        Map<String, Object> bodyObject = gson.fromJson(body, Map.class);
        bodyObject.put("username", userInfo.getUserId());
        newBody = gson.toJson(bodyObject);
        LOG.trace("Doing a search REST API request forcing the username to be " + userInfo.getUserId() + ".");
      }
    } else if (entityId != null && entityId.length() > 0) {
      // If we're configured for SAML authentication and there is no user logged on, throw an exception
      LOG.trace("No SAML user is logged in for a call to the search REST API.");
      throw new NotLoggedInException();
    }
    return this.mirrorRest(newBody, method, request, response);      
  }
  
  /**
   * Forward all uncaught requests through to the real Attivio server
   */
  @RequestMapping("/rest/**")
  @ResponseBody
  public ResponseEntity<String> mirrorRest(@RequestBody(required=false) String body, HttpMethod method, HttpServletRequest request,
      HttpServletResponse response) throws URISyntaxException, UnsupportedEncodingException {

    // Make sure we include the headers from the incoming request when we pass it on.
    HttpHeaders headers = new HttpHeaders();
    Enumeration<String> headerNames = request.getHeaderNames();
    LOG.trace("Transferring incoming headers to proxied request:");
    while (headerNames.hasMoreElements()) {
      String headerName = headerNames.nextElement();
      if (!"Host".equalsIgnoreCase(headerName)) {
        Enumeration<String> headersForName = request.getHeaders(headerName);
        while (headersForName.hasMoreElements()) {
          String singleHeaderValue = headersForName.nextElement();
          LOG.trace(headerName + " = " + singleHeaderValue);
          headers.add(headerName, singleHeaderValue);
        }
      } else {
        LOG.trace("Omitting Host header when proxying");
      }
    }

    // Get this to use when constructing the URI to forward to.
    String queryString = request.getQueryString();
    // In case the incoming URL's path or query string has had pieces URL-encoded, we need to
    // decode them before passing them along.
    if (queryString != null) {
      queryString = URLDecoder.decode(queryString, "UTF-8");
    }
    String path = request.getServletPath();
    if (path != null) {
      path = URLDecoder.decode(path, "UTF-8");
    }

    // If we're configured to use token-based authentication (e.g. for Managed Services clients)
    // we need to incorporate the token
    if (attivioAuthToken != null && attivioAuthToken.length() > 0) {
      if (queryString != null && queryString.length() > 0) {
        // Add to the existing list of query parameters
        queryString = queryString + "&" + API_KEY_PARAM + "=" + attivioAuthToken;
      } else {
        // It's the only query parameter... no need for the ampersand
        queryString = API_KEY_PARAM + "=" + attivioAuthToken; 
      }      
    } else {
      // Add the basic authorization header for the username/password used to talk to to the Attivio back-end 
      try {
        String authValue;
        authValue = new String(Base64.encodeBase64((this.attivioUsername + ":" + this.attivioPassword).getBytes("UTF-8")), "UTF-8");
        headers.add("Authorization", "Basic " + authValue);
      } catch (UnsupportedEncodingException e1) {
        LOG.error("The UTF-8 encoding isn't supported. This shoould never happen.", e1);
      }
    }

    // Build the URI to use when passing the call on to the Attivio server... note that getServletPath() returns the
    // part of the path AFTER the context path, which we don't want since the REST APIs are always based at the root
    URI uri = new URI(attivioProtocol, null, attivioHostname, attivioPort, path, queryString, null);

    // We need to use the Apache HTTP code to allow the GZIPped contents to work right.
    // We'll use the RestTemplate class to make the actual call to the Attivio server.
    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory(
        HttpClientBuilder.create().build());
    RequestConfig reqCfg = RequestConfig.custom()
        .setCookieSpec(CookieSpecs.DEFAULT)
        .build();
    // Allow the HTTP client to deal with the default Attivio self-signed certificate
    if ("https".equalsIgnoreCase(attivioProtocol)) {
      LOG.trace("Configuring the HTTP client for HTTPS access");
      SSLConnectionSocketFactory socketFactory;
      try {
        socketFactory = new SSLConnectionSocketFactory(new SSLContextBuilder().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build(), NoopHostnameVerifier.INSTANCE);
        CloseableHttpClient httpClient = HttpClients
            .custom()
            .setSSLSocketFactory(socketFactory)
            .setDefaultRequestConfig(reqCfg)
            .build();
        clientHttpRequestFactory.setHttpClient(httpClient);      
      } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
        LOG.error("Failed to configure the proxy for HTTPS access", e);
      }
    } else {
      CloseableHttpClient httpClient = HttpClients
          .custom()
          .setDefaultRequestConfig(reqCfg)
          .build();
      clientHttpRequestFactory.setHttpClient(httpClient);      
    }
    RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
    
    // Make sure the forwarded call is made with UTF-8 encoding
    restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
    
    LOG.trace("Proxying REST API call (" + method.toString() + ") from '" + request.getRequestURL().toString() + 
        (request.getQueryString() != null ? ("?" + request.getQueryString()) : "") + "' to '" + uri.toString() + "'");

    ResponseEntity<String> responseEntity = null;
    try {
      responseEntity = restTemplate.exchange(uri, method, new HttpEntity<String>(body, headers), String.class);
      
      // Filter out any Transfer-Encoding headers
      HttpHeaders updatedResponseHeaders = new HttpHeaders();
      Set<Entry<String, List<String>>> responseHeaderEntries = responseEntity.getHeaders().entrySet();
      LOG.trace("Transferring response headers from the proxied request:");
      for (Entry<String, List<String>> responseHeaderEntry : responseHeaderEntries) {
        boolean skipHeader = false;
        if ("Transfer-Encoding".equals(responseHeaderEntry.getKey())) {
          LOG.trace("  Found a Transfer-Encoding header which we will skip (value is " + responseHeaderEntry.getValue() + ")");
          skipHeader = true;
        }
        if (!skipHeader) {
          LOG.trace(responseHeaderEntry.getKey() + " = " + responseHeaderEntry.getValue());
          updatedResponseHeaders.put(responseHeaderEntry.getKey(), responseHeaderEntry.getValue());
        }
      }
      // Add the caching headers to prevent caching of REST calls
      LOG.trace("Adding headers to disable caching of REST calls (Pragma: no-cache and Cache-Control: no-cache, no store, must-revalidate");
      updatedResponseHeaders.put("Pragma", Arrays.asList("no-cache"));
      updatedResponseHeaders.put("Cache-Control", Arrays.asList("no-cache, no-store, must-revalidate"));
      
      String realBody = responseEntity.getBody();
      
      LOG.trace("The body of the proxied request is:");
      LOG.trace(realBody);
      
      responseEntity = new ResponseEntity<String>(realBody, updatedResponseHeaders, responseEntity.getStatusCode());
    } catch (RestClientException e) {
      if (e instanceof HttpStatusCodeException) {
        // Got an error from the back end.. make sure we pass it on...
        String responseBody = ((HttpStatusCodeException)e).getResponseBodyAsString();
        HttpStatus statusCode = ((HttpStatusCodeException)e).getStatusCode();
        LOG.warn("Error contacting the Attivio server. The status code returned was: " + statusCode, e);
        LOG.debug("The response body was: " + responseBody);
        
        responseEntity = new ResponseEntity<>(responseBody, statusCode);
      } else {
        LOG.warn("Error contacting the Attivio server.", e);
      }
    }
    return responseEntity;
  }
}
