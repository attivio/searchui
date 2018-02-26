/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import java.util.Arrays;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

public class HomeControllerHandlerMapper extends AbstractHandlerMapping {
  
  @Value("${suit.attivio.routes}")
  String[] routes = {"/", "/login", "loggededout", "/error", "/landing", "/results", "/insights" ,"/doc360"};

  HomeController homeController;
  
  public HomeControllerHandlerMapper(HomeController homeController) {
    this.homeController = homeController;
    Logger.getLogger(HomeControllerHandlerMapper.class.getName()).info("Serving the applicaton on these routes: " + Arrays.toString(routes));
  }

  @Override
  protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
    String path = request.getServletPath();
    for (String route : routes) {
      if (route.equals(path)) {
        return homeController;
      }
    }
    return null;
  }
}
