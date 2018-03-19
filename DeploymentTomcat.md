# Search UI - Deploying to Tomcat
As described in the Search UI's [documentation](README.md), Search UI has two deployment options:
* **Embedded** - deploy as a module making it available from the Attivio Admin UI (Not recommended for a production user interface)
* **Stand-alone**  - deploy to an external web server such as Tomcat

This page describes how to implement the latter option and has been validated using the following versions of Tomcat:

| Apache Tomcat Version |
| ---|
| 9.0.5 |
| 8.5.24 |

Once you have built the application following the steps outlined in the [Developer's Guide](DevelopersGuide.md), execute the following steps to deploy your application to Tomcat.

## Deploying to Tomcat
1. Stop Tomcat
2. Copy the WAR file produced by the Maven build in the searchui-servlet project's target directory or download and unzip the [latest](https://github.com/attivio/searchui/releases/latest) pre-built release and copy the `searchui.war` file within it to `<tomcat home>/webapps`
3. Rename the WAR file to `searchui.war` (if deploying a custom-built application). The name of the WAR file should match the value set for `baseUri` in the `configuration.properties.js` file
4. create a file named `searchui.xml` in `<tomcat home>/conf/Catalina/localhost/` with the following contents, updating the value of "value" with the path where you intend to put the `application.properties` file:
```
<?xml version="1.0" encoding="UTF-8"?>
<Context>
    <Environment name="spring.config.location" value="file:/opt/tomcat/searchui/application.properties" type="java.lang.String"/>
</Context>
```
5. Copy the file found at `searchui/searchui-servlet/application.properties`, or the `application.properties` file within the latest release ZIP file, to the location specified above, updating the values that are set as needed (see below).
6. Copy the file at `searchui/searchui-frontend/configuration.properties.js`, or the one in the latest release ZIP file, to a location on your Tomcat server outside the `$CATALINA_HOME/webapps` directory and set the `suit.attivio.configuration` property in the `application.properties` file to that location. 
7. Modify any other properties in `configuration.properties.js` to customize your deployment of Search UI. See [How Do I Configure Search UI?](searchui#how-do-i-configure-search-ui) for details.
8. Start Tomcat.

## Compression
It is recommended that you enable compression when deploying to Tomcat. The various JavaScript libraries that are loaded on the first page accessed in Search UI are sizeable. Enabling compression can save server bandwidth and will improve load time and user experience. See the documentation for version [8](https://tomcat.apache.org/tomcat-8.5-doc/config/http.html) or [9](https://tomcat.apache.org/tomcat-9.0-doc/config/http.html) for details.

## Configuring SSL
When requiring users to login, whether using the built-in XML Authentication or integrating with an SSO provider, it is recommended to enable SSL.
1. Acquire an SSL certificate. A self-signed will suffice for development but will display a warning that it is untrusted. You can generate a keystore with a self-signed certificate by executing the following command. This will produce a file named `keystore.p12` in the directory where you run the command. You can move this file to a directory such as `/opt/tomcat/ssl`.
```
keytool -genkey -alias tomcat -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore keystore.p12 -validity 3650
Enter keystore password:
 Re-enter new password:
 What is your first and last name?
 [Unknown]:
 What is the name of your organizational unit?
 [Unknown]:
 What is the name of your organization?
 [Unknown]:
 What is the name of your City or Locality?
 [Unknown]:
 What is the name of your State or Province?
 [Unknown]:
 What is the two-letter country code for this unit?
 [Unknown]:
 Is CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
 [no]: yes
 ```
 2. Edit the `<tomcat home>/conf/server.xml` file and comment out the `Connector` element which runs on port `8080` by default:
 ```
 <!--
<Connector executor="tomcatThreadPool"
           port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
-->
```
3. Uncomment the `Connector` element which has the protocol attribute value of `Http11NioProtocol` and edit the `certificateKeyAlias`, `certificateKeystoreFile` and `certificateKeystorePassword` values as necessary:
```
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"
          maxThreads="150" SSLEnabled="true">
   <SSLHostConfig>
       <Certificate certificateKeyAlias="tomcat" certificateKeystoreFile="/opt/tomcat/ssl/keystore.p12" certificateKeystorePassword="password"
                    type="RSA" />
   </SSLHostConfig>
</Connector>
```
4. Restart Tomcat. Once Tomcat starts, your web app should be available using `https://` with port `8443`.
