/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/

package com.attivio.suitback.config;

import java.io.IOException;
import java.io.PrintWriter;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.attivio.suitback.SuitBackApplication;

public class ConcurrentProxyRequestsTest {
  
  private AtomicInteger received = new AtomicInteger(0);
  
  private Server server;
  
  /**
   * This web application just counts the number of requests sent to it
   * @throws Exception
   */
  private void startSimpleWebApp() throws Exception {
    server = new Server(17000);
    ServletContextHandler context = new ServletContextHandler(server, "/", ServletContextHandler.NO_SECURITY);

    context.addServlet(new ServletHolder(new DefaultServlet() {
      private static final long serialVersionUID = 1L;

      @Override
      protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter w = response.getWriter();
        w.println("attivio");
        response.setStatus(200);
        // count the number of requests that made it here
        received.incrementAndGet();
      }
    
    }), "/*");
    
    server.start();
  }
  
  @Before
  public void startApplication() throws Exception {
    received = new AtomicInteger(0);
        
    startSimpleWebApp();
    SuitBackApplication.main(new String[0]);
  }
  
  /**
   * <p>This test uses a nested threadpool structure to make rapid concurrent requests.</p>
   * <p>When this test was written, it failed consistently due to both:<br/>
   * {@link java.util.ConcurrentModificationException}s where the application attempted to add to the {@link org.springframework.web.client.RestTemplate}'s messageConverters list while it was being iterated through,</br></br>
   * and {@link java.lang.NullPointerException}s where the {@link org.springframework.web.client.RestTemplate}'s messageConverters list was still empty at the time of iteration.
   * <p>
   */
  @Test
  public void test() {
    ForkJoinPool threadPool = new ForkJoinPool(10);
    
    final int roots = 10;
    final int requesters = 100;
    
    Runnable requester = new Runnable() {
      public void run() {
        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
          client.execute(new HttpGet("http://localhost:8080/rest/name"));
        } catch (IOException e) {
          Assert.fail(e.getMessage());
        }
      }
    };
    
    Runnable rootRequester = new Runnable() {
      public void run() {
        ForkJoinPool subThreadPool = new ForkJoinPool(10);
        for (int i = 0; i < requesters; i ++) {
          subThreadPool.execute(requester);
        }
        try {
          subThreadPool.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
          Assert.fail(e.getMessage());
        }
      }
    };
   
    for (int i = 0; i < roots; i ++) {
      threadPool.execute(rootRequester);
    }
    try {
      threadPool.awaitTermination(10, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
      Assert.fail(e.getMessage());
    }
    Assert.assertEquals("Not all of the sent requests were received.", roots*requesters, received.get());
  }
  
  @After
  public void stopApplication() throws Exception {
    server.stop();
  }

}
