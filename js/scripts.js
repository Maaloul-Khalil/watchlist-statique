let watchItems = [];

// Storage functions
function saveToStorage() {
  try {
    localStorage.setItem('watchItems', JSON.stringify(watchItems));
    console.log('Watch items saved to localStorage');
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem('watchItems');
    if (stored) {
      watchItems = JSON.parse(stored);
      console.log('Loaded', watchItems.length, 'items from localStorage');
      updateWatchList();
      updateStats();
    }
  } catch (error) {
    console.warn('Could not load from localStorage:', error);
    watchItems = [];
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
   return $('<div>').text(text).html();
}

function getDomainName(url) {
   if (!url || typeof url !== 'string') return 'Unknown';
   const SHORT_DOMAINS = {
      'youtu.be': 'youtube',
      't.co': 'twitter',
      'fb.me': 'facebook',
   };
   try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const {
         hostname
      } = new URL(normalizedUrl);
      let domain = hostname.replace(/^www\./, '').split('.')[0];
      if (SHORT_DOMAINS[hostname]) {
         domain = SHORT_DOMAINS[hostname];
      }
      return domain.charAt(0).toUpperCase() + domain.slice(1);
   } catch (e) {
      return 'Unknown';
   }
}

function getRatingText(rating) {
   const texts = {
      5: "Must Watch",
      4: "Recommended",
      3: "Decent",
      2: "Meh",
      1: "Skip",
   };
   return texts[rating] || "Unknown";
}

function getRatingBadgeClass(rating) {
   const classes = {
      5: "badge-success",
      4: "badge-primary",
      3: "badge-info",
      2: "badge-warning",
      1: "badge-danger",
   };
   return classes[rating] || "badge-secondary";
}

const validationRules = {
   title: {
      required: true,
      maxLength: 30,
      message: {
         required: "Please provide a title.",
         maxLength: "Title must not exceed 30 characters."
      }
   },
   url: {
      required: true,
      pattern: /^https?:\/\/.+/,
      unique: true,
      message: {
         required: "Please enter a URL.",
         pattern: "URL must start with http:// or https://",
         unique: "You already entered this URL."
      }
   },
   // Add more inputs as needed
};

function validateInputField(input, rules, data = []) {
   const $input = $(input);
   const value = $input.val().trim();
   const $feedback = $input.parent().find(".invalid-feedback");

   if (rules.required && !value) {
      input.setCustomValidity(rules.message.required);
      $feedback.text(rules.message.required);
      return false;
   }

   if (rules.maxLength && value.length > rules.maxLength) {
      input.setCustomValidity(rules.message.maxLength);
      $feedback.text(rules.message.maxLength);
      return false;
   }

   if (rules.pattern && !rules.pattern.test(value)) {
      input.setCustomValidity(rules.message.pattern);
      $feedback.text(rules.message.pattern);
      return false;
   }
   if (rules.unique && data.some(item => item.url === value)) {
      input.setCustomValidity(rules.message.unique);
      $feedback.text(rules.message.unique);
      return false;
   }
   input.setCustomValidity(""); // Clear previous errors
   return true;
}

// Update watch list display
function updateWatchList() {
   const $watchList = $("#watchList");
   console.log("Updating watch list with", watchItems.length, "items");

   if (watchItems.length === 0) {
      $watchList.html('');
      return;
   }

   let html = "";
   // for (let i = watchItems.length - 1; i >= 0; i--) {
   // for (let i = 0; i < watchItems.length; i++)
   for (let i = watchItems.length - 1; i >= 0; i--) {
      const item = watchItems[i];
      console.log("Processing item:", item.title);

      // Generate star display for rating
      let starsHtml = "";
      for (let j = 1; j <= 5; j++) {
         if (j <= item.rating) {
            starsHtml += '<span style="color: #FFD600;">★</span>';
         } else {
            starsHtml += '<span style="color: #ddd;">☆</span>';
         }
      }

      //html += '<div class="watch-item watch-slide-in " data-watch-id="' + item.id + '">';
      html += '<div class="watch-item watch-slide-in ' + getRatingBadgeClass(item.rating).replace('badge-', 'border-') + '" data-watch-id="' + item.id + '">';
      html += '<div class="d-flex justify-content-between">';
      html += '<div class="flex-grow-1">';
      html += '<div class="watch-info">';
      html += '<a href="' + item.url + '" target="_blank" class="watch-link">';
      html += '<i class="fas fa-external-link-alt me-2"></i>';
      html += escapeHtml(item.title);
      html += '</a>';
      //html += `<span class="badge ${getRatingBadgeClass(item.rating).replace('badge-', 'bg-')} text-white ms-2">${getRatingText(item.rating)}</span>`;
      html += '<div class="rating-text">';
      html += '' + starsHtml + ' ';
      html += '</div>';
      html += '<div class="platform-text">';
      html += '<i class="fas fa-tv me-1"></i>';
      html += 'Platform: <strong>' + item.platform + '</strong>';
      html += '</div>';
      html += '<div class="date-text">';
      html += '<i class="fas fa-calendar-alt me-1"></i>';
      html += 'Added: <strong>' + item.dateAdded + '</strong>';
      html += '</div>';
      if (item.creator) {
              html += '<div class="creator-text">';
      html += '<i class="fas fa-user-tie me-1"></i>';
      html += 'Created by <strong>' + escapeHtml(item.creator) + '</strong>';
      html += '</div>';
      }
      if (item.comments) {
         html += '<div class="comments-text">';
         html += '<i class="fas fa-comment me-1"></i>';
         html += escapeHtml(item.comments);
         html += '</div>';
      }
      html += '</div>';
      html += '</div>';
      html += '<div class="watch-actions">';
      html += `<span class="badge ${getRatingBadgeClass(item.rating).replace('badge-', 'bg-')} text-white ms-2">${getRatingText(item.rating)}</span>`;
      // html += '<span class="badge bg-secondary me-2">#' + (i + 1) + '</span>';
      html += '<button class="btn btn-outline-danger btn-lg position-relative" onclick="removeItem(' + item.id + ')" style="margin-top:90%;">';
      html += '<i class="fas fa-trash me-1"></i>Remove';
      html += '</button>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
   }

   $watchList.html(html);
   console.log("Watch list updated successfully");
}

// Remove specific item
function removeItem(id) {
   console.log("Removing item with ID:", id);
   const originalLength = watchItems.length;
   const newWatchItems = [];

   for (let i = 0; i < watchItems.length; i++) {
      if (watchItems[i].id !== id) {
         newWatchItems.push(watchItems[i]);
      }
   }

   watchItems = newWatchItems;
   console.log("Items removed:", originalLength - watchItems.length);
   saveToStorage(); // Save after removing
   updateWatchList();
   updateStats();
}

// Update stats
function updateStats() {
   const count = watchItems.length;
   $("#totalCount").text(count);
   console.log("Stats updated - Total count:", count);
}

// Show or hide "No results" message based on visible items
function updateNoResultsMessage() {
  const $items = $("#watchList .watch-item");
  const visibleItems = $items.filter(function () {
    return $(this).is(":visible");
  });

  const $watchList = $("#watchList");
  const $noResultsEl = $("#noResults");
  const searchTerm = $("#searchInput").val().trim();

  // Only show "No results" if there's an active search with no matches
  if (searchTerm !== "" && visibleItems.length === 0 && $items.length > 0) {
    $watchList.hide();
    $noResultsEl.show();
  } else {
    $watchList.show();
    $noResultsEl.hide();
  }
}

// Filter watch items by search term
function filterWatchItems(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (term === "") {
   console.log("No search term provided, showing all items");
   $(".watch-item").show();
   $("#watchList").show();
   $("#noResults").hide(); // Always hide when search is empty
    return;
  }

  $(".watch-item").each(function () {
    const title = $(this).find(".watch-link").text().toLowerCase().trim();
    const matches = title.startsWith(term);
    $(this).toggle(matches);
  });

  updateNoResultsMessage();
}

function getFormattedDate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  
  return `${month}/${day} - ${hours}:${minutes}`;
}

(function () {
  "use strict";

  $(document).ready(() => {
   // Load saved items on page load
    loadFromStorage();

    const $form = $("#watchLaterForm");
    console.log("Watch Later Manager initialized");

    const ratingTexts = {
      5: { text: "Must Watch", class: "badge-success" },
      4: { text: "Recommended", class: "badge-primary" },
      3: { text: "Decent", class: "badge-info" },
      2: { text: "Meh", class: "badge-warning" },
      1: { text: "Skip", class: "badge-danger" },
    };

    const $ratingText = $("#ratingText");

    $('input[name="rating"]').on("change", function () {
      if (this.checked) {
        const rating = ratingTexts[this.value];
        $ratingText.text(rating.text).attr("class", `badge ${rating.class}`);
      }
    });

    $form.on("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const selectedRating = $form.find('input[name="rating"]:checked')[0];
      const $ratingFeedback = $("#ratingFeedback");
      let ratingValid = true;

      if (!selectedRating) {
        $ratingFeedback.show();
        ratingValid = false;
        console.warn("Validation failed: No rating selected");
      } else {
        $ratingFeedback.hide();
        console.log("Selected rating:", selectedRating.value);
      }

      $form.addClass("was-validated");

      let allFieldsValid = true;
      for (const fieldId in validationRules) {
        const $input = $(`#${fieldId}`);
        const rules = validationRules[fieldId];
        const isValid = validateInputField($input[0], rules, watchItems);
        if (!isValid) allFieldsValid = false;
      }

      if ($form[0].checkValidity() && ratingValid && allFieldsValid) {
        const getVal = (id) => $(`#${id}`).val().trim();
        const dateAdded = getFormattedDate();

        const newItem = {
          id: Date.now(),
          title: getVal("title"),
          url: getVal("url"),
          creator: getVal("creator"),
          platform: getDomainName(getVal("url")),
          rating: selectedRating.value,
          comments: getVal("comments"),
          dateAdded,
        };

        watchItems.push(newItem);
        saveToStorage(); // Save after adding new item
        console.log("New item added:", newItem);
        console.log("Total items:", watchItems.length);

        updateWatchList();
        updateStats();

        $form[0].reset();
        $form.removeClass("was-validated");
        $ratingFeedback.hide();
        $ratingText.text("");
      } else {
        console.warn("Form validation failed");
      }
    });

    $("#deleteLastBtn").on("click", () => {
      if (watchItems.length > 0) {
        const removedItem = watchItems.pop();
        saveToStorage(); // Save after deleting last item
        console.log("Last item removed:", removedItem.title);
        updateWatchList();
        updateStats();
      } else {
        console.log("No items to remove");
      }
    });

    const $searchInput = $("#searchInput");
    const $clearButton = $("#clearSearch");

    $searchInput.on("input", () => {
        const rawValue = $searchInput.val();
        console.log("Search input changed:", rawValue);
        const searchTerm = $searchInput.val().toLowerCase().trim();

        filterWatchItems(searchTerm);
        updateNoResultsMessage();
    });

    $clearButton.on("click", () => {
      $searchInput.val("");
      filterWatchItems("");
      $("#watchList").css("display", "");
      $("#noResults").css("display", "none");
    });
  });

  function addFloatingControls() {
    const isFrench = window.location.pathname.includes("-fr");
    const langButtonLabel = isFrench ? "English" : "Français";

    const controls = `
    <button id="themeToggle" class="btn btn-secondary">
      <i class="fas fa-moon"></i>
    </button>
    <button id="langSwitch" class="btn btn-primary">
      ${langButtonLabel}
    </button>
  `;

    //$("body").append(controls);
    $("#topNavbar .buttonRight").append(controls);

    $("#themeToggle").on("click", function () {
      $("body").toggleClass("dark-theme");
      const isDark = $("body").hasClass("dark-theme");
      $(this).html(`<i class="fas fa-${isDark ? "sun" : "moon"}"></i>`);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      $("body").addClass("dark-theme");
      $("#themeToggle").html('<i class="fas fa-sun"></i>');
    }

    $("#langSwitch").on("click", () => {
      window.location.href = isFrench ? "index.html" : "index-fr.html";
    });
  }

  setTimeout(addFloatingControls, 500);
})();