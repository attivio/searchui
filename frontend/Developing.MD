# Developing with Search UI

This document describes some techniques you may find helpful while developing with the Search UI project.

## Development Environment

While you don’t need to have anything installed other than Maven when building the project, you will want to have Node and the Node Package Manager installed directly on your developmnent machine to facilitate quick turnarounds while developing.

### Node and NPM

You can obtain Node from the [project’s website](nodejs.org). Installing Node on your machine will automatically install NPM as well.

### IDE

You are free to use whatever IDE or code editor you enjoy working with. However, in developing the SUIT library and the Search UI project, we have been using Microsoft’s free Visual Studio Code. You can download it from the [Microsoft website](code.visualstudio.com). It’s very configurable and has a lot of plug-ins available. We, for example, have it configured to automatically run Flow and ESLint on the code as we type, which helps eliminate errors more efficiently.

## Running

Early in the development of the project we were using Webpack’s development server but once the project moved to live inside either the WAR file for app-server deployments or the ZIP file for Attivio-module deployments, the separate server was too dissimilar to the actual runtime environment for testing to be very useful. Here is what we do instead (we’ve also created scripts and bash aliases to automate some of these steps):

### Running with Tomcat

When running with Tomcat, we follow these steps for making changes and quickly seeing their effect in the UI.

First, run the normal Maven build (`mvn clean install` from the root directory of the searchui project, for example) to build the UI and the WAR file that wraps it. The WAR will be placed into the searchui/searchui-server/target directory. Copy the WAR file to Tomcat’s webapps directory, renaming it to match your basename (e.g., searchui.war). When Tomcat runs, it will automatically unpack the WAR into a directory (e.g., webapps/searchui).

The output of the Webpack build is in the directory WEB-INF/classes/static inside your webapp directory (e.g., $CATALINA_HOME/webapps/searchui/WEB-INF/classes/static). You can now use the command `npm run watch` from within the searchui/searchui-frontend directory, passing the path to this directory, to have Webpack watch the source tree for changes and continuously compile and update the expanded WAR.

Doing this, changes are visible in your browser after refreshing in a second or two after you’ve saved them in the editor.

You also get the advantages of running the application within the servlet, such as accesst to SAML-based single sign on, and the REST API proxying.

### Running as a Module

When running as an Attivio module, we follow these steps for making changes and quickly seeing their effect in the UI.

First, run the normal Maven build (`mvn clean install` from the root directory of the searchui project, for example) to build the UI and the module ZIP file that wraps it. The ZIP will be placed into the searchui/searchui-module/target directory. Run the command `aie-exec modulemanager -i` followed by the path to the ZIP file to install the module into the local copy of Attivio on your machine.

This will, among other things, add a directory to your Attivio installation under the webapps/searchui/dist directory. You can now use the command `npm run watch` from within the searchui/searchui-frontend directory, passing the path to this directory, to have Webpack watch the source tree for changes and continuously compile and update the expanded WAR.

Doing this, changes are visible in your browser after refreshing in a second or two after you’ve saved them in the editor.

You also get the advantages of running the application within the context of the node, such as accesst to Attivio’s web applicaiton security.

## Developing the SUIT Library Itself

If you need to make changes to the SUIT library itself, you can speed up your work by following the steps here in addition to those described in the SUIT project’s Develping.MD file.
