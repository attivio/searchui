# Save searches

Save search feature allows you to save your search (including any filters that are applied) which can later be revisited by clicking on the saved search title. This feature is disabled by default.


## How to enable save search
You can turn on the save search option by passing in an additional prop to SearchBar component, this prop is called _allowSavedSearch_. For example: 
```
<SearchBar allowSavedSearch />
```
This would show a heart icon with a drop down next to the Search Bar, which means the UI component for saved search is enabled.
> **Note:** In order to make this feature work, we need to create a new zone to store the saved searches. This feature will **NOT** work if you haven't configured and specified a new zone for saved searches.

## Configuring a new zone to store the saved searches
*Follow these steps to configure a new zone for storing the saved searches:*

 1. Zones are configured via the [Index Feature](https://answers.attivio.com/display/extranet52/Configure+the+Index), in **[project-dir]\conf\features\core\Index.index.xml**.  It should look similar to:
	 ```
	 <?xml version="1.0" encoding="UTF-8"?>

	<ff:features xmlns:ff="http://www.attivio.com/configuration/config" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fbase="http://www.attivio.com/configuration/features/base" xmlns:f="http://www.attivio.com/configuration/features/core" xsi:schemaLocation="http://www.attivio.com/configuration/config http://www.attivio.com/configuration/config.xsd http://www.attivio.com/configuration/features/base http://www.attivio.com/configuration/features/baseFeatures.xsd http://www.attivio.com/configuration/features/core http://www.attivio.com/configuration/features/coreFeatures.xsd">
	  <f:index enabled="true" name="index" profile="true">
	    <f:partitionSet size="1"/>
	    <f:writer logCommits="true" nodeset="ingestion" search="true"/>
	  </f:index>
	</ff:features>
	```

 2. Edit this file to add in a new index zone. For example, we're creating a new index zone called *testZone* in the example below:
	 ```
	 <?xml version="1.0" encoding="UTF-8"?>

	<ff:features xmlns:ff="http://www.attivio.com/configuration/config" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fbase="http://www.attivio.com/configuration/features/base" xmlns:f="http://www.attivio.com/configuration/features/core" xsi:schemaLocation="http://www.attivio.com/configuration/config http://www.attivio.com/configuration/config.xsd http://www.attivio.com/configuration/features/base http://www.attivio.com/configuration/features/baseFeatures.xsd http://www.attivio.com/configuration/features/core http://www.attivio.com/configuration/features/coreFeatures.xsd">
		<f:index enabled="true" name="index" profile="true">
			<f:writer defaultZoneName="default" logCommits="true" nodeset="ingestion" search="true">
				<f:zone name="default" />
				<f:zone name="testZone" />
			</f:writer>
		</f:index>
	</ff:features>
	```
> If you don't configure any zones, there is always one zone named _default_. However, if you configure zones, you must explicitly configure the default zone in addition to the other zone. Additionally, you can also set up separate search workflows for these zones so you don't get the results from your *testZone* as a part of the search results.

3. Configure the save search in SearchUI's configuration.properties file. You can specify the name of the new index zone for saved searches, the table name for all the documents for saved searches and the search workflow to be used for querying the mentioned zone. Below is an example with default values:
	```
	SearchBar: {
		// configures the search workflow used for saved searches
		savedSearchWorkflow: 'searchSavedSearches',
		// configures the table name for saved searches
		savedSearchTable: 'savedSearches',
		// specifies the index zone for saved searches
		savedSearchZone: 'savedSearches',
	}
	```

## How to use saved searches
After you enable and configure saved searches, you should have this component right next to the search bar:
[Saved Search Gif]

### Saving a search
You can save searches by clicking on the first option in the drop-down menu 'SAVE SEARCH'. It will open up a modal that asks for the name for this search. 
> If you don't enter a name, the search term is used as the name.

Click on save search button to save the search.

### Revisiting a search
You can revisit a search by clicking on the search title in the drop-down for saved search.


### Deleting a saved search
You can also delete a saved search, there's a **x** next to every saved search in the drop-down. Simply click on the **x** to delete a saved search.
> Note that the drop down only shows the 10 most recent saved searches.