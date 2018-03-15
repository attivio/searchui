/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin
@Controller
public class ConfigController {
  
  @Value("${suit.attivio.users:}")
  private String usersFileLocation;

  @Value("${suit.attivio.configuration:}")
  private String configurationFileLocation;

  @ResponseBody
  @RequestMapping("/users")
  public String users() {
    if (usersFileLocation != null && usersFileLocation.length() > 0) {
      try {
        return new String(Files.readAllBytes(Paths.get(usersFileLocation)));
      } catch (IOException e) {
        e.printStackTrace();
        return "";
      }
    }
    return "";
  }
  
  @ResponseBody
  @RequestMapping("/configuration")
  public String configuration() {
    try {
      return new String(Files.readAllBytes(Paths.get(configurationFileLocation)));
    } catch (IOException e) {
      e.printStackTrace();
      return "";
    }
  }
}
