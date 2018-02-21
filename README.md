# search-ui
**Search UI**, [Attivio's](http://www.attivio.com/) out-of-the-box search interface, provides an interactive learning tool for exploring your Attivio index and client API functionality. **Search UI**, and it's underlying library, [SUIT](https://github.com/attivio/suit), can also be used to rapidly prototype an Attivio Search Application on top of any data set. 

## Installation and Deployment
Search UI has two deployment options:
* Embedded - deploy as a module making it available from the Attivio Admin UI
* Stand-alone  - deploy to an external web server such as Tomcat

## Security
Search UI can be configured to require users to log in. The options vary depending on your deployment type.

| Deployment Type | Security Options |
| --------------- | ---------------- |
| Embedded (within Attivio) | <ul><li>Active Directory</li><li>XML</li></ul> |
| Stand-alone (i.e. Tomcat)	 | <ul><li>SSO</li><li>XML</li></ul> |

Depending on the security option, users will either be presented with Attivio login form or one presented by the Identity Provider.

