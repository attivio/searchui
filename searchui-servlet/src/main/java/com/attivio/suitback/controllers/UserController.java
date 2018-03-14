/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin
@Controller
public class UserController {
  static class UserDetails {
    private String userId;
    private String firstName;
    private String lastName;
    private String eMail;
    
    public UserDetails(String userId, String firstName, String lastName, String eMail) {
      this.userId = userId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.eMail = eMail;
    }
    
    public String getUserId() {
      return userId;
    }
    
    public String getFirstName() {
      return firstName;
    }
    
    public String getLastName() {
      return lastName;
    }
    
    public String getEMail() {
      return eMail;
    }
    
    public String getName() {
      return firstName + " " + lastName;
    }
  }
  
  @ResponseBody
  @RequestMapping("/rest/serverDetailsApi/user")
  public UserDetails user() {
    return UserController.getUserDetails();
  }
  
  static UserDetails getUserDetails() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null) {
      Object cred = auth.getCredentials();
      if (cred != null) {
        if (cred instanceof SAMLCredential) {
          SAMLCredential sCred = (SAMLCredential)cred;
          String userId = sCred.getAttributeAsString("UserID");
          String firstName = sCred.getAttributeAsString("FirstName");
          String lastName = sCred.getAttributeAsString("LastName");
          String eMail = sCred.getAttributeAsString("EmailAddress");
          
          UserDetails result = new UserDetails(userId, firstName, lastName, eMail);
          return result;
        }
      }
    }
    return null;
  }
}
