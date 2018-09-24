/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.config;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class WebSecurityCorsFilterTest {

  @Test
  public void testGetAllowedCorsOrigin() {
    WebSecurityCorsFilter filter;

    // Test the asterisk case 
    filter = new WebSecurityCorsFilter("*", "");
    assertEquals(filter.getAllowedCorsOrigin("*"), "*");
    assertEquals(filter.getAllowedCorsOrigin("http://myhost:17000"), "*");
    
    // Test with a single value
    filter = new WebSecurityCorsFilter("http://myhost:17000", "");
    assertEquals(filter.getAllowedCorsOrigin("http://myhost:17000"), "http://myhost:17000");
    assertEquals(filter.getAllowedCorsOrigin("http://shadyhost:666"), null);

    // Test with multiple values with commas and spaces
    filter = new WebSecurityCorsFilter("http://myhost:17000, http://yourhost:8080", "");
    assertEquals(filter.getAllowedCorsOrigin("http://myhost:17000"), "http://myhost:17000");
    assertEquals(filter.getAllowedCorsOrigin("http://yourhost:8080"), "http://yourhost:8080");
    assertEquals(filter.getAllowedCorsOrigin("http://shadyhost:666"), null);

    // Test with multiple values with commas and no spaces
    filter = new WebSecurityCorsFilter("http://myhost:17000, http://yourhost:8080", "");
    assertEquals(filter.getAllowedCorsOrigin("http://myhost:17000"), "http://myhost:17000");
    assertEquals(filter.getAllowedCorsOrigin("http://yourhost:8080"), "http://yourhost:8080");
    assertEquals(filter.getAllowedCorsOrigin("http://shadyhost:666"), null);
  }
}
