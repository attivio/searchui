/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.saml.storage.EmptyStorageFactory;
import org.springframework.security.saml.websso.WebSSOProfileConsumerImpl;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;

import com.github.ulisesbocchio.spring.boot.security.saml.bean.SAMLConfigurerBean;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderBuilder;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderConfigurerAdapter;

@Configuration
@Profile("saml")
public class SecurityConfigSAML extends ServiceProviderConfigurerAdapter {
  // Add the property logging.level.com.attivio.suitback.config.SecurityConfigSAML
  // to the application.properties to get debug logging (e.g., with value of DEBUG).
  static final Logger LOG = LoggerFactory.getLogger(SecurityConfigSAML.class);

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
  
  @Value("${saml.sso.context-provider.lb.server-name:}")
  String lbServerName;
  
  @Value("${saml.sso.context-provider.lb.context-path:/searchui}")
  String lbContextPath;
  
  @Value("${saml.sso.context-provider.lb.include-server-port-in-request-url:false}")
  boolean lbIncludeServerPortInRequestURL;
  
  @Value("${saml.sso.maxAuthenticationAge:86400}")
  long maxAuthenticationAge;
  
  @Value("${saml.sso.responseSkew:60}")
  int responseSkew;
  
  @Value("${saml.sso.maxAssertionTime:3000}")
  int maxAssertionTime;
  
  @Value("${suit.attivio.corsOrigins:*}")
  String corsOrigins;

  @Value("${suit.attivio.corsMethods:*}")
  String corsMethods;
  
  @Autowired
  SAMLConfigurerBean samlConfigurer;

  @Override
  public void configure(ServiceProviderBuilder serviceProvider) throws Exception {
    LOG.trace("The service provider's entity ID is: " + entityId);
    LOG.trace("Setting the max authentication age to: " + maxAuthenticationAge + " seconds");
    LOG.trace("Setting the max response skew to: " + responseSkew + " seconds");
    LOG.trace("Setting the max assertion time to: " + maxAssertionTime + " seconds");
    LOG.trace("SAML IdP metadata is at: " + metadataLocations);
    LOG.trace("Key DER file is at: " + keyDerLocation);
    LOG.trace("Key PEM is at: " + keyPemLocation);
    
    WebSSOProfileConsumerImpl ssoProfileConsumer = new WebSSOProfileConsumerImpl();
    ssoProfileConsumer.setMaxAuthenticationAge(maxAuthenticationAge);
    ssoProfileConsumer.setResponseSkew(responseSkew);
    ssoProfileConsumer.setMaxAssertionTime(maxAssertionTime);

    EmptyStorageFactory messageStorage = new EmptyStorageFactory();
    
    if (lbEnabled) {
      LOG.debug("Using the load-balancer-aware SAML context provider");
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
        .ssoProfileConsumer(ssoProfileConsumer)
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
          .defaultTargetURL("/")
          .clearAuthentication(true)
          .invalidateSession(true);
    } else {
      LOG.debug("Using the standard SAML context provider");
      
      serviceProvider
        .samlContextProvider()
          .messageStorage(messageStorage)
      .and()
        .ssoProfileConsumer(ssoProfileConsumer)
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
          .defaultTargetURL("/")
          .invalidateSession(true);
    }
  }

  @Override
  public void configure(WebSecurity web) {
    // The REST API, the special sockjs-node URLs, and any static files are NOT to be authenticated
    web
      .ignoring()
        .antMatchers(SecurityConfigBasic.NOT_AUTHENTICATED_MATCHERS);
  }
  
  @Override
  public void configure(HttpSecurity http) throws Exception {
    LOG.debug("Configuring the servlet with SAML authentication enabled");
    http
    .httpBasic()
      .disable()
    .addFilterBefore(new WebSecurityCorsFilter(corsOrigins, corsMethods), ChannelProcessingFilter.class)
    .csrf()
      .disable()
    .anonymous()
      .disable()
    .headers()
      .cacheControl() 
        .disable()
      .frameOptions()
        .sameOrigin()
    .and()
      // Any SAML-related endpoints are NOT to be authenticated
      .authorizeRequests()
        .requestMatchers(samlConfigurer.endpointsMatcher())
        .permitAll()
    .and()
      // Finally, everything else IS to be authenticated
      .authorizeRequests()
        .anyRequest()
        .authenticated();
  }
}
