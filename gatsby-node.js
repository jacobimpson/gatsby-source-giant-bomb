const fetch = require("node-fetch");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  let { apiKey, itemsPerPage, pageLimit, platforms = [] } = configOptions;
  if (itemsPerPage > 100) itemsPerPage = 100;

  const apiBase = "https://www.giantbomb.com/api";
  let urlParams = `?api_key=${apiKey}&format=json&limit=${itemsPerPage}&filter=`;
  let platformIds = [];

  for (const platform in platforms) {
    await fetch(
      `https://www.giantbomb.com/api/platforms/?api_key=${apiKey}&filter=name:${platform}&format=json`
    )
      .then(result => result.json())
      .then(json => {
        if (Array.isArray(json.results)) {
          json.results.forEach(result => {
            if (result.id) platformIds.push(result.id);
          });
        }
      });
  }

  if (platformIds.length) urlParams += "platform:";
  platformIds.forEach((platformId, index) => {
    urlParams += `${platformId}`;
    if (index < platformIds.length - 1) urlParams += "|";
  });

  const gamesEndpoint = `${apiBase}/games${urlParams}`;

  console.log(urlParams);

  const fetchAllGames = async () => {
    let pages = [];
    let offset = 0;
    let iterations = 0;
    do {
      const endPoint = gamesEndpoint + `&offset=${offset}`;

      offset = offset + itemsPerPage;
      iterations = iterations + 1;
      setTimeout(() => {}, 1000);

      await fetch(endPoint)
        .then(response => response.json())
        .then(({ results }) => {
          if (results.length !== itemsPerPage) return;
          pages.push(results);
        });
    } while (iterations < pageLimit);

    return pages;
  };

  const pages = await fetchAllGames();

  pages.forEach(page => {
    page.forEach(game => {
      const nodeId = createNodeId(`game-${game.id}`);
      const nodeContent = JSON.stringify(game);
      createNode(
        Object.assign({}, game, {
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: `GiantBombGame`,
            content: nodeContent,
            contentDigest: createContentDigest(game)
          }
        })
      );
    });
  });
};
