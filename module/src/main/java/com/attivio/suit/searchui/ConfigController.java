/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suit.searchui;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ConfigController {
  @Autowired
  private SearchUIConfigBean searchuiConfig; 
  
  @ResponseBody
  @RequestMapping("/users")
  public String users() {
    return "";
  }
  
  @ResponseBody
  @RequestMapping("/configuration")
  public String configuration() {
    String path = System.getProperty("attivio.project") + "/" + searchuiConfig.getConfigurationPath();
    try {
      return new String(Files.readAllBytes(Paths.get(path)));
    } catch (IOException e) {
      e.printStackTrace();
      return "";
    }
  }
}
