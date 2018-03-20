/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.saml.context.SAMLContextProviderImpl;
import org.springframework.security.saml.storage.EmptyStorageFactory;

import com.github.ulisesbocchio.spring.boot.security.saml.bean.SAMLConfigurerBean;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Value("${security.saml.entityId:}")
  String entityId;
  
  @Value("${security.saml.signRequests:false}")
  boolean signRequests;
  
  @Value("${security.saml.metadataLocations:}")
  String metadataLocations;
  
  @Value("${security.saml.keyDerLocation:}")
  String keyDerLocation;
  
  @Value("${security.saml.keyPemLocation:}")
  String keyPemLocation;
  
  @Bean
  SAMLConfigurerBean saml() {
    return new SAMLConfigurerBean();
  }
  
  @Override
  @Bean
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }
  
  @Override
  public void configure(WebSecurity web) throws Exception {
    // The REST API, the special sockjs-node URLs, and any static files are NOT to be authenticated
    web
      .ignoring()
        .antMatchers(
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
           );
  }
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Only configure SAML authentication if we're asked to
    if (this.entityId != null && this.entityId.length() > 0) {
      SAMLContextProviderImpl contextProvider = new SAMLContextProviderImpl();
      contextProvider.setStorageFactory(new EmptyStorageFactory());
      
      http
        .httpBasic()
          .disable()
        .csrf()
          .disable()
        .anonymous()
          .disable()
        .apply(saml())
        .serviceProvider()
          .samlContextProvider(contextProvider)
          .metadataGenerator()
          .entityId(this.entityId)
        .and()
          .sso()
            .defaultSuccessURL("/user")
            .idpSelectionPageURL(null)
        .and()
          .logout()
            .defaultTargetURL("/loggedout")
            .invalidateSession(true)
        .and()
          .metadataManager()
            .metadataLocations(this.metadataLocations)
            .refreshCheckInterval(-1L)
        .and()
          .extendedMetadata()
            .idpDiscoveryEnabled(false)
            .ecpEnabled(true)
        .and()
          .keyManager()
            .privateKeyDERLocation(this.keyDerLocation)
            .publicKeyPEMLocation(this.keyPemLocation)
        .and()
          .http()
            .headers()
              .frameOptions()
                .sameOrigin()
          .and()
            // Any SAML-related endpoints are NOT to be authenticated
            .authorizeRequests()
              .requestMatchers(saml().endpointsMatcher())
              .permitAll()
          .and()
            // Finally, everything else IS to be authenticated
            .authorizeRequests()
              .anyRequest()
              .authenticated();
    } else {
      // For non-SAML installations, don't do any authentication in the back end
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
}
