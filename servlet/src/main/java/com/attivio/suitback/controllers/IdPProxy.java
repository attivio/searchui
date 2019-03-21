/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Controller
@Profile("saml")
public class IdPProxy {
  static final Logger LOG = LoggerFactory.getLogger(IdPProxy.class);
  
  /**
   * Forward SAML-related requests to the identity provider and add CORS headers
   * before returning (the Access-Control-Allow-Origin header gets added automatically
   * by our WebSecurityCorsFilter class if the servlet is properly configured.
   */
  @RequestMapping(value = "/proxyIdP", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<String> proxyIdP(@RequestParam(name="uri", required=true) String idpUri, @RequestBody(required=false) String body, HttpMethod method, HttpServletRequest request,
      HttpServletResponse response) throws URISyntaxException, UnsupportedEncodingException {

    // Make sure we include the headers from the incoming request when we pass it on.
    HttpHeaders headers = new HttpHeaders();
    Enumeration<String> headerNames = request.getHeaderNames();
    while (headerNames.hasMoreElements()) {
      String headerName = headerNames.nextElement();
      LOG.trace("Incoming header " + headerName + " has value " + request.getHeader(headerName));
      if ("Origin".equalsIgnoreCase(headerName)) {
        headers.add("Origin", "http://acevm-57-12.lab.attivio.com:8080");
      } else if ("referer".equalsIgnoreCase(headerName)) {
        headers.add("referer", "http://acevm-57-12.lab.attivio.com:8080");
      } else if ("Cookie".equalsIgnoreCase(headerName)) {
      } else if ("referer".equalsIgnoreCase(headerName)) {
      } else if ("host".equalsIgnoreCase(headerName)) {
      } else if ("connection".equalsIgnoreCase(headerName)) {
//      } else if ("accept".equalsIgnoreCase(headerName)) {
//      } else if ("accept-encoding".equalsIgnoreCase(headerName)) {
//      } else if ("accept-language".equalsIgnoreCase(headerName)) {
//      } else if ("accept-charset".equalsIgnoreCase(headerName)) {
      } else {
        Enumeration<String> headersForName = request.getHeaders(headerName);
        while (headersForName.hasMoreElements()) {
          String singleHeaderValue = headersForName.nextElement();
          headers.add(headerName, singleHeaderValue);
        }
      }
    }
    
    String uri = URLDecoder.decode(idpUri, "UTF-8");
    
    // We need to use the Apache HTTP code to allow the GZIPped contents to work right.
    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory(
        HttpClientBuilder.create().build());

    
    RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
    // Make sure the forwarded call is made with UTF-8 encoding
    restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));

    ResponseEntity<String> responseEntity = null;
    
    if (LOG.isTraceEnabled()) {
      LOG.trace("Proxying SAML identity provider call (with method " + method + ") to " + uri);
      LOG.trace("The headers we are passing are:");
      for (Entry<String, List<String>> entry : headers.entrySet()) {
        LOG.trace("    " + entry.getKey() + " = " + entry.getValue().toString());
      }
      LOG.trace("The request body is:");
      LOG.trace("    " + body);
      
      LOG.trace("The response headers coming into the proxy call are:");
      for (String responseHeaderName : response.getHeaderNames()) {
        LOG.trace("    " + responseHeaderName + " = " + response.getHeaders(responseHeaderName));
      }
    }
    
    try {
      responseEntity = restTemplate.exchange(uri, method, new HttpEntity<String>(body, headers), String.class);
      
      // Filter out any Transfer-Encoding headers
      HttpHeaders updatedResponseHeaders = new HttpHeaders();
      Set<Entry<String, List<String>>> responseHeaderEntries = responseEntity.getHeaders().entrySet();
      for (Entry<String, List<String>> responseHeaderEntry : responseHeaderEntries) {
        boolean skipHeader = false;
        if ("Transfer-Encoding".equals(responseHeaderEntry.getKey())) {
          skipHeader = true;
        }
        if (!skipHeader) {
          LOG.trace("Adding response header " + responseHeaderEntry.getKey() + " with value " + responseHeaderEntry.getValue());
          updatedResponseHeaders.put(responseHeaderEntry.getKey(), responseHeaderEntry.getValue());
        } else {
          LOG.trace("Skipping over response header " + responseHeaderEntry.getKey() + " with value " + responseHeaderEntry.getValue());
        }
      }
      // Add the caching headers to prevent caching of REST calls
      updatedResponseHeaders.put("Pragma", Arrays.asList("no-cache"));
      updatedResponseHeaders.put("Cache-Control", Arrays.asList("no-cache, no-store, must-revalidate"));
      
      String realBody = responseEntity.getBody();
      
      responseEntity = new ResponseEntity<String>(realBody, updatedResponseHeaders, responseEntity.getStatusCode());
    } catch (RestClientException e) {
      LOG.info("Error contacting the SAML identity provider", e);
      if (e instanceof HttpServerErrorException) {
        // Got an error from the back end.. make sure we pass it on...
        String responseBody = ((HttpServerErrorException)e).getResponseBodyAsString();
        HttpStatus statusCode = ((HttpServerErrorException)e).getStatusCode();
        LOG.trace("The response body from the request was: " + responseBody);
        
        responseEntity = new ResponseEntity<>(responseBody, statusCode);
      }
    }
    return responseEntity;
  }
}
