const API_URL = "https://api.jikan.moe/v4/top/anime";

const popularAnime = document.getElementById("popularAnime");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let animeData = [];

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        console.log(data);

        const animeList = data.data;

       
        animeData = animeList;

        displayAnime(animeList);
    })
    .catch(error => {
        console.error("Something went wrong:", error);
    });



function displayAnime(animeList) {

    animeList.forEach(anime => {

        const animeCard = document.createElement("article");

        animeCard.classList.add("anime-card");

        animeCard.innerHTML = `

            <div class="anime-image">

                <img 
                    src="${anime.images.jpg.image_url}" 
                    alt="${anime.title}"
                >

                <span class="anime-type">
                    ${anime.type || "N/A"}
                </span>

            </div>

            <div class="anime-info">

                <h3>${anime.title}</h3>

                <div class="anime-meta">

                    <span class="rating">
                        ⭐ ${anime.score || "N/A"}
                    </span>

                    <span>
                        ${anime.year || "N/A"}
                    </span>

                </div>

            </div>

        `;

        popularAnime.appendChild(animeCard);
    });
}



function searchAnime() {

    const searchText = searchInput.value.trim().toLowerCase();

    // Don't search if the box is empty
    if (searchText === "") {
        return;
    }

    const searchURL =
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchText)}`;

    fetch(searchURL)
        .then(response => response.json())
        .then(data => {

            console.log("SEARCH RESULTS:", data);

            // Clear the current anime cards
            popularAnime.innerHTML = "";

            // If Jikan gives us search results
            if (data.data && data.data.length > 0) {

                console.log("Anime found from API:", data.data);

                displayAnime(data.data);

            } else {

                // If API has no results, search our existing anime
                searchLocalAnime(searchText);
            }
        })
        .catch(error => {

            console.error("Jikan search failed:", error);

            // If Jikan has a 504 or another error,
            // search the anime we already have
            searchLocalAnime(searchText);
        });
}



function searchLocalAnime(searchText) {

    console.log("Searching existing anime...");

    const results = animeData.filter(anime => {

        const title = anime.title
            ? anime.title.toLowerCase()
            : "";

        const englishTitle = anime.title_english
            ? anime.title_english.toLowerCase()
            : "";

        return title.includes(searchText) ||
               englishTitle.includes(searchText);
    });

    popularAnime.innerHTML = "";

    if (results.length > 0) {

        console.log("Found existing anime:", results);

        displayAnime(results);

    } else {

        popularAnime.innerHTML = `
            <p class="no-results">
                No anime found.
            </p>
        `;
    }
}




searchButton.addEventListener("click", searchAnime);