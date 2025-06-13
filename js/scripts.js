let watchItems = [];

// Escape HTML to prevent XSS
function escapeHtml(text) {
   const div = document.createElement("div");
   div.textContent = text;
   return div.innerHTML;
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
   const value = input.value.trim();
   const feedback = input.parentElement.querySelector(".invalid-feedback");

   if (rules.required && !value) {
      input.setCustomValidity(rules.message.required);
      feedback.textContent = rules.message.required;
      return false;
   }

   if (rules.maxLength && value.length > rules.maxLength) {
      input.setCustomValidity(rules.message.maxLength);
      feedback.textContent = rules.message.maxLength;
      return false;
   }

   if (rules.pattern && !rules.pattern.test(value)) {
      input.setCustomValidity(rules.message.pattern);
      feedback.textContent = rules.message.pattern;
      return false;
   }
   if (rules.unique && data.some(item => item.url === value)) {
      input.setCustomValidity(rules.message.unique);
      feedback.textContent = rules.message.unique;
      return false;
   }
   input.setCustomValidity(""); // Clear previous errors
   return true;
}

// Update watch list display
function updateWatchList() {
   const watchList = document.getElementById("watchList");
   console.log("Updating watch list with", watchItems.length, "items");

   if (watchItems.length === 0) {
      watchList.innerHTML = '';
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

   watchList.innerHTML = html;
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
   updateWatchList();
   updateStats();
}

// Update stats
function updateStats() {
   const count = watchItems.length;
   document.getElementById("totalCount").textContent = count;
   console.log("Stats updated - Total count:", count);
}

// Show or hide "No results" message based on visible items
function updateNoResultsMessage() {
   const items = document.querySelectorAll("#watchList .watch-item");

   // Filter visible items
   const visibleItems = Array.from(items).filter(item =>
      window.getComputedStyle(item).display !== "none"
   );

   const watchList = document.getElementById("watchList");
   const noResultsEl = document.getElementById("noResults");

   if (visibleItems.length === 0) {
      watchList.style.display = "none";
      noResultsEl.style.display = "block";
   } else {
      watchList.style.display = "block";
      noResultsEl.style.display = "none";
   }
}


// Filter watch items by search term
function filterWatchItems(searchTerm) {
   const items = document.querySelectorAll(".watch-item");
   items.forEach(item => {
      const title = item.querySelector(".watch-link")?.textContent.trim().toLowerCase() || "";
      if (title.startsWith(searchTerm)) {
         item.style.display = "block";
      } else {
         item.style.display = "none";
      }
   });
   updateNoResultsMessage();
}

// Initialize event listeners on DOM content loaded
(function () {
   "use strict";

   document.addEventListener('DOMContentLoaded', function () {
      const form = document.querySelector("#watchLaterForm");
      console.log("Watch Later Manager initialized");

      // Rating indicator functionality
      const ratingInputs = document.querySelectorAll('input[name="rating"]');
      const ratingText = document.getElementById("ratingText");
      const ratingTexts = {
         5: {
            text: "Must Watch",
            class: "badge-success"
         },
         4: {
            text: "Recommended",
            class: "badge-primary"
         },
         3: {
            text: "Decent",
            class: "badge-info"
         },
         2: {
            text: "Meh",
            class: "badge-warning"
         },
         1: {
            text: "Skip",
            class: "badge-danger"
         },
      };

      ratingInputs.forEach((input) => {
         input.addEventListener("change", function () {
            if (this.checked) {
               const rating = ratingTexts[this.value];
               ratingText.textContent = rating.text;
               ratingText.className = `badge ${rating.class}`;
            }
         });
      });

      // Form submission handler
      form.addEventListener("submit", function (event) {
         event.preventDefault();
         event.stopPropagation();
         console.log("Form submitted");

         // Validate rating
         const selectedRating = form.querySelector('input[name="rating"]:checked');
         const ratingFeedback = document.getElementById("ratingFeedback");
         let ratingValid = true;

         if (!selectedRating) {
            ratingFeedback.style.display = "block";
            ratingValid = false;
            console.log("Validation failed: No rating selected");
         } else {
            ratingFeedback.style.display = "none";
            ratingValid = true;
            console.log("Selected rating:", selectedRating.value);
         }

         // Validate other fields
         form.classList.add("was-validated");
         let allFieldsValid = true;
         for (const fieldId in validationRules) {
            const input = document.getElementById(fieldId);
            const rules = validationRules[fieldId];
            const isValid = validateInputField(input, rules, watchItems);
            if (!isValid) allFieldsValid = false;
         }

         if (form.checkValidity() && ratingValid && allFieldsValid) {
            // Gather form data
            const title = document.getElementById("title").value.trim();
            const url = document.getElementById("url").value.trim();
            const creator = document.getElementById("creator").value.trim();
            const comments = document.getElementById("comments").value.trim();
            const rating = selectedRating.value;

            const newItem = {
               id: Date.now(),
               title,
               url,
               creator,
               platform: getDomainName(url),
               rating,
               comments,
               //dateAdded: new Date().toLocaleDateString(),
               // mm/dd at hh/mm
               dateAdded: `${String(new Date().getMonth()+1).padStart(2,'0')}/${String(new Date().getDate()).padStart(2,'0')} at ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`

            };

            watchItems.push(newItem);
            console.log("New item added:", newItem);
            console.log("Total items:", watchItems.length);

            updateWatchList();
            updateStats();

            form.reset();
            form.classList.remove("was-validated");
            ratingFeedback.style.display = "none";

            // Reset rating indicator
            ratingText.textContent = "";
         } else {
            console.log("Form validation failed");
         }
      }, false);

      // Delete last item button
      document.getElementById("deleteLastBtn").addEventListener("click", function () {
         if (watchItems.length > 0) {
            const removedItem = watchItems.pop();
            console.log("Last item removed:", removedItem.title);
            updateWatchList();
            updateStats();
         } else {
            console.log("No items to remove");
         }
      });

      // Search input & clear button event handlers
      const searchInput = document.getElementById("searchInput");
      const clearButton = document.getElementById("clearSearch");

      searchInput.addEventListener("input", function () {
         const searchTerm = searchInput.value.toLowerCase().trim();
         filterWatchItems(searchTerm);

         // Initial UI update
         updateNoResultsMessage();
      });

      clearButton.addEventListener("click", function () {
         searchInput.value = "";
         filterWatchItems("");
      });

   });
   function addFloatingControls() {
    // Determine current language based on page URL
    const isfrench = window.location.pathname.includes('-fr');
    // Choose the opposite language for the button label
    const langButtonLabel = isfrench ? 'English' : 'Français';
    // Create controls HTML
    const controls = `
        <div id="floatingControls" class="d-flex flex-md-row flex-column gap-2 position-fixed" 
             style="top: 20px; right: 20px; z-index: 1000;">
            <button id="themeToggle" class="btn btn-secondary w-auto">
                <i class="fas fa-moon"></i>
            </button>
            <button id="langSwitch" class="btn btn-primary w-auto">
                ${langButtonLabel}
            </button>
        </div>
    `;

    $('body').append(controls);

    // Theme toggle functionality
    $('#themeToggle').on('click', function() {
        $('body').toggleClass('dark-theme');
        const isDark = $('body').hasClass('dark-theme');
        $(this).html(`<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-theme');
        $('#themeToggle').html('<i class="fas fa-sun"></i>');
    }

    // Language switch button click event - simple redirect
    $('#langSwitch').on('click', function() {
        if (isfrench) {
            // Switch from French to English
            window.location.href = 'index.html';
        } else {
            // Switch from English to French
            window.location.href = 'index-fr.html';
        }
    });
}

// Initialize everything
setTimeout(() => {
    addFloatingControls();
}, 500);
})();
