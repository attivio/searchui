package com.attivio.suitback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.security.saml.storage.EmptyStorageFactory;
import org.springframework.security.saml.storage.SAMLMessageStorageFactory;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.filter.CharacterEncodingFilter;

import com.attivio.suitback.controllers.HomeController;
import com.attivio.suitback.controllers.HomeControllerHandlerMapper;

@SpringBootApplication
public class SuitBackApplication extends SpringBootServletInitializer implements WebApplicationInitializer {
  // NOTE: Even though SpringBootServletInitializer implements WebApplicationInitializer,
  // we apparently need to explicitly implement it here to allow the WAR to work on WebLogic.
  
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
      return application.sources(SuitBackApplication.class);
  }
  
  /**
   * Main method that can be run to test in Eclipse or in an executable JAR/WAR.
   * 
   * @param args        the parameters from the CLI
   * @throws Exception  if an error occurs
   */
	public static void main(String[] args) throws Exception {
		SpringApplication.run(SuitBackApplication.class, args);
	}
	
  @Bean
  @Profile("saml")
  SAMLMessageStorageFactory samlMessageStorageFactory() {
    return new EmptyStorageFactory();
  }

  @Bean
  CharacterEncodingFilter characterEncodingFilter() {
	  CharacterEncodingFilter filter = new CharacterEncodingFilter();
	  filter.setEncoding("UTF-8");
	  filter.setForceEncoding(true);
	  return filter;
  }
 
  @Bean
  public HomeControllerHandlerMapper myHomeControllerHandlerMapper(HomeController myHomeController) {
    HomeControllerHandlerMapper myCustomHandlerMapper = new HomeControllerHandlerMapper(myHomeController);
    myCustomHandlerMapper.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return myCustomHandlerMapper;
  }
}
