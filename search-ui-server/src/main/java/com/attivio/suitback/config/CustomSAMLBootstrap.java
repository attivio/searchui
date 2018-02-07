package com.attivio.suitback.config;

import org.opensaml.xml.security.BasicSecurityConfiguration;
import org.opensaml.xml.signature.SignatureConstants;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.saml.SAMLBootstrap;

@Configuration
public class CustomSAMLBootstrap extends SAMLBootstrap {
  @Override
  public void postProcessBeanFactory(ConfigurableListableBeanFactory arg0) throws BeansException {
    super.postProcessBeanFactory(arg0);
    BasicSecurityConfiguration config = (BasicSecurityConfiguration)org.opensaml.Configuration.getGlobalSecurityConfiguration();
    config.registerSignatureAlgorithmURI("RSA", SignatureConstants.ALGO_ID_SIGNATURE_RSA_SHA256);
    config.setSignatureReferenceDigestMethod(SignatureConstants.ALGO_ID_DIGEST_SHA256);
  }
  
  @Bean
  public static SAMLBootstrap SAMLBootstrap() {
    return new CustomSAMLBootstrap();
  }
}
