/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@Profile("basic")
public class SecurityConfigBasic extends WebSecurityConfigurerAdapter {
  // Add the property logging.level.com.attivio.suitback.config.SecurityConfig
  // to the application.properties to get debug logging (e.g., with value of DEBUG).
  static final Logger LOG = LoggerFactory.getLogger(SecurityConfigBasic.class);
  
  public static final String[] NOT_AUTHENTICATED_MATCHERS = new String[] {
      "/error",
      "/loggedout",
      "/users",
      "/configuration",
      "/sockjs-node/**",
      "/log",
      "/**/*.css",
      "/**/*.ttf",
      "/**/*.eot",
      "/**/*.wof",
      "/**/*.woff2"
      ,"/**/*.svg",
      "/**/*.png",
      "/**/*.gif",
      "/**/*.ico"
  };

  @Override
  public void configure(WebSecurity web) throws Exception {
    // The REST API, the special sockjs-node URLs, and any static files are NOT to be authenticated
    web
      .ignoring()
        .antMatchers(NOT_AUTHENTICATED_MATCHERS);
  }
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    LOG.trace("Configuring the servlet with no authentication enabled");
    http
      .httpBasic()
        .disable()
      .csrf()
        .disable()
      .authorizeRequests()
        .anyRequest()
        .permitAll();
  }
}
