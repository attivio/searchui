/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin
@Controller
public class HomeController implements ErrorController {
  @RequestMapping("/")
  public String home() {
    return "index.html";
  }
  
  @RequestMapping("/error")
  public String error() {
    return "Error Handling!";
  }
  
  @Override
  public String getErrorPath() {
    return "/error";
  }
}
