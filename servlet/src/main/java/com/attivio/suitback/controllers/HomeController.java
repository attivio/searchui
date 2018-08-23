/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

@Component
public class HomeController extends AbstractController {

  @Override
  protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // Don't cache the HTML file because it is used to force the SAML log in
    response.addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.addHeader("Pragma", "no-cache");
    return new ModelAndView("index.html");
  }
}
