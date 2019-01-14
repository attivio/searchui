# Engine support

[SUIT](github.com/attivio/suit) (the library that powers the search interface) also
supports limited functionality with [Elasticsearch](https://www.elastic.co/) and
[Solr](http://lucene.apache.org/solr/).

## Elastic

### Prerequisites for elastic:

- A **read only-public elastic index**.
- **CORS enabled** instance (more info [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-http.html)).

### Configuration in Elasticsearch:

In configuration.properties.js:

1. Set `searchEngineType` to `elastic`:
    ```javascript
      searchEngineType: "elastic"
    ```
2. Set `baseUri` to point to the elastic instance, adding the index and the search
   handler:
    ```javascript
      baseUri: "http://my.elastic.instance:9200/myIndex/_search"
    ```
3. The remaining steps can be found under **Common Configuration for Both `elastic`
   and `solr`**, below.

___

## Solr

### Prerequisites in solr:

  1. Create a request handler:
    * The `defType` needs to be `edismax`.
    * The response type needs to be `json` (`wt`) .
    * In `df` and `qf` you need to specify the fields of the search separated by
      a space.
      ```xml
        <!-- A request Handler for the integration with the SUIT module -->
        <requestHandler name="/mySearch" class="solr.SearchHandler">
          <lst name="defaults">
            <str name="echoParams">explicit</str>
            <str name="wt">json</str>
            <str name="indent">true</str>
            <str name="defType">edismax</str>
            <str name="df">id author date other_field</str>
            <str name="qf">id author date other_field</str>
          </lst>
        </requestHandler>
      ```
  2. Make solr read-only adding a proxy or
     [disabling components](https://wiki.apache.org/solr/SolrConfigXml#Enable.2BAC8-disable_components).
  3. Enable CORS.

### Configuration in solr:

In configuration.properties.js,

1. Set `searchEngineType` to `solr`:
    ```javascript
      searchEngineType: "solr"
    ```
2. Set `baseUri` to point to the solr instance, adding the index and the search handler:
    ```javascript
      baseUri: "http://my.solr.instance:8983/solr/myIndex/mySearch"
    ```
3. The remaining steps can be found under **Common Configuration for Both `elastic`
     and `solr`**, below.

___

## Common Configuration for Both `elastic` and `solr`

1. Add `customOptions` in the `ALL` property (`ALL.customOptions`):
    ```javascript
      customOptions: {
        customId: String,
        mappings: Object,
        facets: Object
      }
    ```
    1. Set customId *(optional)*, if you need other field to work as the
        document id:
        ```javascript
          customId: "alternative_id_field"
        ```
    2. Add mappings *(required)* to these Attivio fields:
       - title
       - uri
       - teaser
       - text
       - previewImageUri
       - thumbnailImageUri
       ```javascript
         mappings: {
           title: "field_of_title",
           teaser: "field_ofå_teaser",
           text: "field_of_text"
         },
       ```
    3. Add facets *(optional)*; if you want to add facets you need to make sure
       the fields are **searchable**. The facets object is an array of objects
       each of which has two properties, `displayName` and `field`:
       - displayName is the name of the facet shown in UI
       - field is the name of the field used to generate the facet (this field
         needs to exist in the Elasticsearch or Solr index and needs to be **searchable**).
         ```javascript
          facets: [
            {
              displayName: "Authors",
              field: "author_str"
            },
            {
              displayName: "Second Facet",
              field: "second_field_to_get_facets_str"
            }
          ]
         ```
2. Add sortable fields (**required**). You can configure these fields using
   the property `SearchUISearchPage.sortableFields`, which is simply an array
   of the fields’ names. These fields are included in the sort menu in the Search
   UI. They must exist in the mappings object (`ALL.customOptions.mappings`) and
   must be searchable.
    ```javascript
      sortableFields: [
        "creation_date",
        "author"
      ]
    ```
