const path = require('path');

module.exports = {
  title: 'Attivio Search UI Toolkit Component Reference',
  verbose: true,
  assetsDir: 'src/',
  ignore: [], // Add any componets we want to exclude here
  defaultExample: false,
  showUsage: true,
  styleguideDir: 'styleguide',
  highlightTheme: 'ambiance', // see http://codemirror.net/demo/theme.html
  styles: {},
  sections: [
    {
      name: 'Introduction',
      content: 'src/docs/introduction.md',
    },
    {
      name: 'Installation',
      content: 'src/docs/installation.md',
    },
    {
      name: 'Components',
      sections: [
        {
          name: 'Search Controls',
          content: 'src/docs/searchControls.md',
          components: () => {
            return [
              'src/components/NavbarFilter.jsx',
              'src/components/SearchBar.jsx',
              'src/components/Searcher.jsx',
              'src/components/SearchInputField.jsx',
              'src/components/SearchLanguagePicker.jsx',
              'src/components/SearchResultsPager.jsx',
              'src/components/SearchResultsPerPage.jsx',
            ];
          },
        },
        {
          name: 'Search Results — Documents',
          content: 'src/docs/searchResultsDocuments.md',
          components: () => {
            return [
              'src/components/DocumentThumbnail.jsx',
              'src/components/DataPairs.jsx',
              'src/components/DocumentType.jsx',
              'src/components/RelevancyScore.jsx',
              'src/components/SearchResult.jsx',
              'src/components/SearchResults.jsx',
              'src/components/SearchResultsBody.jsx',
              'src/components/SearchResultsCount.jsx',
              'src/components/SearchResultsEmpty.jsx',
              'src/components/SearchResultsError.jsx',
              'src/components/SearchResultsSummary.jsx',
              'src/components/SearchResultTags.jsx',
              'src/components/SentimentBar.jsx',
            ];
          },
        },
        {
          name: 'Search Results — Facets',
          content: 'src/docs/searchResultsFacets.md',
          components: () => {
            return [
              'src/components/BarChartFacetContents.jsx',
              'src/components/Facet.jsx',
              'src/components/FacetResults.jsx',
              'src/components/ListWithBarsFacetContents.jsx',
              'src/components/MapFacetContents.jsx',
              'src/components/MoreListFacetContents.jsx',
              'src/components/PieChartFacetContents.jsx',
              'src/components/SearchResultsFacetFilters.jsx',
              'src/components/SentimentFacetContents.jsx',
              'src/components/TagCloudFacetContents.jsx',
              'src/components/TimeSeriesFacetContents.jsx',
            ];
          },
        },
        {
          name: 'Search Results — Other',
          content: 'src/docs/searchResultsOther.md',
          components: () => {
            return [
              'src/components/EntityTimeline.jsx',
              'src/components/EntityTimelinesPanel.jsx',
              'src/components/ExpertCard.jsx',
              'src/components/ExpertDetails.jsx',
              'src/components/KnowledgeGraphPanel.jsx',
              'src/components/SimilarAuthorCard.jsx',
            ];
          },
        },
        {
          name: 'Navigation',
          content: 'src/docs/navigation.md',
          components: () => {
            return [
              'src/components/BigButton.jsx',
              'src/components/Breadcrumbs.jsx',
              'src/components/MastheadNavTabs.jsx',
              'src/components/NavigationButton.jsx',
              'src/components/NavigationHamburgerMenu.jsx',
            ];
          },
        },
        {
          name: 'Input',
          content: 'src/docs/input.md',
          components: () => {
            return [
              'src/components/DatePicker.jsx',
              'src/components/DropdownButton.jsx',
              'src/components/DataPairs.jsx',
              'src/components/Menu.jsx',
              'src/components/NavbarButton.jsx',
              'src/components/NavbarFilter.jsx',
              'src/components/NavbarOr.jsx',
              'src/components/Masthead.jsx',
              'src/components/NavbarPager.jsx',
              'src/components/StarRating.jsx',
              'src/components/Toggle.jsx',
              'src/components/ToggleSwitch.jsx',
            ];
          },
        },
        {
          name: 'Display',
          content: 'src/docs/display.md',
          components: () => {
            return [
              'src/components/Card.jsx',
              'src/components/ChartTrends.jsx',
              'src/components/Code.jsx',
              'src/components/CollapsiblePanel.jsx',
              'src/components/FormattedDate.jsx',
              'src/components/Header360.jsx',
              'src/components/LabeledData.jsx',
              'src/components/Masthead.jsx',
              'src/components/MastheadUser.jsx',
              'src/components/MoreList.jsx',
              'src/components/Navbar.jsx',
              'src/components/NetworkDiagram.jsx',
              'src/components/ProfilePhoto.jsx',
              'src/components/SecondaryNavBar.jsx',
              'src/components/SeparatedList.jsx',
              'src/components/SqlLog.jsx',
              'src/components/StarRating.jsx',
              'src/components/Subheader360.jsx',
              'src/components/TabPanel.jsx',
              'src/components/TagCloud.jsx',
            ];
          },
        },
        {
          name: 'Page Templates',
          content: 'src/docs/pageTemplates.md',
          components: () => {
            return [
              'src/pages/SearchPage.jsx',
              'src/pages/Document360Page.jsx',
              'src/components/LoginPage.jsx',
            ];
          },
        },
      ],
    },
  ],
  require: [
    path.join(__dirname, 'src/style/main.less'),
  ],
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.jsx');
    const dir = path.dirname(componentPath);
    return `import ${name} from 'attivio-ui/${dir}/${name}';`;
  },
  getExampleFilename(componentPath) {
    const name = path.basename(componentPath, '.jsx');
    const mdName = `${name}.md`;
    const dir = path.dirname(componentPath);
    // The docs are up from the 
    const fullMdPath = path.resolve(dir, '../docs/components', mdName);
    return fullMdPath;
  },
};
