const API_URL = "https://api.jikan.moe/v4/top/anime";

const popularAnime = document.getElementById("popularAnime");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let animeData = [];

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        console.log("POPULAR ANIME:", data);

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

    if (searchText === "") {
        return;
    }

    const localResults = animeData.filter(anime => {

        const title = anime.title
            ? anime.title.toLowerCase()
            : "";

        const englishTitle = anime.title_english
            ? anime.title_english.toLowerCase()
            : "";

        return title.includes(searchText) ||
               englishTitle.includes(searchText);
    });

    if (localResults.length > 0) {

        console.log("FOUND IN EXISTING ANIME:", localResults);

        popularAnime.innerHTML = "";

        displayAnime(localResults);

        return;
    }
    const searchURL =
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchText)}`;

    console.log("Searching Jikan:", searchURL);


    fetch(searchURL)
        .then(response => response.json())
        .then(data => {

            console.log("SEARCH RESULTS:", data);

            if (data.data && data.data.length > 0) {

                console.log("ANIME FOUND FROM API:", data.data);

                popularAnime.innerHTML = "";

                displayAnime(data.data);

            } 
            else {

                popularAnime.innerHTML = `
                    <p class="no-results">
                        No anime found.
                    </p>
                `;

                console.log("No anime found.");
            }

        })
        .catch(error => {

            console.error("Search error:", error);

            popularAnime.innerHTML = `
                <p class="no-results">
                    Unable to search right now. Please try again.
                </p>
            `;

        });
}
searchButton.addEventListener("click", searchAnime);