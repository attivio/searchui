# Using the Search UI Application

To get to the Search UI application use the appropriate URL in your web browser. 

## The Search UI URL

If the Search UI is being hosted by an Attivio node server, you can access it by going to the Admininstration UI on that node and clicking the “Search UI” link in the left-hand navigation links, under “Query.” You can also access it directly using the name and port of the server followed by `/searhcui` (e.g., `http://my.attivio.node:17000/searchui`).

If the Search UI is being hosted by a servlet container such as Tomcat, you can access it using the name and port of the server followed by `/searhcui` (e.g., `http://my.tomcat.instance:8080/searchui`).

## Logging into the Search UI

Depending on how the Search UI is hosted and configured, you will likely need to log in. Once you do so, you will be taken to Search UI’s landing page.

<img src="images/landing-page.png?raw=true" alt="Landing Page" width="100%" />

### On this page you can
* [Ask a question](#question)
* Click on [Insights](#insights) to better understand your data

<a name="question"></a>
## Ask a Question

Whether you want to ask a free-form question or use our [Advanced Query Language (AQL)](https://answers.attivio.com/display/extranet55/Advanced+Query+Language) in this page you can get to the information you need. Hit **ENTER** or click **Go** to see the results.

<img src="images/italy.png?raw=true" alt="Results" width="100%" />

Following are some features of the results page:

| Feature | Description |
| ------- | ----------- |
| Logged-in user (Attivio Administrator in our case) <br/> <img src="images/username.png?raw=true" alt="Username" align="center" /> | The name of the logged-in user appears in the upper right corner, if available. Otherwise, the username is displayed with an option to log out. |
| Simple or Advanced Query Language <br/> <img src="images/query-language.png?raw=true" alt="Query Language" align="center" /> | Select between Attivio’s [Simple Query Language](https://answers.attivio.com/display/extranet55/Simple+Query+Language) or the [Advanced Query Language](https://answers.attivio.com/display/extranet55/Advanced+Query+Language). |
| Search Box <br/> <img src="images/search box.png?raw=true" alt="Search Box" align="center" />| Enter the text of your query.  For the [Simple Query Language](https://answers.attivio.com/display/extranet55/Simple+Query+Language), enter a keyword or a field:keyword pair.  The string \*:\* retrieves all documents in all tables.  You can paste in more complex queries written in the [Advanced Query Language](https://answers.attivio.com/display/extranet55/Advanced+Query+Language), such as those demonstrated in the [Quick Start Tutorial](https://answers.attivio.com/display/extranet55/Quick+Start+Tutorial). |
| Facet Filters <br/> <img src="images/facets.png?raw=true" alt="Facets" align="center" /> | The left column of the display is devoted to facet controls.  Each one summarizes opportunities to “drill down” on the set of current results to narrow the search. |
| Applied Facets <br/> <img src="images/applied-facet.png?raw=true" alt="Applied Facet" align="center" /> | Under the header, the facet filters that have been applied to the search are displayed. Each item can be individually removed to widen the result set as needed. |
| Sort Control <br/> <img src="images/sort-by.png?raw=true" alt="Sort By" align="center" /> | The sort control reorders the result items. You can sort by relevancy and select which [relevancy model](https://answers.attivio.com/display/extranet55/Machine+Learning+Relevancy) to use, or by any sortable field in the schema. See [Sorting Results](https://answers.attivio.com/display/extranet55/Sorting+Results) for more information. |
| Relevancy Model <br/> <img src="images/relevancy.png?raw=true" alt="Relevancy" align="center" /> | If you choose Relevancy in the Sort Control, you can choose the Relevancy Model to use. See [Machine Learning Relevancy](https://answers.attivio.com/display/extranettrunk/Machine+Learning+Relevancy) for more information. |
| Paging Controls <br/> <img src="images/pagination.png?raw=true" alt="Pagination" align="center" /> | The paging controls let you page through the search results conveniently. |
| Matching Documents | The right column of this page is devoted to the display of matching documents. <ul><li>If there is a [Thumbnail Image](https://answers.attivio.com/display/extranet55/Thumbnail+and+Preview+Images) available, it will be displayed to the left of the document (like the flag images in the Quick Start Tutorial.)</li><li>The title of the document is often a hyperlink to the actual document or web page.</li><li>Search UI is preconfigured to show the **table** value of each matching document next to the result number.</li><li>By default, Search UI displays the document teaser, with matching terms [highlighted](https://answers.attivio.com/display/extranet55/Field+Expressions).<ul><li>Items that matched the query are shown in **bold** face.</li><li>[Scoped entities](https://answers.attivio.com/display/extranet55/Scope+Search) are color-coded:<ul><li>People: Yellow</li><li>Locations: Blue</li><li>Companies: Red</li></ul></li><li>[Key phrases](https://answers.attivio.com/display/extranet55/Key-Phrase+Extraction): Green</li><li>[Entity Sentiment](https://answers.attivio.com/display/extranet55/Using+Entity+Sentiment) is indicated by red and green plus or minus icons.</li></ul></li><li>Document Details consist of fields and values. Note that you can temporarily display all fields by setting the **Details** button next to the Sort Control to **On**.</li><li>The **Tags** field is a [Real Time Field](https://answers.attivio.com/display/extranet55/Real-Time+Updates) configured in the [Schema](https://answers.attivio.com/display/extranet55/Configure+the+Attivio+Schema). It lets you add labels to each document directly from the Results Page. These labels can then be collected into a new facet to assist in subsequent searches.</li></ul> |  
| User Rating <br/> <img src="images/stars.png?raw=true" alt="Rating" align="center" /> | A user can provide a rating for a document that can be used as a signal when using Machine Learning to create a relevancy model. See [Machine Learning Relevancy](https://answers.attivio.com/display/extranet55/Machine+Learning+Relevancy) for more information. |
| Show 360&deg; View | You can choose to see a  360&deg; view of a document to better understand the document and how it relates to other documents using our Knowledge Graph. |

## 360&deg; View
<img src="images/360-Italy.PNG?raw=true" alt="Italy 360 View" width="100%" />

The 360&deg; View page allows you to take a closer look at a single document and understand how it relates to other documents in the index.

In the 360&deg; View you can see the document text, extracted entities and the Knowledge Graph. The Knowledge Graph shows how this document is linked to other documents by matching the entities extracted.

If we look at “Italy,” we can see it relates to two News documents based on mentions of the extracted locations of Italy and Germany.

<img src="images/graph.PNG?raw=true" alt="Knowledge Graph" width="100%" />

## Insights
The Insights page provides a dashboard that allows you to quickly understand your data without knowing what data was ingested.

Using our [Text Analytics](https://answers.attivio.com/display/extranet55/Attivio+Text+Analytics) capabilities and [facets](https://answers.attivio.com/display/extranet55/Facets) we build knowledge on top of your data so that you can better understand your data.

<img src="images/insights.png?raw=true" alt="Insights" width="100%" />
