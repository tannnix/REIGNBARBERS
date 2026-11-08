// REIGN Barber Co. - interactive features (modern ES6 JavaScript).

// Haircut information used to build the gallery and booking form.
const haircutStyles = [
  { name: "Textured Fade", category: "fade", group: "Fades", image: "haircut_01.png" },
  { name: "Low Taper Fade", category: "fade", group: "Fades", image: "haircut_02.png" },
  { name: "Mid Fade", category: "fade", group: "Fades", image: "haircut_03.png" },
  { name: "High Fade", category: "fade", group: "Fades", image: "haircut_04.png" },
  { name: "Buzz Cut", category: "classic", group: "Classic", image: "haircut_05.png" },
  { name: "French Crop", category: "texture", group: "Textured", image: "haircut_06.png" },
  { name: "Curtain Cut", category: "long", group: "Longer", image: "haircut_07.png" },
  { name: "Two Block", category: "long", group: "Longer", image: "haircut_08.png" },
  { name: "Comma Hair", category: "texture", group: "Textured", image: "haircut_09.png" },
  { name: "Side Part", category: "classic", group: "Classic", image: "haircut_10.png" },
  { name: "Slick Back", category: "classic", group: "Classic", image: "haircut_11.png" },
  { name: "Pompadour", category: "classic", group: "Classic", image: "haircut_12.png" },
  { name: "Quiff", category: "texture", group: "Textured", image: "haircut_13.png" },
  { name: "Crew Cut", category: "classic", group: "Classic", image: "haircut_14.png" },
  { name: "Caesar Cut", category: "classic", group: "Classic", image: "haircut_15.png" },
  { name: "Mullet", category: "long", group: "Longer", image: "haircut_16.png" },
  { name: "Wolf Cut", category: "long", group: "Longer", image: "haircut_17.png" },
  { name: "Bro Flow", category: "long", group: "Longer", image: "haircut_18.png" },
  { name: "Man Bun", category: "long", group: "Longer", image: "haircut_19.png" },
  { name: "Tapered Curly", category: "texture", group: "Textured", image: "haircut_20.png" },
  { name: "Curly Mullet", category: "long", group: "Longer", image: "curly-mullet.jpg", imageFolder: "images" },
  { name: "Locs Fade", category: "fade", group: "Fades", image: "locs-fade.jpg", imageFolder: "images" },
  { name: "Long Buzz Fade", category: "fade", group: "Fades", image: "long-buzz-fade.jpg", imageFolder: "images" },
  { name: "Military Buzz", category: "classic", group: "Classic", image: "military-buzz.jpg", imageFolder: "images" }
];
const initialHaircutCount = 4;
const promoCode = "REIGN10";
const promoDiscount = 0.1;

// Page elements
const styleGrid = document.getElementById("styleGrid");
const styleSearch = document.getElementById("styleSearch");
const styleToggle = document.getElementById("styleToggle");
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect");
const chosenStyle = document.getElementById("chosenStyle");
const styleChips = document.getElementById("styleChips");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const partySize = document.getElementById("partySize");
const hotTowel = document.getElementById("hotTowel");
const consent = document.getElementById("consent");
const priceEstimate = document.getElementById("priceEstimate");
const promoBtn = document.getElementById("promoBtn");
const promoMsg = document.getElementById("promoMsg");
const successState = document.getElementById("successState");
const successText = document.getElementById("successText");
const summaryList = document.getElementById("summaryList");
const serviceHint = document.getElementById("serviceHint");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const backTop = document.getElementById("backTop");

// Debugging helper: report in the console if the script cannot find an element it needs.
const requiredElements = {
  styleGrid, styleSearch, styleToggle, bookingModal, bookingForm, serviceSelect,
  chosenStyle, styleChips, bookingDate, bookingTime, partySize, hotTowel, consent,
  priceEstimate, promoBtn, promoMsg, successState, successText, summaryList,
  serviceHint, toast, menuToggle, mainNav, backTop
};

Object.entries(requiredElements).forEach(([name, element]) => {
  if (!element) {
    console.error(`Element not found: ${name}`);
  }
});

// The same Google Maps link used by the "Get directions" link on the page.
const directionsUrl = document.querySelector(".visit-card .text-link").getAttribute("href");

let activeFilter = "all";
let allHaircutsVisible = false;
let currentHaircuts = haircutStyles;
let promoApplied = false;

/* ============================================================
   HAIRCUT GALLERY
   ============================================================ */

// Create the haircut cards from the information at the top of this file.
const showHaircuts = (styles) => {
  currentHaircuts = styles;

  if (styles.length === 0) {
    styleGrid.innerHTML = '<p class="no-results">No haircut found. Try another search.</p>';
    styleToggle.hidden = true;
    return;
  }

  const visibleStyles = allHaircutsVisible
    ? styles
    : styles.slice(0, initialHaircutCount);

  styleGrid.innerHTML = visibleStyles.map(({ name, group, image, imageFolder }) => `
    <article class="style-card">
      <div class="style-image">
        <img
          src="${imageFolder || "images/haircuts"}/${image}"
          alt="${name} haircut reference"
          loading="lazy"
        >
      </div>
      <div class="style-info">
        <div>
          <h3>${name}</h3>
          <small>${group} style</small>
        </div>
        <button class="pick-style" type="button" data-style="${name}">
          SELECT ↗
        </button>
      </div>
    </article>
  `).join("");

  styleToggle.hidden = styles.length <= initialHaircutCount;
  styleToggle.textContent = allHaircutsVisible
    ? "SHOW LESS"
    : `SEE ALL HAIRCUTS (${styles.length})`;
  styleToggle.setAttribute("aria-expanded", allHaircutsVisible);
};

// Apply the selected category and the text entered in the search box.
const filterHaircuts = () => {
  const searchText = styleSearch.value.trim().toLowerCase();
  const matchingStyles = haircutStyles.filter(({ name, group, category }) => {
    const nameMatches = name.toLowerCase().includes(searchText);
    const groupMatches = group.toLowerCase().includes(searchText);
    const categoryMatches = activeFilter === "all" || category === activeFilter;

    return categoryMatches && (nameMatches || groupMatches);
  });

  console.log(`Filter "${activeFilter}", search "${searchText}": ${matchingStyles.length} match(es).`);
  showHaircuts(matchingStyles);
};

// Add haircut names to the booking form.
haircutStyles.forEach(({ name }) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  chosenStyle.appendChild(option);
});

showHaircuts(haircutStyles);
console.log(`Haircut gallery ready: ${haircutStyles.length} styles loaded.`);

// Let visitors filter the haircut gallery.
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    filterHaircuts();
  });
});

styleSearch.addEventListener("input", filterHaircuts);

// Keydown: pressing Escape inside the search box clears the search.
styleSearch.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    styleSearch.value = "";
    filterHaircuts();
  }
});

// Expand or minimize the haircut gallery.
styleToggle.addEventListener("click", () => {
  allHaircutsVisible = !allHaircutsVisible;
  showHaircuts(currentHaircuts);

  if (!allHaircutsVisible) {
    styleGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

/* ============================================================
   NAVIGATION
   ============================================================ */

const closeMenu = () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

// Open or close the navigation menu on smaller screens.
menuToggle.addEventListener("click", () => {
  const menuIsOpen = menuToggle.getAttribute("aria-expanded") === "true";
  mainNav.classList.toggle("open", !menuIsOpen);
  menuToggle.setAttribute("aria-expanded", String(!menuIsOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ============================================================
   SERVICES: mouseover / mouseout hint
   ============================================================ */

const defaultServiceHint = serviceHint.textContent;

const showServiceHint = (card) => {
  const name = card.querySelector("h3").textContent;
  const price = card.querySelector("strong").firstChild.textContent.trim();

  serviceHint.textContent = `${name} · ${price} starting price · press BOOK to reserve it`;
  serviceHint.classList.add("active");
};

const resetServiceHint = () => {
  serviceHint.textContent = defaultServiceHint;
  serviceHint.classList.remove("active");
};

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseover", () => showServiceHint(card));
  card.addEventListener("mouseout", resetServiceHint);
  // Same hint for keyboard users who tab to the BOOK button.
  card.addEventListener("focusin", () => showServiceHint(card));
  card.addEventListener("focusout", resetServiceHint);
});

/* ============================================================
   BOOKING: price estimate, promo code, style chip
   ============================================================ */

const getTotal = () => {
  if (!serviceSelect.value) {
    return 0;
  }

  const servicePrice = Number(serviceSelect.options[serviceSelect.selectedIndex].dataset.price);
  const addOnPrice = hotTowel.checked ? Number(hotTowel.dataset.price) : 0;
  const people = Math.min(Math.max(parseInt(partySize.value, 10) || 1, 1), 5);
  const subtotal = (servicePrice + addOnPrice) * people;

  return promoApplied ? Math.round(subtotal * (1 - promoDiscount)) : subtotal;
};

const formatPeso = (amount) => "₱" + amount.toLocaleString("en-PH");

const updatePrice = () => {
  priceEstimate.textContent = formatPeso(getTotal());
};

// window.prompt() asks for a code, window.alert() reports a wrong one.
promoBtn.addEventListener("click", () => {
  const code = prompt("Enter your promo code:");

  if (code === null) {
    return; // The visitor pressed Cancel.
  }

  if (code.trim().toUpperCase() === promoCode) {
    promoApplied = true;
    console.log("Promo code accepted: 10% discount applied.");
    promoMsg.textContent = "✓ Promo applied: 10% off";
    updatePrice();
  } else {
    console.warn("Promo code rejected:", code.trim());
    alert("Sorry, that promo code is not valid.");
  }
});

// Show the chosen haircut as a chip that can be removed (createElement + remove).
const renderStyleChip = () => {
  const oldChip = styleChips.querySelector(".chip");

  if (oldChip) {
    oldChip.remove();
  }

  if (!chosenStyle.value) {
    return;
  }

  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = `Style: ${chosenStyle.value}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "chip-remove";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove ${chosenStyle.value}`);
  removeButton.addEventListener("click", () => {
    chosenStyle.value = "";
    renderStyleChip();
  });

  chip.appendChild(removeButton);
  styleChips.appendChild(chip);
};

chosenStyle.addEventListener("change", renderStyleChip);
serviceSelect.addEventListener("change", updatePrice);
partySize.addEventListener("input", updatePrice);
hotTowel.addEventListener("change", updatePrice);

/* ============================================================
   BOOKING: open, close, reset
   ============================================================ */

const openBooking = (serviceName = "") => {
  // Clear a previous selection when the visitor opens the general booking form.
  serviceSelect.value = serviceName;
  bookingModal.classList.add("open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  updatePrice();
  console.log("Booking form opened. Service preselected:", serviceName || "none");
};

const resetBookingForm = () => {
  bookingForm.reset();
  bookingForm.hidden = false;
  successState.hidden = true;
  promoApplied = false;
  promoMsg.textContent = "";
  clearValidationMessages();
  renderStyleChip();
  updatePrice();
};

const closeBooking = () => {
  bookingModal.classList.remove("open");
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  console.log("Booking form closed.");

  // Reset the confirmation if the visitor closes it without pressing Done.
  if (!successState.hidden) {
    resetBookingForm();
  }
};

document.querySelectorAll("[data-book]").forEach((button) => {
  button.addEventListener("click", () => {
    const { service } = button.dataset;
    closeMenu();
    openBooking(service);
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeBooking);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBooking();
    closeMenu();
  }
});

// When a visitor selects a haircut, open the form with that style selected.
styleGrid.addEventListener("click", (event) => {
  const selectedButton = event.target.closest(".pick-style");

  if (!selectedButton) {
    return;
  }

  chosenStyle.value = selectedButton.dataset.style;
  console.log("Haircut style selected:", chosenStyle.value);
  renderStyleChip();
  openBooking("");
  showToast(`${chosenStyle.value} selected for your appointment.`);
});

// Prevent visitors from choosing a date in the past.
const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayText = `${today.getFullYear()}-${month}-${day}`;

bookingDate.min = todayText;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
};

/* ============================================================
   FORM VALIDATION: RegEx + Constraint Validation API
   ============================================================ */

const fieldLabels = {
  customerName: "Name",
  customerPhone: "Phone number",
  customerEmail: "Email address",
  serviceSelect: "Service",
  bookingDate: "Date",
  bookingTime: "Time",
  partySize: "Number of people"
};

// RegEx rules for the text fields (checked with the test() method).
const rules = {
  customerName: {
    regex: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'-]{1,59}$/,
    message: "Use letters, spaces, . ' or - only (at least 2 characters)."
  },
  customerPhone: {
    regex: /^(09\d{9}|\+639\d{9})$/,
    message: "Enter 09XXXXXXXXX or +639XXXXXXXXX."
  },
  customerEmail: {
    regex: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    message: "Enter a valid email like you@example.com."
  }
};

const validatedFields = [
  "customerName", "customerPhone", "customerEmail", "serviceSelect",
  "bookingDate", "bookingTime", "partySize", "consent"
].map((id) => document.getElementById(id));

// Convert a time such as "2:00 PM" into a 24-hour number (14).
const hourFrom12 = (label) => {
  const [time, period] = label.split(" ");
  let hour = Number(time.split(":")[0]);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }
  if (period === "AM" && hour === 12) {
    hour = 0;
  }
  return hour;
};

// Returns our own error message for a field, or "" when the value is fine.
const getCustomMessage = (field) => {
  if (field.type === "checkbox") {
    return field.checked ? "" : "Please tick this box to continue.";
  }

  const value = field.value.trim();

  if (value === "") {
    return field.required ? `${fieldLabels[field.id]} is required.` : "";
  }

  const rule = rules[field.id];
  if (rule && !rule.regex.test(value)) {
    return rule.message;
  }

  if (field.id === "bookingDate") {
    if (value < todayText) {
      return "Please choose today or a future date.";
    }
    if (new Date(`${value}T00:00:00`).getDay() === 1) {
      return "We're closed on Mondays. Please pick Tuesday to Sunday.";
    }
  }

  if (field.id === "bookingTime" && bookingDate.value === todayText &&
      hourFrom12(value) <= new Date().getHours()) {
    return "That time has already passed today.";
  }

  if (field.id === "partySize") {
    const people = Number(value);
    if (!Number.isInteger(people) || people < 1 || people > 5) {
      return "Choose between 1 and 5 people.";
    }
  }

  return "";
};

const showFieldMessage = (field, message) => {
  const output = document.getElementById(`${field.id}Msg`);
  const isValid = message === "";

  field.classList.toggle("is-invalid", !isValid);
  field.classList.toggle("is-valid", isValid);
  field.setAttribute("aria-invalid", String(!isValid));

  output.textContent = isValid ? "✓ Looks good" : message;
  output.className = `field-msg ${isValid ? "success-msg" : "error-msg"}`;
};

const validateField = (field) => {
  field.setCustomValidity(getCustomMessage(field)); // our message (RegEx and extra rules)
  const isValid = field.checkValidity();            // also applies the built-in HTML5 rules
  showFieldMessage(field, isValid ? "" : field.validationMessage);
  return isValid;
};

const validateContactMethod = () => {
  const chosen = bookingForm.querySelector('input[name="contactMethod"]:checked');
  const output = document.getElementById("contactMethodMsg");

  output.textContent = chosen
    ? `✓ We'll confirm by ${chosen.value}`
    : "Please choose how we should confirm.";
  output.className = `field-msg ${chosen ? "success-msg" : "error-msg"}`;
  return Boolean(chosen);
};

const clearValidationMessages = () => {
  validatedFields.forEach((field) => {
    field.setCustomValidity("");
    field.classList.remove("is-valid", "is-invalid");
    field.removeAttribute("aria-invalid");
    const output = document.getElementById(`${field.id}Msg`);
    output.textContent = "";
    output.className = "field-msg";
  });

  const contactMessage = document.getElementById("contactMethodMsg");
  contactMessage.textContent = "";
  contactMessage.className = "field-msg";
};

// Give feedback while the visitor types or chooses.
validatedFields.forEach((field) => {
  const textLike = ["text", "tel", "email", "number"].includes(field.type);
  field.addEventListener(textLike ? "input" : "change", () => validateField(field));
});

bookingDate.addEventListener("change", () => {
  if (bookingTime.value) {
    validateField(bookingTime); // "today" changes which times are still allowed
  }
});

document.querySelectorAll('input[name="contactMethod"]').forEach((radio) => {
  radio.addEventListener("change", validateContactMethod);
});

// preventDefault() stops the page from submitting until everything is valid.
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldResults = validatedFields.map((field) => validateField(field));
  const contactIsValid = validateContactMethod();

  console.log("Validation results:", {
    ...Object.fromEntries(validatedFields.map((field, index) => [field.id, fieldResults[index]])),
    contactMethod: contactIsValid
  });

  if (!fieldResults.every(Boolean) || !contactIsValid) {
    console.warn("Form not submitted: some fields are invalid.");
    const firstInvalid = validatedFields.find((field) => !field.checkValidity());

    if (firstInvalid) {
      firstInvalid.reportValidity();
    } else {
      bookingForm.querySelector('input[name="contactMethod"]').focus();
    }
    showToast("Please fix the highlighted fields.");
    return;
  }

  // window.confirm() lets the visitor double-check before sending.
  const wantsToSend = confirm(
    `Send this appointment request?\n\n${serviceSelect.value} on ${bookingDate.value} at ${bookingTime.value}`
  );

  if (!wantsToSend) {
    console.log("Visitor cancelled the appointment request.");
    showToast("Request not sent. You can still edit your details.");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const prettyDate = new Date(`${bookingDate.value}T00:00:00`).toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const contactMethod = bookingForm.querySelector('input[name="contactMethod"]:checked').value;

  const entries = [
    ["Name", customerName],
    ["Service", serviceSelect.value + (hotTowel.checked ? " + Hot towel finish" : "")],
    ["Haircut style", chosenStyle.value || "Not sure yet"],
    ["People", partySize.value],
    ["Date", prettyDate],
    ["Time", bookingTime.value],
    ["Confirm by", contactMethod],
    ["Estimated total", formatPeso(getTotal()) + (promoApplied ? " (10% promo)" : "")]
  ];

  console.log("Appointment request prepared:", {
    service: serviceSelect.value,
    style: chosenStyle.value || "Not sure yet",
    people: Number(partySize.value),
    date: bookingDate.value,
    time: bookingTime.value,
    hotTowel: hotTowel.checked,
    promoApplied,
    total: getTotal()
  });

  // Build the summary list with createElement() and appendChild().
  summaryList.innerHTML = "";
  entries.forEach(([label, value]) => {
    const item = document.createElement("li");
    const labelText = document.createElement("span");
    const valueText = document.createElement("span");

    labelText.textContent = label.toUpperCase();
    valueText.textContent = value;
    item.appendChild(labelText);
    item.appendChild(valueText);
    summaryList.appendChild(item);
  });

  successText.textContent =
    `Thanks, ${customerName.split(" ")[0]}! Your request is ready. ` +
    "This is a demo only. Please contact the shop to confirm your appointment.";

  bookingForm.hidden = true;
  successState.hidden = false;
});

document.getElementById("doneBtn").addEventListener("click", closeBooking);

// window.print() and window.open() on the confirmation screen.
document.getElementById("printBtn").addEventListener("click", () => {
  console.log("Opening the print dialog.");
  window.print();
});
document.getElementById("directionsBtn").addEventListener("click", () => {
  console.log("Opening directions:", directionsUrl);
  window.open(directionsUrl, "_blank", "noopener");
});

/* ============================================================
   FOOTER NEWSLETTER (same RegEx idea as the booking form)
   ============================================================ */

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMsg = document.getElementById("newsletterMsg");

const showNewsletterMessage = (text, isValid) => {
  newsletterMsg.textContent = text;
  newsletterMsg.className = `newsletter-msg ${isValid ? "success-msg" : "error-msg"}`;
};

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterEmail.value.trim();

  if (email === "") {
    console.warn("Newsletter: email address is empty.");
    showNewsletterMessage("Email address is required.", false);
  } else if (!rules.customerEmail.regex.test(email)) {
    console.warn("Newsletter: email format is invalid.");
    showNewsletterMessage(rules.customerEmail.message, false);
  } else {
    console.log("Newsletter: valid email accepted (demo only, nothing sent).");
    showNewsletterMessage("✓ Thanks! You're on the list (demo only).", true);
    newsletterForm.reset();
  }
});

/* ============================================================
   SHOP STATUS, SCROLL EFFECTS, FOOTER
   ============================================================ */

// Show whether the shop is open and highlight today's opening-hours row.
const updateShopStatus = () => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const shopIsOpen = currentDay !== 1 && currentHour >= 10 && currentHour < 20;
  const statusText = document.getElementById("shopStatus");
  const statusDot = document.querySelector(".status-dot");

  console.log(`Shop status checked: ${shopIsOpen ? "open" : "closed"} (day ${currentDay}, hour ${currentHour}).`);

  if (shopIsOpen) {
    statusText.textContent = "OPEN NOW · COME THROUGH";
    statusDot.classList.remove("closed");
  } else {
    statusText.textContent = "CURRENTLY CLOSED · OPEN TUE – SUN";
    statusDot.classList.add("closed");
  }

  document.querySelectorAll(".hours-table tbody tr").forEach((row) => {
    row.classList.toggle("today", Number(row.dataset.day) === currentDay);
  });
};

updateShopStatus();

// Reveal sections as they enter the visitor's screen.
const revealSections = () => {
  document.querySelectorAll(".reveal").forEach((item) => {
    if (item.getBoundingClientRect().top < window.innerHeight - 60) {
      item.classList.add("in-view");
    }
  });
};

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);
revealSections();

// Show a button that takes visitors back to the top of the page.
window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 500);
});

backTop.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

document.getElementById("year").textContent = new Date().getFullYear();

console.log("REIGN Barber Co. website script loaded.");
