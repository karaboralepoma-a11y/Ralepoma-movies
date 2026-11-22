
// ===================================
// MOVIENEST - SHARED JAVASCRIPT
// ===================================

const movies = [
  {
    id: "movie1",
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    type: "Movie",
    description: "A skilled thief enters people's dreams to steal secrets and is offered a difficult final mission.",
    image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
  },
  {
    id: "movie2",
    title: "Interstellar",
    genre: "Adventure",
    year: 2014,
    type: "Movie",
    description: "A team of explorers travels beyond Earth in search of a future for humanity.",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: "movie3",
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    type: "Movie",
    description: "Batman faces a new threat that challenges the safety and order of Gotham City.",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: "movie4",
    title: "Avatar",
    genre: "Fantasy",
    year: 2009,
    type: "Movie",
    description: "A former soldier becomes involved in the conflict surrounding the world of Pandora.",
    image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
  }
];

const series = [
  {
    id: "series1",
    title: "Breaking Bad",
    genre: "Drama",
    year: 2008,
    type: "Series",
    description: "A chemistry teacher makes a life-changing decision that takes him into a dangerous criminal world.",
    image: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg"
  },
  {
    id: "series2",
    title: "Wednesday",
    genre: "Mystery",
    year: 2022,
    type: "Series",
    description: "Wednesday Addams investigates strange mysteries at her new school.",
    image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg"
  },
  {
    id: "series3",
    title: "Stranger Things",
    genre: "Sci-Fi",
    year: 2016,
    type: "Series",
    description: "A group of friends discovers mysterious events in their small town.",
    image: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg"
  },
  {
    id: "series4",
    title: "The Witcher",
    genre: "Fantasy",
    year: 2019,
    type: "Series",
    description: "A monster hunter travels through a world filled with magic and difficult choices.",
    image: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg"
  }
];

const allTitles = [...movies, ...series];

// ===================================
// WATCHLIST FUNCTIONS
// ===================================

function getWatchlist() {
  try {
    return JSON.parse(
      localStorage.getItem("movieNestWatchlist")
    ) || [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  localStorage.setItem(
    "movieNestWatchlist",
    JSON.stringify(list)
  );
}

// ===================================
// CREATE MOVIE CARDS
// ===================================

function createCard(item, isWatchlist = false) {
  return `
    <article class="movie-card">
      <img src="${item.image}"
           alt="${item.title}"
           loading="lazy">

      <div class="movie-info">
        <h3>${item.title}</h3>
        <p>${item.genre} • ${item.year} • ${item.type}</p>

        <button class="details-btn" data-id="${item.id}">
          View Details
        </button>

        ${
          isWatchlist
            ? `<button class="remove-btn" data-id="${item.id}">
                 Remove
               </button>`
            : `<button class="add-btn" data-id="${item.id}">
                 + Watchlist
               </button>`
        }
      </div>
    </article>
  `;
}

// ===================================
// DISPLAY TITLES
// ===================================

function displayTitles(items, containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = items.map(item => createCard(item)).join("");
}

// ===================================
// DISPLAY WATCHLIST
// ===================================

function displayWatchlist() {
  const container = document.getElementById("watchlistGrid");

  if (!container) return;

  const savedIds = getWatchlist();

  const savedTitles = allTitles.filter(item =>
    savedIds.includes(item.id)
  );

  container.innerHTML = savedTitles
    .map(item => createCard(item, true))
    .join("");

  const emptyMessage = document.getElementById("emptyMessage");

  if (emptyMessage) {
    emptyMessage.style.display =
      savedTitles.length === 0 ? "block" : "none";
  }
}

// ===================================
// MOVIE DETAILS
// ===================================

function showDetails(id) {
  const item = allTitles.find(title => title.id === id);
  const modal = document.getElementById("detailsModal");

  if (!item || !modal) return;

  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailImage").alt = item.title;

  document.getElementById("detailTitle").textContent =
    item.title;

  document.getElementById("detailDescription").textContent =
    item.description;

  document.getElementById("detailGenre").textContent =
    `${item.genre} • ${item.year} • ${item.type}`;

  document.getElementById("trailerLink").href =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(item.title + " official trailer");

  modal.classList.add("show");
}

function closeDetails() {
  const modal = document.getElementById("detailsModal");

  if (modal) {
    modal.classList.remove("show");
  }
}

// ===================================
// ADD AND REMOVE WATCHLIST
// ===================================

function addToWatchlist(id) {
  const savedIds = getWatchlist();

  if (savedIds.includes(id)) {
    alert("This title is already in your watchlist.");
    return;
  }

  savedIds.push(id);
  saveWatchlist(savedIds);
  displayWatchlist();

  alert("Added to your MovieNest watchlist!");
}

function removeFromWatchlist(id) {
  const updatedList = getWatchlist().filter(
    savedId => savedId !== id
  );

  saveWatchlist(updatedList);
  displayWatchlist();
}

// ===================================
// SEARCH
// ===================================

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();

    const filteredMovies = movies.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.genre.toLowerCase().includes(searchText)
    );

    const filteredSeries = series.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.genre.toLowerCase().includes(searchText)
    );

    const movieGrid = document.getElementById("movieGrid");
    const seriesGrid = document.getElementById("seriesGrid");

    if (movieGrid) {
      displayTitles(filteredMovies, "movieGrid");
    }

    if (seriesGrid) {
      displayTitles(filteredSeries, "seriesGrid");
    }

    const noResults = document.getElementById("noResults");

    if (noResults) {
      const hasResults =
        movieGrid ? filteredMovies.length > 0 :
        seriesGrid ? filteredSeries.length > 0 :
        false;

      noResults.hidden = hasResults;
    }
  });
}

// ===================================
// CARD BUTTON EVENTS
// ===================================

document.addEventListener("click", function (event) {
  const detailsButton = event.target.closest(".details-btn");
  const addButton = event.target.closest(".add-btn");
  const removeButton = event.target.closest(".remove-btn");

  if (detailsButton) {
    showDetails(detailsButton.dataset.id);
  }

  if (addButton) {
    addToWatchlist(addButton.dataset.id);
  }

  if (removeButton) {
    removeFromWatchlist(removeButton.dataset.id);
  }
});

// ===================================
// MODAL EVENTS
// ===================================

const closeButton = document.getElementById("closeModal");

if (closeButton) {
  closeButton.addEventListener("click", closeDetails);
}

const modal = document.getElementById("detailsModal");

if (modal) {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeDetails();
    }
  });
}

// ===================================
// ACCOUNT PAGE
// ===================================

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const accountMessage = document.getElementById("accountMessage");

function showAccountMessage(message, success = false) {
  if (!accountMessage) return;

  accountMessage.textContent = message;
  accountMessage.style.color = success ? "#65d99a" : "#ff8585";
}

if (loginTab && signupTab && loginForm && signupForm) {

  loginTab.addEventListener("click", function () {
    loginForm.hidden = false;
    signupForm.hidden = true;

    loginTab.classList.add("active-tab");
    signupTab.classList.remove("active-tab");

    showAccountMessage("");
  });

  signupTab.addEventListener("click", function () {
    signupForm.hidden = false;
    loginForm.hidden = true;

    signupTab.classList.add("active-tab");
    loginTab.classList.remove("active-tab");

    showAccountMessage("");
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (name.length < 2) {
      showAccountMessage("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      showAccountMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showAccountMessage("Passwords do not match.");
      return;
    }

    showAccountMessage(
      "Form validated! Account registration needs a secure authentication service.",
      true
    );
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showAccountMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 8) {
      showAccountMessage("Password must be at least 8 characters.");
      return;
    }

    showAccountMessage(
      "Form validated! Connect an authentication service to sign in.",
      true
    );
  });
}

// ===================================
// PAGE INITIALIZATION
// ===================================

// Home page
displayTitles(movies, "movieGrid");
displayTitles(series, "seriesGrid");

// Movies page
if (document.getElementById("movieGrid")) {
  displayTitles(movies, "movieGrid");
}

// Series page
if (document.getElementById("seriesGrid")) {
  displayTitles(series, "seriesGrid");
}

// Watchlist page
displayWatchlist();

// Search on whichever page has a search field
setupSearch();
