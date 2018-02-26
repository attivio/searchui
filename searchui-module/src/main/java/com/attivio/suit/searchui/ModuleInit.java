package com.attivio.suit.searchui;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Initialization code executed when module is loaded.
 */
public class ModuleInit {

  private static final Logger LOG = LoggerFactory.getLogger(ModuleInit.class);
    
  static {
    LOG.info("Loaded module searchui");
  }
}
