/**
* Copyright 2018 Attivio Inc., All rights reserved.
*/
package com.attivio.suitback.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  // Add the property logging.level.com.attivio.suitback.controllers.UserController
  // to the application.properties to get debug logging (e.g., with value of DEBUG).
  static final Logger LOG = LoggerFactory.getLogger(UserController.class);

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
    
    @Override
    public int hashCode() {
      final int prime = 31;
      int result = 1;
      result = prime * result + ((eMail == null) ? 0 : eMail.hashCode());
      result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
      result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
      result = prime * result + ((userId == null) ? 0 : userId.hashCode());
      return result;
    }

    @Override
    public boolean equals(Object obj) {
      if (this == obj)
        return true;
      if (obj == null)
        return false;
      if (getClass() != obj.getClass())
        return false;
      UserDetails other = (UserDetails) obj;
      if (eMail == null) {
        if (other.eMail != null)
          return false;
      } else if (!eMail.equals(other.eMail))
        return false;
      if (firstName == null) {
        if (other.firstName != null)
          return false;
      } else if (!firstName.equals(other.firstName))
        return false;
      if (lastName == null) {
        if (other.lastName != null)
          return false;
      } else if (!lastName.equals(other.lastName))
        return false;
      if (userId == null) {
        if (other.userId != null)
          return false;
      } else if (!userId.equals(other.userId))
        return false;
      return true;
    }

    @Override
    public String toString() {
      return "UserDetails [userId=" + userId + ", firstName=" + firstName + ", lastName=" + lastName + ", eMail=" + eMail + "]";
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
          LOG.trace("Asked for the user and got: " + result.toString());
          
          return result;
        }
      }
    }
    LOG.trace("Asked for the user but no user is logged in");
    return null;
  }
}
