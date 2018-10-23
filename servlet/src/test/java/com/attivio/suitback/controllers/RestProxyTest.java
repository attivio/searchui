/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import org.apache.http.HttpHost;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class RestProxyTest {
  
  RestProxy restProxy;

  @Before
  public void setUp() throws Exception {
    restProxy = new RestProxy();
    ReflectionTestUtils.setField(restProxy, "attivioProtocol", "http");
    ReflectionTestUtils.setField(restProxy, "attivioHostname", "localhost");
    ReflectionTestUtils.setField(restProxy, "attivioPort", 17000);
    ReflectionTestUtils.setField(restProxy, "attivioUsername", "aieadmin");
    ReflectionTestUtils.setField(restProxy, "attivioPassword", "attivio");
    ReflectionTestUtils.setField(restProxy, "attivioAuthToken", "");
    ReflectionTestUtils.setField(restProxy, "proxyHostname", "");
    ReflectionTestUtils.setField(restProxy, "proxyPort", 0);
    ReflectionTestUtils.setField(restProxy, "entityId", "");
  }

  @After
  public void tearDown() throws Exception {
    restProxy = null;
  }

  @Test
  public void testGetRestTemplate() {
    
    HttpHost proxyServer = restProxy.getProxyServer();
    
    // Shouldn't be set by default
    assertNull("The rest proxy should be null unless explicitly set", proxyServer);
    
    // Check HTTP variations with Java system properties
    System.setProperty("http.proxyHost", "example.com");
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example.com") || !(proxyServer.getPort() == 80)) {
      fail("The proxy should be example.com:80");
    }    
    System.setProperty("http.proxyPort", "7777");
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example.com") || !(proxyServer.getPort() == 7777)) {
      fail("The proxy should be example.com:7777 but it is " + proxyServer.toHostString());
    }    

    // Check HTTPS variations with Java system properties
    ReflectionTestUtils.setField(restProxy, "attivioProtocol", "https");

    System.setProperty("https.proxyHost", "example2.com");
    System.clearProperty("http.proxyPort");
    
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example2.com") || !(proxyServer.getPort() == 843)) {
      fail("The proxy should be example2.com:843");
    }
    
    System.setProperty("https.proxyPort", "7777");
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example2.com") || !(proxyServer.getPort() == 7777)) {
      fail("The proxy should be example2.com:7777 but it is " + proxyServer.toHostString());
    }    

    // Check setting our own properties
    ReflectionTestUtils.setField(restProxy, "proxyHostname", "example3.com");

    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example3.com") || !(proxyServer.getPort() == 843)) {
      fail("The proxy should be example3.com:843");
    }
    
    ReflectionTestUtils.setField(restProxy, "attivioProtocol", "http");
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example3.com") || !(proxyServer.getPort() == 80)) {
      fail("The proxy should be example3.com:80");
    }
    
    ReflectionTestUtils.setField(restProxy, "proxyPort", 8888);
    proxyServer = restProxy.getProxyServer(); 
    if (!proxyServer.getHostName().equals("example3.com") || !(proxyServer.getPort() == 8888)) {
      fail("The proxy should be example3.com:8888 but it is " + proxyServer.toHostString());
    }    
  }
}
