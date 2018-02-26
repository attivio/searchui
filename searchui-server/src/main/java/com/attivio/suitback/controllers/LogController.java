/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
@Controller
public class LogController {
  static final Logger LOG = LoggerFactory.getLogger("SUIT Servlet");
  
  /**
   * Causes a log message to be written to the configured log4j log.
   * 
   * @param message the message to write
   * @param level   the log level to use (one of ERROR, WARN, INFO, DEBUG, or TRACE);
   *                if omitted, defaults to INFO.
   */
  @RequestMapping("/log")
  public void log(@RequestParam(name="m", required=true) String message,
      @RequestParam(name="l", required=false, defaultValue="INFO") String level) {
    if ("ERROR".equalsIgnoreCase(level)) {
      if (LOG.isErrorEnabled()) {
        LOG.error(message);
      }
    } else if ("WARN".equalsIgnoreCase(level)) {
      if (LOG.isWarnEnabled()) {
        LOG.warn(message);
      }
    } else if ("INFO".equalsIgnoreCase(level)) {
      if (LOG.isInfoEnabled()) {
        LOG.info(message);
      }
    } else if ("DEBUG".equalsIgnoreCase(level)) {
      if (LOG.isDebugEnabled()) {
        LOG.debug(message);
      }
    } else if ("TRACE".equalsIgnoreCase(level)) {
      if (LOG.isTraceEnabled()) {
        LOG.trace(message);
      }
    } else {
      if (LOG.isWarnEnabled()) {
        LOG.warn("Unknown debug level (" + level + ") for message: " + message);
      }
    }
  }
}
