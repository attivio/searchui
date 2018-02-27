/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

public class HomeControllerHandlerMapper extends AbstractHandlerMapping {

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
        return homeController;
      }
    }
    return null;
  }
}
