# Search UI - Configuring XML Authentication
Search UI supports authentication of users managed via an XML file.

Configuring Search UI to work this way involves a few simple steps outlined below.

## Step 1 - Copy the 'users.xml' file to a location on your Tomcat server outside the `$CATALINA_HOME/webapps/directory`. This allows you to edit the application's users without having to redeploy a WAR file.

## Step 2  - Populate the 'users.xml' file with your usernames and passwords

## Step 2 - Configure Search UI authType in the `configuration.properties.js` file

## Step 3 - Configure the location of the `users.xml` file

## Step 4 - Test logging in
Once you have completed the above steps and restarted the web server, access the URL of the Search UI. You will be redirected to Search UI's login form. 



After submitting your credentials, you will be redirected to Search UI's landing page. You will be logged in and your name will appear in the upper right corner.

