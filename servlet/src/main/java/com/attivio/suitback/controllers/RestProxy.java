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

import javax.net.ssl.SSLContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContexts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
  
  static RestTemplate restTemplate = null;
  
  @Autowired
  UserController userController;
  
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
    UserDetails userInfo = userController.getUserDetails();
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
      if ("Host".equalsIgnoreCase(headerName)) {
        LOG.trace("Omitting Host header when proxying REST API calls");
      } else if ("Cookie".equalsIgnoreCase(headerName)) {
        LOG.trace("Omitting Cookie header when proxying REST API calls");
      } else {
        Enumeration<String> headersForName = request.getHeaders(headerName);
        while (headersForName.hasMoreElements()) {
          String singleHeaderValue = headersForName.nextElement();
          LOG.trace(headerName + " = " + singleHeaderValue);
          headers.add(headerName, singleHeaderValue);
        }
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
    
    RestTemplate restTemplate = getRestTemplate();
    
    LOG.debug("Proxying REST API call (" + method.toString() + ") from '" + request.getRequestURL().toString() + 
        (request.getQueryString() != null ? ("?" + request.getQueryString()) : "") + "' to '" + uri.toString() + "'");

    // Make the actual call to the Attivio server
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

      responseEntity = new ResponseEntity<String>(realBody, updatedResponseHeaders, responseEntity.getStatusCode());
    } catch (RestClientException e) {
      if (e instanceof HttpStatusCodeException) {
        // Got an error from the back end.. make sure we pass it on...
        HttpStatus statusCode = ((HttpStatusCodeException)e).getStatusCode();
        LOG.warn("Error contacting the Attivio server. The status code returned was: " + statusCode, e);

        String responseBody = ((HttpStatusCodeException)e).getResponseBodyAsString();
        LOG.debug("The response body was: " + responseBody);
        
        responseEntity = new ResponseEntity<>(responseBody, statusCode);
      } else {
        LOG.warn("Error contacting the Attivio server.", e);
      }
    }
    return responseEntity;
  }
  
  /**
   * Construct the Spring REST template that we'll use to make calls to the Attivio server when
   * proxying. We only need to do this the very first time we need it and then we can keep it
   * around to reuse.
   * 
   * @return  the rest template to use when calling Attivio (the previously created one if one
   *          exists, otherwise a new one)
   */
  RestTemplate getRestTemplate() {
    if (restTemplate == null) {
      // Create the HTTP client that will be used by the Spring RestTemplate class's client factory. 
      // The client needs to be an Apache one instead of the default Spring one to allow the GZIPped
      // contents to work right.
      HttpClientBuilder clientBuilder = HttpClientBuilder.create();
  
      // Set the request config to deal with cookies... fixes issue with parsing dates in Netscape-style cookies
      RequestConfig reqCfg = RequestConfig.custom()
          .setCookieSpec(CookieSpecs.DEFAULT)
          .build();
      clientBuilder.setDefaultRequestConfig(reqCfg);

      // This allows any system properties that the user has configured for proxy support, etc., to take effect 
      clientBuilder.useSystemProperties();
  
      // If we're using HTTPS to talk to Attivio, this is necessary to allow the client to deal
      // with the default Attivio self-signed certificate
      if ("https".equalsIgnoreCase(attivioProtocol)) {
        LOG.trace("Configuring the REST proxy's HTTP client for HTTPS access");
        try {
          SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
          SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
          clientBuilder.setSSLSocketFactory(socketFactory);
        } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
          LOG.error("Failed to configure the REST proxy for HTTPS access", e);
        }
      }
      
      // We'll use the RestTemplate class to make the actual call to the Attivio server.
      // This client request factory is used to get a client configured the way we want/need it
      HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory(clientBuilder.build());
      
      restTemplate = new RestTemplate(clientHttpRequestFactory);
      
      // Make sure the forwarded call is made with UTF-8 encoding
      restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
    }
    
    return restTemplate;
  }
}
