function search() {
    var searchText = document.getElementById("searchInput").value.trim();
    var engine = document.getElementById("engine").value;
    var resultsDiv = document.getElementById("results");

    if (!searchText) {
        resultsDiv.innerHTML = "<p>Please type Mr.Ali.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Billy-ing....</p>";

    if (engine === "wikipedia") {
        var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" 
                    + encodeURIComponent(searchText) + "&format=json&origin=*";

        fetch(wikiURL)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = "";
                var searchResults = data.query.search;

                if (searchResults.length === 0) {
                    resultsDiv.innerHTML = "<p>No ~Pranay Found.</p>";
                    return;
                }

                searchResults.forEach(item => {
                    var title = item.title;
                    var snippet = item.snippet;
                    var pageId = item.pageid;

                    var resultHTML = `
                        <div class="result">
                            <a href="https://en.wikipedia.org/?curid=${pageId}" target="_blank">${title}</a>
                            <p>${snippet}...</p>
                        </div>
                    `;
                    resultsDiv.innerHTML += resultHTML;
                });
            })
            .catch(error => {
                console.log("Wikipedia Error:", error);
                resultsDiv.innerHTML = "<h3>No Pranay Found.</h3>";
            });

    } else if (engine === "duckduckgo") {
        var ddgURL = "https://api.duckduckgo.com/?q=" + encodeURIComponent(searchText)
                   + "&format=json&no_html=1&skip_disambig=1";

        fetch(ddgURL)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = "";

                if (data.AbstractText) {
                    var resultHTML = `
                        <div class="result">
                            <a href="${data.AbstractURL}" target="_blank">${searchText}</a>
                            <p>${data.AbstractText}</p>
                        </div>
                    `;
                    resultsDiv.innerHTML += resultHTML;

                } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                    data.RelatedTopics.forEach(topic => {
                        if (topic.Text && topic.FirstURL) {
                            var resultHTML = `
                                <div class="result">
                                    <a href="${topic.FirstURL}" target="_blank">${topic.Text}</a>
                                </div>
                            `;
                            resultsDiv.innerHTML += resultHTML;
                        }
                    });
                } else {
                    resultsDiv.innerHTML = "<p>No Billy results found.</p>";
                }
            })
            .catch(error => {
                console.log("DuckDuckGo error:", error);
                resultsDiv.innerHTML = "<p>Could not fetch Billy results.</p>";
            });
    }
}