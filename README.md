[![Build Status](https://travis-ci.org/attivio/searchui.svg)](https://travis-ci.org/attivio/searchui)

<a href="http://www.attivio.com" target="_blank"><img src="images/attivio-logo.png" alt="Attivio" width="240" border="0" /></a>
## Table of Contents
* [Overview](#overview)
* [Project Organization](#project-organization)
* [What is SUIT?](#what-is-suit)
* [Installation and Deployment](#installation-and-deployment)
* [How Can I Customize the Search UI?](#how-can-i-customize-the-search-ui)
* [Security](#security)
* [Cognitive Search](#cognitive-search)
* [Ask a Question](#ask-a-question)
* [360&deg; View](#360-view)
* [Insights](#insights)
* [How Do I Configure Search UI?](#how-do-i-configure-search-ui)
* [Supported Browsers](#supported-browsers)
* [Contributing](#contributing)

## Overview
The Attivio **Search UI** is an application built on top of Attivio’s Search UI Toolkit, or **SUIT**. The SUIT library is available in a [separate repository](https://github.com/attivio/suit) and via NPM (see “What is SUIT?” below for more details).

The Attivio Search UI allows you to search across and view the data in the index of your Attivio, Elasticsearch, or Solr installation. You can use it as-is, you can customize it to meet your needs, or you can use it as the starting point when creating your own search-centered application.

## Using Search UI
If you are interested in how to use the Search UI application as an end-user, see [Using the Search UI](UsingSearchUI.md). The remainder of the current README file deals with deploying and customizing the Search UI application.

## Project Organization
The Attivio Search UI is a web application written in JavaScript and based on the [React](https://reactjs.org) project. It runs entirely in the user’s browser. The code for the web application is in the [**frontend**](https://github.com/attivio/searchui/tree/master/frontend) directory of the repository and consists of application-level code for searching the index including the definition of the pages in the application and the logic of how they’re connected. The application-level code is relatively minimal, merely dictating how the components (defined in the SUIT library mentioned above) are laid out and condfigured; the bulk of the code that implements the application is in the SUIT library itself.

The repository also contains two additional components that allow hosting of the Search UI web application, either on one or more Attivio node servers as a module ([**module**](https://github.com/attivio/searchui/tree/master/module)) or in a servlet container such as Apache Tomcat ([**servlet**](https://github.com/attivio/searchui/tree/master/servlet)). The functionality of the Search UI application varies slightly depending on how it is hosted and configured, as described below.

## What is the SUIT Library?

The individual UI elements that make up the Search UI application are defined in the SUIT library. These include more basic components such as pop-up menus and text fields as well as more complex components such as one that renders an entire document from the index or one that knows how to take the search criteria provided by the user and perform a search of the index. In addition to UI components, SUIT contains a number of API and utility classes which facilitate the interactions between the UI and the back-end server. See the [GitHub repository](https://github.com/attivio/suit) for the SUIT library for detailed documentation on its components and other functionality.

## Installation and Deployment of Search UI
As was alluded to in discussing the organization of the Search UI repository, there are two options when deploying Search UI. It can be run “embedded,” hosted by the Attivio node server or it can be run “stand-alone,” hosted by a servlet container:

### Embedded

As a module in the Attivio project is the most straightforward way to deploy Search UI. When you do this, a link in the Attivio Administration UI will be created under the “Query” heading. This will open a new tab and take the user to the Search UI application. (The actual URL for Search UI will be the server’s name and port followed by `/searchui`, for example, `http://localhost:17000/searchui`.)

The Search UI module is included with the Attivio Platform installer. You can also obtain the latest build of the module on the [Attivio Answers](https://answers.attivio.com/display/extranet55/Search+UI+Download) website.

### Stand-alone

Stand-alone deployments are recommended when Search UI is used as the primary user interface in your production environment as this approach allows you to manage and scale the Search UI application separately from the Attivio nodes. If you require integration with a SAML-based identity provider (IdP) for single-sign-on authentication, you will need to perform a stand-alone deployment. (Of course, if you are using the Search UI application with a non-Attivio back end, then you must use the stand-alone method for deploying it since there will be no Attivio nodes.)

Stand-alone deployments can be done on the same host as Attivio nodes provided there are sufficient resources, though in many situations, dedicated Search UI hosts are recommended to decouple the two.

See the [stand-alone deployment documentation](DeploymentTomcat.md) for details on how to configure Apache Tomcat to host the Search UI application. (Although they are written specifically for Tomcat, they are generally useful for deploying to other servlet containers such as Jetty, GlassFish, JBoss, WebSphere, etc…)

### Using SSO for the Attivio REST APIs

If you are writing your own front-end search application that needs access to the Attivio REST APIs but you don't want to use Search UI and SUIT, you can leverage the Search UI servlet used when deploying to Tomcat in order to provide SAML-based access to these APIs. This prevents you from having to expose the credentials of the Attivio server in your JavaScript code. To learn more about how you can do this, see [Configuring REST SSO](ConfiguringRESTSSO.md).

## How Can I Customize the Search UI?

Depending on what you want to do with the Search UI, you can customize it in a few different ways. Many aspects of the application can be changed by editing the configuration (in [`configuration.properties.js`](https://github.com/attivio/searchui/tree/master/frontend/configuration.properties.js)). There are examples of what you can change and how to do so in the [FAQ document](FAQ.md), as well as in the comments in the configuration file itself.

If you are deploying the application as an Attivio module, you can place your updated configuration file in your project’s `resources` directory. If you are deploying to a servlet container, the `application.properties` file should point to your custom configuration file.

To build your own search application using the SUIT library, with any or all of the features Search UI provides, see the [Developer’s Guide](DevelopersGuide.md).

---

## Security
Search UI can be configured to require users to log in. The options vary depending on your deployment type.

| Deployment Type | Security Options | 
| --------------- | ---------------- | 
| Embedded (within Attivio) | <ul><li>[Active Directory](https://answers.attivio.com/display/extranet55/Active+Directory+Authentication+Provider)</li><li>[XML](https://answers.attivio.com/display/extranet55/XML+Authentication+Provider)</li></ul> | 
| Stand-alone (i.e. Tomcat)	 | <ul><li>[SSO](ConfiguringSSO.md)</li><li>[XML](ConfiguringXMLAuthentication.md)</li></ul> | 

Depending on the security option, users will either be presented with Attivio login form or one presented by the Identity Provider.

<img src="images/login-attivio.png" alt="Attivio Login Form" width="45%" /> <img src="images/login-okta.png?raw=true" alt="Okta Login Form" width="45%" />

---
<a name="configuration"></a>
## How Do I Configure Search UI?
Many Search UI features are configurable, including pointing it to an Elasticsearch or Solr installation.  These settings support rapid prototyping for demos and proof-of-concept projects.  

> Setting these preferences will affect all users who may be accessing this application.
> If any values are not specified, the application uses system-application defaults.
> If Search UI is deployed to multiple web servers or Attivio nodes, the preferences must be manually synchronized across all nodes.

The full list of properties and the description of each can be found in the [configuration.properties.js](frontend/configuration.properties.js) file.

<a name="supported-browsers"></a>
## Supported Browsers
Search UI is tested with the following browsers at release time:

**Windows Clients:**

* Chrome stable - latest stable version
* Microsoft Edge - latest stable version
* Internet Explorer 11

**Mac clients:** 
* Chrome stable - latest stable version

**Linux clients:** 
* Chrome stable - latest stable version

**Recommended Screen Resolution:**
* 1280 x 800 pixels, 1600 x 900 pixels or higher

## Contributing
To report an issue or contribute, see [CONTRIBUTING.md](CONTRIBUTING.md)
