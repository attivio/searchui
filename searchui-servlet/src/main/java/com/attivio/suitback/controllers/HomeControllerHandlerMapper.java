/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

public class HomeControllerHandlerMapper extends AbstractHandlerMapping {

  // Add the property logging.level.com.attivio.suitback.controllers.HomeControllerHandlerMapper
  // to the application.properties to get logging (e.g., with value of TRACE).
  static final Logger LOG = LoggerFactory.getLogger(HomeControllerHandlerMapper.class);

  static final String[] DEFAULT_ROUTES = new String[] {"/", "/login", "/loggededout", "/error", "/landing", "/results", "/insights", "/doc360"};

  @Value("${suit.attivio.routes:}")
  String[] routes;
  
  HomeController homeController;
  
  public HomeControllerHandlerMapper(HomeController homeController) {
    this.homeController = homeController;
  }

  @Override
  protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
    if (this.routes == null) {
      this.routes = DEFAULT_ROUTES;
    }
    String path = request.getServletPath();
    for (String route : routes) {
      if (route.equals(path)) {
        LOG.trace("Mapping URL " + path + " to the main HomeController");
        return homeController;
      }
    }
    LOG.trace("Letting servlet handle URL " + path + " on its own");
    return null;
  }
}
