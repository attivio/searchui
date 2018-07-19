/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
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

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    LOG.trace("Adding CORS headers for origin(s): " + corsOrigins); 
    HttpServletResponse res = (HttpServletResponse) response;
    res.setHeader("Access-Control-Allow-Origin", corsOrigins);
    res.setHeader("Access-Control-Allow-Methods", corsMethods);
    res.setHeader("Access-Control-Max-Age", "3600");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, x-requested-with, Cache-Control");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    chain.doFilter(request, res);
  }

  @Override
  public void destroy() {
  }
}
