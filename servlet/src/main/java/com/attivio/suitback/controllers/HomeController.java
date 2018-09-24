/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

@Component
public class HomeController extends AbstractController {
  
  /**
   * If this is set to <code>false</code>, then the Search UI application won't
   * be served by the servlet. The default value of <code>true</code> means
   * that it will be.
   */
  @Value("${suit.attivio.serveSearchUI:true}")
  boolean serveSearchUI;

  @Override
  protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {
    if (serveSearchUI) {
      // Don't cache the HTML file because it is used to force the SAML log in
      response.addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      response.addHeader("Pragma", "no-cache");
      return new ModelAndView("index.html");
    } else {
      response.sendError(HttpStatus.SC_NOT_FOUND, "Serving the Search UI application has been disabled.");
      return null;
    }
  }
}
