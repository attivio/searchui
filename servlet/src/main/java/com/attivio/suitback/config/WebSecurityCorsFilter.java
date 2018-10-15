/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSecurityCorsFilter implements Filter {
  static final Logger LOG = LoggerFactory.getLogger(WebSecurityCorsFilter.class);
  
  private String corsOrigins;
  private String corsMethods;
  
  public WebSecurityCorsFilter(String corsOrigins, String corsMethods) {
    this.corsOrigins = corsOrigins;
    this.corsMethods = corsMethods;
  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }
  
  /**
   * Based on the configuration and the incoming request, decide what to return
   * for the value of the Access-Control-Allow-Origin header, if anything.
   *  
   * @param request the incoming request
   * @return        the origin to return or <code>null</code> if not configured or nothing matches
   */
  String getAllowedCorsOrigin(String comingFrom) {
    String originToReturn = null;
    // Special case of "*"
    if ("*".equals(corsOrigins)) {
      originToReturn = "*";
    } else {
      String[] origins = corsOrigins.split(",");
      for (String testOrigin : origins) {
        if (testOrigin.trim().equals(comingFrom)) {
          // The actual origin matches one of the items in the corsOrigins list
          originToReturn = comingFrom;
          break;
        }
      }      
    }
    
    LOG.trace("Incoming origin is " + comingFrom + ". (Allowed origins are: " + corsOrigins + ".)");
    if (originToReturn != null) {
      LOG.trace("Returning Access-Control-Allow-Origin header with value " + originToReturn + ".");
    } else {
      LOG.trace("Returning NO Access-Control-Allow-Origin header.");
    }
    return originToReturn;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest)request;
    
    Enumeration<String > origins = req.getHeaders("Origin");
    String originToReturn = null;
    if (origins != null) {
      if (origins.hasMoreElements()) {
        String origin = origins.nextElement();
        if (origins.hasMoreElements()) {
          String queryString = (req.getQueryString() != null) ? ("?" + req.getQueryString()) : "";
          String requestedURL = req.getRequestURL().append(queryString).toString();
          LOG.warn("Being called with multiple Origin headers set. URI: " + requestedURL);
        } else {
          originToReturn = getAllowedCorsOrigin(origin);
          if (originToReturn != null) {
          }
        }
      }
    }

    HttpServletResponse res = (HttpServletResponse)response;

    // If there was no Origin header in the request then browser didn't think it was necessary to
    // add one (e.g. coming from the same machine) so we won't add CORS headers to the response.
    if (originToReturn != null) {
      if (originToReturn != null) {
        res.setHeader("Access-Control-Allow-Origin", originToReturn);
      }
      res.setHeader("Access-Control-Allow-Methods", corsMethods);
      res.setHeader("Access-Control-Max-Age", "3600");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, x-requested-with, Cache-Control");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    chain.doFilter(request, res);
  }

  @Override
  public void destroy() {
  }
}
