# Search UI - Configuring XML Authentication
Search UI supports authentication of users managed via an XML file.

Configuring Search UI to work this way involves a few simple steps outlined below.

## Step 1 - Copy the [`users.xml`](searchui-frontend/users.xml) file to a location on your Tomcat server outside the `$CATALINA_HOME/webapps/directory` 
This allows you to edit the application's users without having to redeploy a WAR file. For example, you could copy the file to `/opt/tomcat/searchui/users.xml`.

## Step 2  - Populate the 'users.xml' file with your usernames and passwords
For each user you wish to add, create the following element in the XML file:
```
<user id="username" name="Full Name" password="password" />
```
You can use cleartext passwords, but then anyone who views the file can read the passwords. To avoid this issue, encrypt the password values using OBF or MD5. To generate passwords for users you can use Attivio's [aie-exec password](https://answers.attivio.com/display/extranet55/AIE-Exec#AIE-Exec-password) or other utility. 

## Step 2 - Configure Search UI authType in the `configuration.properties.js` file
Within the [`configuration.properties.js`](searchui-frontend/configuration.properties.js) file, set `authType` to `XML` to enable XML-based authentication.

## Step 3 - Configure the location of the `users.xml` file
When [deploying the application](DeploymentTomcat.md), set the `suit.attivio.users` property within the [`application.properties`](searchui-servlet/application.properties) file to the location of your `users.xml` file.

## Step 4 - Test logging in
Once you have completed the above steps and restarted the web server, access the URL of the Search UI. You will be redirected to Search UI's login form. 

<img src="images/login-form-xml.png?raw=true" alt="Log In Form" width="100%" />

After submitting your credentials, you will be redirected to Search UI's landing page. You will be logged in and your name will appear in the upper right corner.

<img src="images/logged-in-xml.png?raw=true" alt="Log In Form" width="100%" />
