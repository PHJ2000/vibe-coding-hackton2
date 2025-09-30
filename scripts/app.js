import {
  beaches,
  featuredEvents,
  buddyBoardPosts,
  marineSportsGuides
} from "../data/beachData.js";

const beachList = document.getElementById("beachList");
const detailView = document.getElementById("detailView");
const searchInput = document.getElementById("searchInput");
const chips = Array.from(document.querySelectorAll(".chip"));
const eventList = document.querySelector("#eventHighlights .event-list");
const buddyList = document.querySelector("#buddyBoard .buddy-list");
const sportsList = document.querySelector("#sportsInfo .sports-list");
const personalList = document.querySelector("#personalTips .personal-list");
const personalMessage = document.querySelector("#personalTips .personal-message");

const FAVORITE_KEY = "favorite-beaches";

const storageAvailable =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readFavorites = () => {
  if (!storageAvailable) return [];
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITE_KEY) || "[]");
  } catch (error) {
    console.warn("즐겨찾기 정보를 불러오지 못했어요.", error);
    return [];
  }
};

const favoriteSet = new Set(readFavorites());

const formatStatus = (status) => {
  switch (status) {
    case "safe":
      return { label: "안전", className: "safe" };
    case "caution":
      return { label: "주의", className: "caution" };
    default:
      return { label: "경보", className: "alert" };
  }
};

const formatMetric = (value, unit) => `${value.toFixed(1)}${unit}`;

const renderBeaches = (filter = "all", term = "") => {
  const keyword = term.trim().toLowerCase();

  const filtered = beaches.filter((beach) => {
    const matchesFilter = filter === "all" || beach.status === filter;
    const matchesKeyword =
      !keyword ||
      beach.name.toLowerCase().includes(keyword) ||
      beach.region.toLowerCase().includes(keyword);
    return matchesFilter && matchesKeyword;
  });

  beachList.innerHTML = "";

  if (!filtered.length) {
    beachList.innerHTML = `<li class="empty-state">검색 결과가 없습니다.</li>`;
    return;
  }

  filtered.forEach((beach) => {
    const { label, className } = formatStatus(beach.status);
    const card = document.createElement("li");
    card.className = "beach-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="beach-card__info">
        <h3>${beach.name}</h3>
        <p>${beach.region}</p>
        <div class="detail__meta">
          <span>해수온 ${formatMetric(beach.seaTemperature, "°C")}</span>
          <span>파고 ${formatMetric(beach.waveHeight, "m")}</span>
          <span>풍속 ${formatMetric(beach.windSpeed, "m/s")}</span>
        </div>
      </div>
      <span class="status-badge ${className}">${label}</span>
    `;

    card.addEventListener("click", () => showBeachDetail(beach.id));
    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showBeachDetail(beach.id);
      }
    });

    beachList.appendChild(card);
  });
};

const renderMetrics = (beach) => `
  <div class="metrics-grid">
    <div class="metric-card">
      <span>해수 온도</span>
      <strong>${formatMetric(beach.seaTemperature, "°C")}</strong>
    </div>
    <div class="metric-card">
      <span>파고</span>
      <strong>${formatMetric(beach.waveHeight, "m")}</strong>
    </div>
    <div class="metric-card">
      <span>풍속</span>
      <strong>${formatMetric(beach.windSpeed, "m/s")}</strong>
    </div>
    <div class="metric-card">
      <span>이안류 위험도</span>
      <strong>${beach.ripCurrentRisk}</strong>
    </div>
  </div>
`;

const renderListItems = (items) =>
  items.map((item) => `<li>${item}</li>`).join("");

const renderContacts = (contacts) =>
  contacts
    .map((contact) => `<li><strong>${contact.type}</strong> · ${contact.phone}</li>`)
    .join("");

const renderEvents = (events) =>
  events
    .map(
      (event) => `
        <div class="event-item">
          <h4>${event.name}</h4>
          <p class="muted">${event.date}</p>
          <p>${event.description}</p>
        </div>
      `
    )
    .join("");

const renderBuddyPosts = (posts) =>
  posts
    .map(
      (post) => `
        <div class="buddy-item">
          <h4>${post.title}</h4>
          <p class="muted">${post.author}</p>
          <p>${post.message}</p>
        </div>
      `
    )
    .join("");

const renderSports = (sports) =>
  sports
    .map(
      (sport) => `
        <li class="list-pill">
          <span>${sport.name}</span>
          <span aria-hidden="true">·</span>
          <span>${sport.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>${sport.contact}</span>
        </li>
      `
    )
    .join("");

const updateFavorites = () => {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(
      FAVORITE_KEY,
      JSON.stringify(Array.from(favoriteSet))
    );
  } catch (error) {
    console.warn("즐겨찾기 정보를 저장하지 못했어요.", error);
  }
  renderPersonalizedTips();
};

const showBeachDetail = (id) => {
  const beach = beaches.find((item) => item.id === id);
  if (!beach) return;

  const { label, className } = formatStatus(beach.status);
  const isFavorite = favoriteSet.has(beach.id);

  detailView.innerHTML = `
    <article class="detail__header">
      <div class="detail__header-top">
        <div>
          <p class="status-badge ${className}">${label}</p>
          <h3 class="detail__title">${beach.name}</h3>
        </div>
        <button class="favorite-btn ${isFavorite ? "is-favorite" : ""}" data-id="${beach.id}">
          <span aria-hidden="true">${isFavorite ? "★" : "☆"}</span>
          <span>${isFavorite ? "즐겨찾기됨" : "즐겨찾기"}</span>
        </button>
      </div>
      <div class="detail__meta">
        <span>${beach.region}</span>
        <span>해파리 경보: ${beach.jellyfishAlert}</span>
        <span>안전 메모: ${beach.safetyNotes[0]}</span>
      </div>
    </article>

    <section class="info-section" aria-label="기상 정보">
      <h4>기상 & 바다 상태</h4>
      ${renderMetrics(beach)}
    </section>

    <section class="info-section" aria-label="안전 정보">
      <h4>안전 인포 카드</h4>
      <ul class="info-list">
        ${renderListItems(beach.safetyNotes)}
      </ul>
      <h4>긴급 연락망</h4>
      <ul class="info-list">
        ${renderContacts(beach.emergencyContacts)}
      </ul>
    </section>

    <section class="info-section" aria-label="편의 시설">
      <h4>현장 편의 정보</h4>
      <ul class="info-list">
        ${renderListItems(beach.amenities)}
      </ul>
    </section>

    <section class="info-section" aria-label="행사">
      <h4>근처 행사 & 축제</h4>
      ${renderEvents(beach.events)}
    </section>

    <section class="info-section" aria-label="커뮤니티">
      <h4>커뮤니티 소식</h4>
      ${renderBuddyPosts(beach.buddyPosts)}
    </section>

    <section class="info-section" aria-label="해양 스포츠">
      <h4>추천 해양 스포츠</h4>
      <ul class="pill-group">
        ${renderSports(beach.sports)}
      </ul>
    </section>

    <section class="info-section" aria-label="맞춤 추천">
      <h4>맞춤 추천</h4>
      <ul class="info-list">
        ${renderListItems(beach.personalizedTips)}
      </ul>
    </section>
  `;

  const favoriteButton = detailView.querySelector(".favorite-btn");
  favoriteButton.addEventListener("click", () => {
    if (favoriteSet.has(beach.id)) {
      favoriteSet.delete(beach.id);
    } else {
      favoriteSet.add(beach.id);
    }
    updateFavorites();
    showBeachDetail(beach.id);
  });
};

const renderGlobalEvents = () => {
  eventList.innerHTML = featuredEvents
    .map((event) => {
      const beach = beaches.find((b) => b.id === event.beachId);
      return `
        <li class="event-item">
          <h4>${event.title}</h4>
          <p class="muted">${event.date} · ${beach?.name ?? "미확인"}</p>
          <p>${event.description}</p>
          <div class="event-tags">
            ${event.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
          </div>
        </li>
      `;
    })
    .join("");
};

const renderBuddyBoard = () => {
  buddyList.innerHTML = buddyBoardPosts
    .map(
      (post) => `
        <li class="buddy-item">
          <h4>${post.title}</h4>
          <p class="muted">${post.beach} · ${post.time}</p>
          <p>${post.message}</p>
          <div class="buddy-tags">
            ${post.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
          </div>
        </li>
      `
    )
    .join("");
};

const renderSportsGuides = () => {
  sportsList.innerHTML = marineSportsGuides
    .map(
      (guide) => `
        <li class="buddy-item">
          <h4>${guide.title}</h4>
          <p>${guide.description}</p>
        </li>
      `
    )
    .join("");
};

const renderPersonalizedTips = () => {
  personalList.innerHTML = "";

  if (!favoriteSet.size) {
    personalMessage.textContent =
      "즐겨찾기한 해수욕장이 아직 없어요. 마음에 드는 해수욕장을 즐겨찾기해 보세요!";
    return;
  }

  const favoriteBeaches = beaches.filter((beach) => favoriteSet.has(beach.id));
  const tips = favoriteBeaches.flatMap((beach) =>
    beach.personalizedTips.map((tip) => ({
      beach: beach.name,
      message: tip
    }))
  );

  personalMessage.textContent = `즐겨찾기한 ${favoriteBeaches
    .map((beach) => beach.name)
    .join(", ")} 맞춤 추천이에요.`;

  personalList.innerHTML = tips
    .map(
      (tip) => `
        <li class="buddy-item">
          <h4>${tip.beach}</h4>
          <p>${tip.message}</p>
        </li>
      `
    )
    .join("");
};

renderBeaches();
renderGlobalEvents();
renderBuddyBoard();
renderSportsGuides();
renderPersonalizedTips();

searchInput.addEventListener("input", (event) => {
  const activeChip = chips.find((chip) => chip.classList.contains("active"));
  renderBeaches(activeChip?.dataset.filter ?? "all", event.target.value);
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    renderBeaches(chip.dataset.filter, searchInput.value);
  });
});

const initialFavorite = Array.from(favoriteSet)[0];
if (initialFavorite) {
  showBeachDetail(initialFavorite);
} else {
  showBeachDetail(beaches[0].id);
}
