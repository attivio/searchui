/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

  /**
   * Callers can access this method to ensure that they are logged
   * into the configured security, if any (e.g., for SAML authentication).
   * If the user is already logged in or succeeds in logging in now via
   * redirects from the SAML identity provider, then the user is
   * redirected to the target URI. Essentially, this method is a no-op
   * for the user if already logged in. Generally, a client application
   * that is hosted outside this servlet should be able to redirect to
   * this method if an Ajax call fails to execute properly—doing so
   * should have the effect of either re-upping the session or re-logging
   * the user in 
   * 
   * @param response
   * @param targetUri
   * @throws IOException
   */
  @RequestMapping("/rest/login")
  public void login(HttpServletResponse response,
		  @RequestParam(value = "uri", required = true) String targetUri) throws IOException {
    if (targetUri != null && targetUri.length() > 0) {
      response.sendRedirect(targetUri);
    }
  }
}
