let watchItems = [];

// Escape HTML to prevent XSS
function escapeHtml(text) {
   const div = document.createElement("div");
   div.textContent = text;
   return div.innerHTML;
}

function getDomainName(url) {
   try {
      // Extract the domain name using regex
      const match = url.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\..+)?\/?/);
      if (match && match[1]) {
         const domain = match[1];
         // Capitalize the first letter and return
         return domain.charAt(0).toUpperCase() + domain.slice(1);
      }
      return "Unknown";
   } catch (e) {
      return "Unknown";
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

// Bootstrap custom client-side validation
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

      // Add event listeners to rating inputs
      ratingInputs.forEach((input) => {
         input.addEventListener("change", function () {
            if (this.checked) {
               const rating = ratingTexts[this.value];
               ratingText.textContent = rating.text;
               ratingText.className = `badge ${rating.class}`;
            }
         });
      });

      form.addEventListener("submit", function (event) {
         event.preventDefault(); // this prevents the default form submission
         event.stopPropagation(); // this stops the event from bubbling up
         console.log("Form submitted");

         // Get selected rating
         const selectedRating = form.querySelector('input[name="rating"]:checked');
         const ratingFeedback = document.getElementById("ratingFeedback");

         // Validate rating first
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

         // Always add was-validated class to show Bootstrap validation
         form.classList.add("was-validated");

         // Check if form is valid AND rating is selected
         if (form.checkValidity() && ratingValid) {
            // Get form data
            const title = document.getElementById("title").value.trim();
            const url = document.getElementById("url").value.trim();
            const creator = document.getElementById("creator").value.trim();
            const comments = document.getElementById("comments").value.trim();
            const rating = selectedRating.value;

            const newItem = {
               id: Date.now(),
               title: title,
               url: url,
               creator: creator,
               platform: getDomainName(url),
               rating: rating,
               comments: comments,
               dateAdded: new Date().toLocaleDateString(),
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
            ratingText.textContent = "Select a rating";
            ratingText.className = "badge badge-secondary";
         } else {
            console.log("Form validation failed");
         }
      }, false);

      // Delete last item
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
   });
})();

// Update watch list display
function updateWatchList() {
   const watchList = document.getElementById("watchList");
   console.log("Updating watch list with", watchItems.length, "items");

   if (watchItems.length === 0) {
      watchList.innerHTML = '<li class="list-group-item text-muted">No items yet</li>';
      return;
   }

   let html = "";
   for (let i = 0; i < watchItems.length; i++) {
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

      html += '<div class="watch-item watch-slide-in" data-watch-id="' + item.id + '">';
      html += '<div class="d-flex align-items-center justify-content-between">';
      html += '<div class="flex-grow-1">';
      html += '<div class="watch-info">';
      html += '<a href="' + item.url + '" target="_blank" class="watch-link">';
      html += '<i class="fas fa-external-link-alt me-2"></i>';
      html += escapeHtml(item.title);
      html += '</a>';
      html += '<div class="creator-text">';
      html += '<i class="fas fa-user-tie me-1"></i>';
      html += 'Created by <strong>' + escapeHtml(item.creator || "Unknown") + '</strong>';
      html += '</div>';
      html += '<div class="platform-text">';
      html += '<i class="fas fa-tv me-1"></i>';
      html += 'Platform: <strong>' + item.platform + '</strong>';
      html += '</div>';
      html += '<div class="rating-text">';
      html += '<i class="fas fa-star me-1"></i>';
      html += 'Rating: ' + starsHtml + ' ';
      html += '<span class="badge ' + getRatingBadgeClass(item.rating) + ' ms-2">' + getRatingText(item.rating) + '</span>';
      html += '</div>';
      html += '<div class="date-text">';
      html += '<i class="fas fa-calendar-alt me-1"></i>';
      html += 'Added: <strong>' + item.dateAdded + '</strong>';
      html += '</div>';
      if (item.comments) {
         html += '<div class="comments-text">';
         html += '<i class="fas fa-comment me-1"></i>';
         html += escapeHtml(item.comments);
         html += '</div>';
      }
      html += '</div>';
      html += '</div>';
      html += '<div class="watch-actions">';
      html += '<span class="badge bg-secondary me-2">#' + (i + 1) + '</span>';
      html += '<button class="btn btn-outline-danger btn-sm" onclick="removeItem(' + item.id + ')">';
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