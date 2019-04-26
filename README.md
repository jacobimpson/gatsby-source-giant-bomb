# gatsby-source-giant-bomb 💣

A Gatsby source plugin for fetching data from the Giant Bomb Games API https://www.giantbomb.com/api/ into your GatsbyJS site. **Still a work in progress.**

### TODO

- Filter by platforms not yet working correctly
- Convert to TS
- Add more filters where appropriate
- Smarter rate limiting

### Example Usage

gatsby-node.js

```javascript
plugins: [
    {
        resolve: `gatsby-source-giant-bomb`,
        options: {
        apiKey: "YOUR_API_KEY_HERE",
        itemsPerPage: 100, // MAX 100 per page
        pageLimit: 20, // How many pages to fetch
        platforms: ["Game Boy"],
        },
    },
],
```
