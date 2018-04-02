/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.saml.storage.EmptyStorageFactory;

import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderBuilder;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderConfigurerAdapter;

@Configuration
public class ServiceProviderConfig extends ServiceProviderConfigurerAdapter {
  // Add the property logging.level.com.attivio.suitback.config.ServiceProviderConfig
  // to the application.properties to get debug logging (e.g., with value of DEBUG).
  static final Logger LOG = LoggerFactory.getLogger(ServiceProviderConfig.class);

  static final String DEFAULT_KEY = "localhost";
  static final String DEFAULT_PASSWORD = "";

  @Value("${security.saml.entityId:}")
  String entityId;
  
  @Value("${security.saml.metadataLocations:}")
  String metadataLocations;
  
  @Value("${security.saml.keyDerLocation:}")
  String keyDerLocation;
  
  @Value("${security.saml.keyPemLocation:}")
  String keyPemLocation;
  
  @Value("${saml.sso.context-provider.lb.enabled:false}")
  boolean lbEnabled;
  
  @Value("${saml.sso.context-provider.lb.scheme:http}")
  String lbScheme;
  
  @Value("${saml.sso.context-provider.lb.server-port:443}")
  int lbServerPort;
  
  @Value("${saml.sso.context-provider.lb.server-name:false}")
  String lbServerName;
  
  @Value("${saml.sso.context-provider.lb.context-path:/searchui}")
  String lbContextPath;
  
  @Value("${saml.sso.context-provider.lb.include-server-port-in-request-url:false}")
  boolean lbIncludeServerPortInRequestURL;
  
  @Override
  public void configure(ServiceProviderBuilder serviceProvider) throws Exception {
    LOG.trace("The service provider's entity ID is: " + entityId);
    LOG.trace("The default success URL is: /");
    LOG.trace("The default loggout URL is: /loggedout");
    LOG.trace("SAML IdP metadata is at: " + metadataLocations);
    LOG.trace("Key DER file is at: " + keyDerLocation);
    LOG.trace("Key PEM is at: " + keyPemLocation);

    // Only configure SAML authentication if we're asked to
    if (entityId != null && entityId.length() > 0) {
      EmptyStorageFactory messageStorage = new EmptyStorageFactory();
      
      if (lbEnabled) {
        LOG.trace("Using the load-balancer-aware SAML context provider");
        LOG.trace("The load balancer URL scheme is: " + lbScheme);
        LOG.trace("The load balancer URL server name is: " + lbServerName);
        LOG.trace("The load balancer URL server port is: " + lbServerPort);
        LOG.trace("The load balancer URL context path is: " + lbContextPath);
        LOG.trace("The load balancer URL will " + (lbIncludeServerPortInRequestURL ? "include" : "hide") + " the port");

        serviceProvider.samlContextProviderLb()
          .scheme(lbScheme)
          .serverName(lbServerName)
          .serverPort(lbServerPort)
          .contextPath(lbContextPath)
          .includeServerPortInRequestURL(lbIncludeServerPortInRequestURL)
          .messageStorage(messageStorage)
        .and()
          .keyManager()
            .privateKeyDERLocation(keyDerLocation)
            .publicKeyPEMLocation(keyPemLocation)
        .and()
          .metadataManager()
            .metadataLocations(metadataLocations)
            .refreshCheckInterval(-1)
        .and()
          .metadataGenerator()
            .entityId(entityId)
        .and()
          .extendedMetadata()
              .idpDiscoveryEnabled(false)
              .ecpEnabled(true)
        .and()
          .sso()
            .defaultSuccessURL("/")
            .idpSelectionPageURL(null)
        .and()
          .logout()
            .defaultTargetURL("/loggedout")
            .invalidateSession(true);
      } else {
        LOG.trace("Using the standard SAML context provider");
        
        serviceProvider
          .samlContextProvider()
            .messageStorage(messageStorage)
        .and()
          .keyManager()
            .privateKeyDERLocation(keyDerLocation)
            .publicKeyPEMLocation(keyPemLocation)
        .and()
          .metadataManager()
            .metadataLocations(metadataLocations)
            .refreshCheckInterval(-1)
        .and()
          .metadataGenerator()
            .entityId(entityId)
        .and()
          .extendedMetadata()
              .idpDiscoveryEnabled(false)
              .ecpEnabled(true)
        .and()
          .sso()
            .defaultSuccessURL("/")
            .idpSelectionPageURL(null)
        .and()
          .logout()
            .defaultTargetURL("/loggedout")
            .invalidateSession(true);
      }
    }
  }
}
