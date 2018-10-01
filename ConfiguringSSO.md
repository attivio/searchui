# Search UI - Configuring SAML-Based SSO
Search UI supports Single Sign-on (SSO) using any SAML 2.0 identity provider.

SAML (Security Assertion Markup Language) is an XML-based standard for securely exchanging authentication and authorization information between entities — specifically between identity providers, service providers, and users. Well-known identity providers (IdPs) include Okta, Microsoft Active Directory Federation Services (ADFS), and Microsoft Azure AD among others. See [Wikipedia](https://en.wikipedia.org/wiki/SAML_2.0) for more information.

You will need to do the following steps to set up the SAML authentication:

1. Configure Search UI to run in a servlet container such as Tomcat (SAML authentication is not supported when running as a module inside the Attivio instance)
2. Configure your SAML IdP to know about the Search UI application.
3. Set up a public/private key pair to be used when encrypting messages sent to the IdP.
4. Configure the Search UI application to know you're using SAML.
5. Configure the servlet to know you are using SAML.
6. Configure the servlet to know if you are behind a reverse proxy or load balancer.
7. Test your configuration.

## Step 1: Configuring the Search UI Servlet

See [Deploying to Tomcat](DeploymentTomcat.md) for details on how to do this. In particular, you will probably want to follow the steps to configure the servlet to run using TLS (SSL) to secure the connection between it and the user.

Note that when deploying Search UI with SAML authentication, there is no need to configure the property `suit.attivio.users` in `application.properties`.

## Step 2: Configuring the Identity Provider

You will need to consult the documentation for your particular identity provider to understand how it should be configured.

**Single Sign On URI:** The IdP will ask you to provide the URI to use for You will need to know the host and port you used when configuring the servlet to provide to the IdP. Use them along with the path `/saml/SSO` to create the full URI to give to the IdP. For example, if your servlet is running securely on host searchui.example.com at port 8443, you would use as the URI `https://searchui.example.com:8443/searchui/saml/SSO`.

**Service Provider Identity ID/Audience URI:** This is used to identify the service provider to the identity provider. You can usually use the URI the user will provide to access your Search UI instance, or any other unique string. You will need use this when configuring the `application.properties` file on your server later.

**Attibute Statements:** You need configure the identity provider so that it gives the Search UI application the information it needs about the logged-in user. In particular the following fields should be set (if you are customizing your Search UI application, access is provided to any of the attributes you define here, but these ones are used by the default application code):

| Name | Required | Description |
| --- | --- | --- |
| UserID | Yes | This is the field that the Search UI application will pass to the Attivio platforn when performing searches so it can provide the proper result set. This should be the same field in the Identity provider that was used when ingesting principals into the platform. (If neither the first or last name is set, then the UuserID value will be displayed in the UI to identify the user. |
| FirstName | No | This is the user's first name. If provided, it will be used (in conjunction with the last name, if available) to display in the UI as the logged-in user. |
| LastName | No | This is the user's last name. If provided, it will be used (in conjunction with the first name, if available) to display in the UI as the logged-in user. |
| EmailAddress | No | This is the user's email address. It is currently not used by the out-of-the-box Search UI application. |

**Metadata File:** When the application has been configured, you should be able to download a metadata file for the application on your IdP. You will need to use this when configuring the `application.properties` file later.

## Step 3: Setting up Keys

If you aready have a public/private key you want to use, you can use that for SAML also.

If you need to create a new one, you can use the following steps:

1. Execute the following command from your command shell (feel free to use another name instead of "localhost"):

    `openssl genrsa -out localhost.key 2048`

    This will generate a key file (`localhost.key`)

    `openssl req -new -x509 -key localhost.key -out localhost.pem -days 3650 -subj /CN=localhost`

    This will generate a certificate using the newly created key (`localhost.pem`)

    `openssl pkcs8 -topk8 -inform PEM -outform DER -in  localhost.key -out  localhost.key.der -nocrypt`

    This will create a DER format file from the PEM one (localhost.key.der)

2. Copy the `localhost.pem` and `localhost.key.der` files to the server that will run the servlet. You will need to use their locations when configuring the `application.properties` file later.

## Step 4: Configuring the Search UI Application

You will need to edit the file `configuration.properties.js`, which specifies how the Search UI application works, to let it know that authentication will use SAML and will be done by the servlet.

There is a property called `authType` which needs to be set to the value `'SAML'` (see the comment before the property for a more detailed description of its use).

## Step 5: Configuring the Servlet

You configure the servlet by editing the file `application.properties`. The file itself should have been put into place as part of step 1. Here we will just be editing some of the properties it defines. For more detail about a given property, see the comments in the default `application.properties` file.

The following properties are all listed in `application.properties` but are prefaced with an "#" to comment them out so they're ignored by the servlet. You will need to remove the initial "#" and ensure that the proper value is supplied, as described below (if you don't need to set one the non-required properties, you can leave it commented out).

| Property Name | Required | Format | Description |
| --- | --- | --- | --- |
| `spring.profiles.active` | Yes | `saml` | This is the property that triggers the use of all other SAML-related properties. Set it to `saml` for SAML authentication or leave the property commented out for non-SAML use cases |
| `security.saml.entityId` | Yes | Text string | This is the Service Provider Identity ID/Audience URI that you provided to the identity provider when configuration it to know about Search UI. |
| `security.saml.metadataLocations` | Yes | File URI | This is the location of the metadata file provided by your IdP. This URI should point to the location on the server where you put the file. It should be in the form `file:///PATH/TO/METADATA.XML`. |
| `security.saml.keyDerLocation` | Yes | File URI | This is the location of the DER file for your signing certificate (created in step 3, above). This URI should point to the location on the server where you put the file. It should be in the form `file:///PATH/TO/localhost.key.der`. |
| `security.saml.metadataRefreshInterval` | No | Integer | You only need to configure this property if you need to refresh the metadata more than once. |
| `security.saml.defaultSuccessUrl` | No | URI | This can be a URI (relative or absolute) where the user should be redirected after logging in successfully. The default is to go to the root page ("/") so you shouldn't generally need to change this. |
| `security.saml.defaultLogoutUrl` | No | URI | This can be a URI (relative or absolute) where the user should be redirected after logging out successfully. The default is to go to the "logged out" page (`/loggedout`) so you shouldn't generally need to change this. |

If you are integrating Search UI with Microsoft's Azure AD identity provider and and see an error message saying "The SAML authentication request property 'Scoping/ProxyCount' is not supported." then you should also uncomment the property `saml.sso.profile-options.include-scoping=false`, leaving the value set to `false` (by default, scoping _is_ included).

## Step 6: Running with a Reverse Proxy or Load Balancer

If your servlet container will be running behind a reverse proxy or a load balancer, you will need to configure a few more properties in the `application.properties` file. All of these are required. Essentially, they define the URL that users will see from their browsers when accessing Search UI and ensure that the IdP handles redirecting to it without any issues.

| Property Name | Format | Description |
| --- | --- | --- |
| `saml.sso.context-provider.lb.enabled` | `true` | This is the property that triggers the use of all other load-balancer-related properties. Leave it commented out for non-load-balancer use cases. |
| `saml.sso.context-provider.lb.scheme` | Either `http` or `https` | This is the protocol for the URI used by the user to access the Search UI application (note that the values are lowercase). |
| `saml.sso.context-provider.lb.server-port` | Integer | This is the port number for the URI. |
| `saml.sso.context-provider.lb.server-name` | String | This is the host name for the URI. |
| `saml.sso.context-provider.lb.context-path` | String | This is the context path part of the URI, such as "/searchui" (which is the default). |
| `saml.sso.context-provider.lb.include-server-port-in-request-url` | Boolean value | If this is `true`, then the URI generated when talking with the IdP will include the port number. If it's `false`, then the URI will not include the port number. You probably only want to set this to false if the port matches the default port for the protocol (i.e. port 80 for HTTP and port 443 for HTTPS). |
| `saml.sso.metadata-generator.entity-base-url` | URI | This should be the composed version of the URI for the Search UI application. For example, if the previous properties had values "https," 843, "myhost.example.com," "/searchui," and `false`, you would set this property to "https://myhost.example.com/searchui" (which should match what your users use to access the application).


## Step 7: Test Logging In

Once you have completed the above steps and restarted the web server, access the URL of the Search UI. You will be redirected to the Identity Provider's login form. Here, for example, is the one presented by the Okta IdP.

<img src="images/okta-login.PNG" width="100%"/>

After submitting your credentials, the identity provider will authenticate you and redirect back to Search UI. You will be logged in and your name will appear in the upper right corner.

<img src="images/searchui-logged-in.PNG" width="100%"/>

### Logging Information

If you have issues getting everything configured, you can enable trace and/or debug logging for the components of the servlet to help you determine what is going wrong. The servlet container's logs will then contain a lot of additional information about the properties you chose and how they were applied to the security configuration of the servlet.

For more information about debugging, see the list of class names at the bottom of the `application.properties` file, which has a description of each class and what debug/trace logging will show you.
