# Search UI & SUIT FAQ

This document describes some of the common things that you might want to do with the Search UI application or with the SUIT library it's based on.

The questions are divided up into the following sections:
* Application-Wide Configuration
* Changing the Way Search Works
* Changing Facets
* Changes to the Document 360° Page
* Branding-Relssted Configuration
* Configuring Search UI for Use with Non-Attivio Servers
* Configuring Search UI as a Module
* Configuring Search UI as a Servlet

## Application-Wide Configuration

The questions in this section all refer to changes you can make in the file `configuration.properties.js`. You can learn more about the answers provided by reading the comments in that file. (The way you deploy the Search UI application determines the location of the configuration file, so consult the deployment documentation to see where to find it.)

### How do I display maps in Search UI using my documents’ geographic coordinates?

To enable the display of maps in Search UI, you need to add a Mapbox key to your configuration. See the [Mapbox website](https://www.mapbox.com/) for details on getting your own account and key and then set it using the `ALL.mapboxKey` property.

### How do I set the display names for fields displayed in the UI?

The property `ALL.entityFields` is a map of the field names to the strings to show in the UI for those fields. A future version of Search UI will be able to obtain the display names directly form the index’s schema. Note that this map is also used for determining which fields are shown as “entities” in both search results and in the 360⁰ view.

**Important**: Make sure you don’t include field names that do not exist in your schema or you will see exceptions when searching.

### How do I update the realm used for the authenticated user?

The realm used when accessing the Attivio server on a user’s behalf is set in the property ALL.defaultRealm. You will likely not need to change this from the default value of "aie" unless you have custom authentication in your instance.

### How do I change the way a single document looks on the results page?

You can currently do this by changing the `format` parameter of the `<SearchResults>` component on the page. The available values are `list`, which is the default list format used by the Search UI, `debug`, which presents the default "debug" view with all of each document's field names and values, and `simple`, which provides a view with just the ordinal position, type, name and contents preview of each document.

A future version of SUIT will allow passing a function as this property which is presented a document and returns a rendered element to show for that document.

### How do I change the name of the application in the URL (i.e. from “/searchui” to something else)?

There are a few places you'll need to change this. How you do so will depend on whether you are running Search UI as an Attivio module or hosted in a servlet container like Tomcat.

In the file `configuration.properties.js`:

* Change the 

In the file `application.properties` (Servlet only):

* Change the

<span style="color: darkred;">Updates coming</span>

### How do I change the name displayed for the application (i.e. from “Cognitive Search”)?

This is specified in the property `Masthead.applicationName`.

### How do I add a page to Search UI?

This ia a bit more complicated. Please see the tutorial on doing this in the Search UI section of [Attivio Answers](answers.attivio.com).

### How do I do a one-off query that doesn’t affect the results page?

XXX

### How do I force the results page to show a new query?

XXX

## Changing the Way Search Works

These questions describe how you can change the functionality of the search application.

### How do I set the workflow used for searching?

Use the property `Searcher.searchWorkflow`. Make sure you have defined a new search workflow if you want to change it from the default, called "search."

### How do I set the Business Center search profile used for searching?

Use the property `Searcher.businessCenterProfile`.
 
### How do I set the number of results displayed on each page when searching?

Use the property `Searcher.resultsPerPage`.
 
### How do I set the number of results displayed on each page when searching?

Use the property `Searcher.resultsPerPage`.

### How do I hide the “Debug” mode toggle switch?

You can set the property `SearchUISearchPage.debugViewToggle` to `false` and the toggle will be hidden (and thus inaccessible to users).

### How do I specify which fields can be used when sorting on the results page?

Use the property `SearchUISearchPage.sortableFields`. Note that the fields must be in your schema as sorting on undefined fields will cause exceptions. Each field listed will appear twice in the list, once for ascending order and once for descending order. In addition, the relevancy field (`.score`) will always appear as an option at the top of the list (in descending order only).

### How do I control the results per page/join rollup mode/result highlighitng/locale/query filter/search workflow/business center search profile used when searching?

XXX

## Changing Facets

These questions describe how to change the way facets are displayed and used within the Search UI.

### How do I change the facets that are shown on the results and insights pages?

The list of facets shown on the results page and on the insights page is determined by the facets that are returned by the query to the back-end server. You can set the facets requested using the `Searcher.facets` property. Note that if you set a non-zero value for the property `Searcher.facetFinderCount` then there may be additional facets displayed.

### How do I change the order of the facets on the results page?

You can specify the order using the property `SearchUISearchPage.orderHint`. Facets whose names don't appear in this list will be displayed after those whose names do. Facets which don't appear in the search results won't be displayed, even if they do appear on this list.

### How do I change the way a particular facet is viewed?

 You can change the facet-type properties under `SearchUISearchPage` to add the names of the facets you want to display as each type. For example, if you want the table facets to be displayed in a pie chart, you can add the value "table" to the (by default, empty) list of the property `SearchUISearchPage.pieChartFacets`. The properties in question are: `SearchUISearchPage.pieChartFacets`, `SearchUISearchPage.barChartFacets`, `SearchUISearchPage.columnChartFacets`, `SearchUISearchPage.barListFacets`, `SearchUISearchPage.tagCloudFacets`, `SearchUISearchPage.timeSeriesFacets`, `SearchUISearchPage.sentimentFacets`, and `SearchUISearchPage.geoMapFacets`.

There are corresponding properties for the `SearchUIInsightsPage` ( `SearchUIInsightsPage.pieChartFacets`, `SearchUIInsightsPage.barChartFacets`, etc.) to change the way facets are displayed on the insights page.

### How do I increase/decrease the maximum number of buckets displayed for any given facet on the insights page?
 
Via the property `SearchUIInsightsPage.maxFacetBuckets`. (Note that some components, such as `<MoreListFacetContents>` the intial display may show fewer items with the full list being available via a user action.)
 
### How do I control the use of the Attivio Facet Finder on the results page?

You can set the property `Searcher.facetFinderCount` to control the number of facets that the Facet Finder will add to search results. Set the value to 0 to disable Facet Finder completely and only display the facets you explicitly ask for.

## Changes to the Document 360° Page

These questions describe changes you may want to make to the Document 360° page.

### How do I specify whether the list of Similar Documents is displayed on the 360⁰ page?

Via the property `Document360Page.showMoreLikeThisResults`.
 
## Branding-Type Changes

These questions show how you can add your own colors, icon, etc., to the Search UI application.

### How do I change the logo in Search UI?

The logo is specified by the property called `Masthead.logoUri`, which is the location of the image file to use. It can be in any format that the browser can display: GIF, JPEG, PNG, etc.

Note that the image for the logo is limited to 57 pixels high and 140 pixels wide. You can change these if you build your own version of the application by editing the styles `attivio-globalmast-logo` and `attivio-global-mast-logo-img` in the file `attivio-global-masthead.less`.

If the file is already on a server that makes it accessible to your users’ browsers, you can just set the URI without needing to do anything else. If you need to have the file be served as part of the Search UI application, you will need to add the file to the directory `/src/img` in the frontend project. Then, you can set the property to the relative URI `img/FILENAME` (note that there’s no leading slash). If the application is running inside a subdirectory, the subdirectory is prepended to the URL used when accessing the image.

### How do I set the colors used by the different entity types?

Via the property `ALL.entityColors`. The keys of this object are the entity types (i.e., the field names) and the values can be any valid CSS strings representing the colors (e.g., "#ccc" or "yellow" or "rgba(200, 42, 128, 0.5)".

These are used when highlighting document text to show entities found and also in the list of attributes for the document, to color the bullets.

These colors are also used for charts (see below).

### How do I set the colors used by multicolored charts?

Via the property `ALL.entityColors` (see above).

Since, in theory, the set of colors used for the various entity types will be a cohesive set of colors that “go together,” the same colors are used when displaying multicolored charts such as pie charts. They are used for each subsequent value, in the order listed in the configuration file.

You can set specific colors to be used specifically for your charts by adding items to the top of this list using strings that aren’t field names in your index’s schema for their keys. For example, you could add items to the beginning of the list with names like “chartcolor1,” “chartcolor2,” etc., which would never show up in your entity lists. Make sure to add enough colors based on the value you specify for the `SearchUISearchPage.maxFacetBuckets` property.

## Configuring Search UI for Use with Non-Attivio Servers

These questions show how to configur the Search UI application to searxh an Elasticsearch or Solr index instead of the default Attivio index.

### How do I configure Search UI to talk to Elasticsearch’s index?

You need to configure two things to make Search UI work with Elasticsearch. First, set the property `ALL.searchEngineType` to the value `elastic` and then uncomment the `ALL.customOptions` property and fill its values in as described in the comments.

Please see additional inforrmation in Engine.md, which also desribes necessary configuration for your Elasticsearch instance.

### How do I configure Search UI to talk to Solr’s index?

You need to configure two things to make Search UI work with Solr. First, set the property `ALL.searchEngineType`  to the value `solr` and then uncomment the `ALL.customOptions` property and fill its values in as described in the comments.

Please see additional inforrmation in Engine.md, which also desribes necessary configuration for your Solr instance.

## Changes that require Building the Application

The questions in this section all require you to rebuild the appication to make the changes they describe.

### How do I change the colors in Search UI?

The colors used by Search UI’s components are configured using the variables in the file /src/style/bootstrap/variables.less. You should be able to limit your changes to...

XXX

### How do I specify which fields (entity types) are used to link documents on the 360⁰ page?

XXX

### How do I limit the number of linked documents for a given entity on the 360⁰ page?

XXX

### What should I change if I want to see the the Factbook module’s fields in my Search UI?

XXX

### How do I add a new item to the Searcher component’s state?

XXX

## Servlet-Related Changes

These configuration steps all involve changes to the file application.properties.

### How do I configure the Search UI servlet to use SSH/SSL?

XXX

### How do I configure the Search UI servlet to point to my Attivio server?

XXX

### How do I configure the Search UI servlet to run behind a reverse proxy or a load balancer?

XXX

### How do I debug the Search UI servlet?

XXX
 
### How do I debug the Search UI application?

XXX

## Configuring Search UI as a Module

These questions all have to do with running the Search UI as an external module within the Attivio installation.

### How do I configure module-based Search UI to use LDAP/AD authentication?

XXX

### How do I configure module-based Search UI to use XML authentication?

XXX

### How do I configure module-based Search UI to use no authentication?

XXX

## Configuring Search UI as a Servlet

These questions all have to do with running the Search UI as a servlet using an external servlet container such as Tomcat or Jetty.

### How do I configure servlet-based Search UI to use XML authentication?

XXX

### How do I configure servlet-based Search UI to use SAML-based single sign-on (SSO) authentication?

XXX

### What SAML identity providers does Search UI support?

XXX

### What servlet containers does Search UI support?

XXX

### How do I configure servlet-based Search UI to use XML authentication?

XXX

## GitHub-Related Questions

These questions all have to do with working with the projects in GitHub and with your local Git repositories.

### How do I contribute my cool new component to the SUIT library?

XXX

### How do I use my own Git repository with the Search UI (or SUIT) code?

The recommended way to do this is:

1. Clone the repository from GitHub to your local machine in the normal manner.
2. Create a new, empty Git repository either in your space on GitHub or using a separate server (such as your own GitHub server).
3. Edit the clone to point to the new repository you just created: `git remote set-url URL_FOR_NEW_REPO` where "URL_FOR_NEW_REPO" points to the repository you just created.
4. Add the original repository's URL as an "upstream" one: `git remote add upstream git@github.com:attivio/searchui.git` (or whichever URL you used to clone it originally).
5. Use the command `git push --mirror` to add the contents of the local repository to your remote one.

When you want to pull down changes from the upstream repository (on Attivio's GitHub), make sure your local repository is on the branch you want to merge into and then execute the command `git merge upstream/BRANCH` where "BRANCH" is the name of the branch to merge from.

You'll generally want to merge only from the "master" branch, which has the latest, released code. Once you've merged (resolving conflicts, if necessary), you'll still need to push the changes from your local repository to your remote one using `git push` as normal.

### How  do I update my repository with changes from the Search UI (or SUIT) project’s GitHub repository?

XXX
 
## Windows-Specific Issues

These questions all have to do with working with the Search UI and SUIT projects in a Windows development environment. (Note that actually running the application is completely platform agnostic.)

### What type of slashes to I use in configuration paths?

Forward slashes can be used in the configuration files and is a lot easier than worrying about escaping backslashes.

### What type of line endings do I need to use?

XXX

### Warning about Git line endings

XXX

### How do I use modified version of the SUIT library?

Warning about cleaning when linking

## Troubleshooting:

These are some common troublesome situations and how to get out of them.

### Search UI won’t start in Tomcat

XXX

### Search UI shows lots of Flow errors in Visual Studio Code even though I set the flag to use the local instance of Flow in the Visual Studio Code settings.

Make sure you imported the frontend directory into Visual Studio Code and not the outer searchui directory. The node_modules directory containing the flow-bin module must be at the root of what Visual Studio Code sees.
