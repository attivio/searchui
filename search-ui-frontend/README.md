<a href="http://www.attivio.com" target="_blank"><img src="attivio-logo.png" 
alt="IMAGE ALT TEXT HERE" width="240" border="0" /></a>

# Attivio Search UI

The Attivio Search UI is an application built on top of Attivio’s Search
UI Toolkit, or SUIT. The SUIT library is available in a separate repository
and via NPM (see below for details).

The Attivio Search UI allows you to search across and view the data in the
index of your Attivio Platform installation. You can customize it to suit your
needs and can also use it as the basis for creating your own, brand-new
search application.

The Attivio Search UI is a web application written in JavaScript and based
on the React project. It runs in the user’s browser. This component is in
the search-ui-frontend directory of this repository and consists of
application-level code for searching the Attivio index, including the
definitions of the pages in the application and the logic of how they're
connected.

The project also contains two additional components that allow you to host
the web application, either on the Attivio node servers or from a servlet
container such as Apache Tomcat. The availability of certain functionality
will vary depending on how you host and configure the Search UI application,
as described below.

## What is SUIT?

The SUIT library consists of various React comnponents used by the Search UI
to render the UI and to interact with the Attivio Platform. It also includes
some API and utility classes, mainly used by the components directly but which
the application-level code can also access. See the [GitHub repository](https://github.com/attivio/suit)
for the SUIT library for documentation on using its components and other
functionality.

## How Do I Build the Search UI?

The entire Search UI project is set up to be built using Apache Maven. You need
to have at least version 3.5 of Maven installed (see their [project’s page](https://maven.apache.org)
for information on installing it if necessary), and then simply run `mvn clean install`
from your terminal, in the search-ui directory. Maven will build all of the three
sub-projects, search-ui-frontend, which builds the actual JavaScript code for the
web application, search-ui-server, which builds the servlet that can be used to
host the Search UI application in a servlet container such as Apache Tomcat, and
search-ui-module, which builds an Attivio module that can be installed into your
Attivio Platform to host the Search UI from the Attivio node servers.

## How Do I Configure the Search UI?

There are three places where the Search UI can be configured, one for each of the
three components. Depending on which items you are configuring, you will need to
edit the configuration files for the web application itself, for the servlet, or
for the Attivio module.

### Configuring the Web Application

The Search UI web application is configured by editing the 

### Configuring the Servlet

### Configuring the Attivio Module

## How Can I Customize the Search UI?

### Developing the Search UI Application

When developing your own Search UI application, you will probably want to 


Getting Started
---------------

We've tried to make this as easy as possible to use by eliminating a lot of the setup and configuraiton usualy needed to create a project. To get started:

1. Make sure you have Node.js (greater than or equal to version 6.11) installed. If you don't, you can get it from the [project's website](https://nodejs.org). Installing Node also installs the Node Package Manager, or NPM. You can double-check that they're installed and working by typing `node -v` or `npm -v` in your terminal.
2. Make sure you have Apache Maven installed (greater than or equal to version 3.2). If you don't, you can get it from the [project's website](http://maven.apache.org).
3. Use Git to clone or fork this repository.
4. In your terminal, change to the new repository's directory.
5. Run the command `npm install`. This will download all of the project's dependencies from the Internet. They live in the `node_modules` directory and are marked ignored for Git.
6. Run the `npm start` command to compile the project and start the development server.
7. Point your browser to [http://localhost:8080](http://localhost:8080) to see the initial state of the project.
8. Customize the application to suit your needs. As long as the `npm start` command is still running, any files that you change are immediately compiled and pushed to your browser.

Documentation for the Toolkit
----------------------

See the full [Search UI Toolkit documentation](http://answers.attivio.com) online at Attivio Answers.

Notes on the Included Libraries
-------------------------------

The project includes React components from several libraries which you can use as-is in your projects, in addition to the custom Attivio components. You don't have to do anything to use them other than importing them into your component files. These components are documented on their projects' respective websites, as follows:
* React-Bootstrap: [main page](https://react-bootstrap.github.io/) | [components page](https://react-bootstrap.github.io/components.html)
* React-Highcharts: [main page](https://github.com/kirjs/react-highcharts) | [Highcharts documentation](https://www.highcharts.com/)
* React-Router: [main page](https://reacttraining.com/react-router/)

Notes on Building
-----------------

Building of SUIT applications is done using Apache Maven. The 

The project includes the Webpack tool to coodinate building your application. It, in turn, relies on the Babel transpiler to convert the ES6 and JSX code of your project into standard JavaScript that your users' browsers can run.

The following commands are available to help you build your project:
* `npm start`: compiles the project, starts the local web server, and watches for changes
* `npm run prod`: compiles a production version of your project that can be deployed to any web server.
* `npm flow`: checks your project's source code for problems with type safety.
* `npm lint`: checks your project's source code for potential bugs and for stylistic conformity.
* `npm build-module`: compiles a production version of your project and packages is up as an Attivio module that can be installed in your Attivio platform instance and can serve your application right from your Attivio nodes without needing another server.
