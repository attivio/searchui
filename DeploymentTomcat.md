## Overview
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
2. Copy the WAR file to <tomcat home>/webapps
3. **Add step(s) for setting external properties and/or users.xml contents**
4. Rename war file to `searchui.war`. The name of the WAR file should match the value set for `baseUri` in the `configuration.properties.js` file
5. create a file named `searchui.xml` in `<tomcat home>/conf/Catalina/localhost/` with the following contents, updating the value of "value" with the path where you intend to put the `application.properties` file:
```
<?xml version="1.0" encoding="UTF-8"?>
<Context>
    <Environment name="spring.config.location" value="file:/opt/tomcat/searchui/application.properties" type="java.lang.String"/>
</Context>
```
6. Create a file named `application.properties` in the location specified above with the following content, updating the values as needed:
```
suit.attivio.protocol=http
suit.attivio.hostname=someserver03.attivio.com
suit.attivio.port=17000
suit.attivio.username=username
suit.attivio.password=password
```
7. Start Tomcat

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
       <Certificate certificateKeyAlias="tomcat" certificateKeystoreFile="/opt/tomcat/ssl/keystore.p12" certificateKeystorePassword="attivio"
                    type="RSA" />
   </SSLHostConfig>
</Connector>
```
4. Restart Tomcat. Once Tomcat starts, your web app should be available using `https://` with port `8443`.
