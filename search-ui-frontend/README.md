SUIT: Attivio's Search UI Toolkit
=========================

SUIT is a collection of tools and components that you can use to create your own applications on top of the powerful search capabilities of the index in the Attivio platform.

The library consists of three pieces:
* the core SUIT component library which is available as an NPM-based dependency (although you can access the source code to both see how the components work and use as a basis for creating your own components),
* the SUIT application layer, which contains templates for application pages which you can use as-is or modify to suit your needs, and
* the SUIT servlet layer, which acts as a bridge between your SUIT-based application running in the use's browser and the Attivio platform servers and also serves the files that comprise your application.

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
* React-Bootstrap-Table: [main page](https://allenfang.github.io/react-bootstrap-table/)
* React-Highcharts: [main page](https://github.com/kirjs/react-highcharts) | [Highcharts documentation](https://www.highcharts.com/)
* React-Routr: [main page](https://reacttraining.com/react-router/)

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
