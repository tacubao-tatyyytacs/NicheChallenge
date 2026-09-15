const API_URL = "https://api.jikan.moe/v4/top/anime";

const popularAnime = document.getElementById("popularAnime");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let animeData = [];

fetch (API_URL)
    .then(response => response.json())
    .then(data => {

        console.log(data);
        const animeList = data.data;

        displayAnime(animeList);
    })
    .catch(error => {
        console.error("Something went wrong:". error);
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

    const searchText = searchInput.value;

    const searchURL = `https://api.jikan.moe/v4/anime?q=${searchText}`;

    fetch(searchURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Search error:", error);
        });
}

searchButton.addEventListener("click", searchAnime);

function searchAnime() {

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        return;
    }

    const searchURL = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchText)}`;

    fetch(searchURL)
        .then(response => response.json())
        .then(data => {

            console.log("SEARCH RESULTS:", data);

            if (!data.data) {
                console.error("The API did not return anime results.");
                return;
            }

            const animeList = data.data;

            console.log("ANIME LIST:", animeList);

            popularAnime.innerHTML = "";

            displayAnime(animeList);
        })
        .catch(error => {
            console.error("Search error:", error);
        });
}