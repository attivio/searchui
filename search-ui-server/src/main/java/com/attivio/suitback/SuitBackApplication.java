package com.attivio.suitback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.WebApplicationInitializer;

import com.attivio.suitback.controllers.HomeController;
import com.attivio.suitback.controllers.HomeControllerHandlerMapper;
import com.github.ulisesbocchio.spring.boot.security.saml.annotation.EnableSAMLSSO;

@SpringBootApplication
@EnableSAMLSSO
public class SuitBackApplication extends SpringBootServletInitializer implements WebApplicationInitializer {
  // Note, we need to explicitly implement WebApplicationInitializer to allow the WAR to work on WebLogic
  
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
  public HomeControllerHandlerMapper myHomeControllerHandlerMapper(HomeController myHomeController) {
    HomeControllerHandlerMapper myCustomHandlerMapper = new HomeControllerHandlerMapper(myHomeController);
    myCustomHandlerMapper.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return myCustomHandlerMapper;
  }
}
