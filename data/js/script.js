document.addEventListener("DOMContentLoaded", function () {
  // --- Handle top-level menu toggle ---
  const menuHeaders = document.querySelectorAll(".menu-header");
  menuHeaders.forEach(header => {
    header.addEventListener("click", function () {
      header.classList.toggle("open");
    });
  });

  // --- Handle sub-submenu toggle ---
  const subSubmenuToggles = document.querySelectorAll(".has-sub-submenu");
  subSubmenuToggles.forEach(toggle => {
    toggle.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent parent menu toggle
      toggle.classList.toggle("open");
    });
  });

  // --- Apply saved menu order ---
  const sidebarContent = document.querySelector(".sidebar-content");
  const savedOrder = JSON.parse(localStorage.getItem("menuOrder"));
  const savedVisibility = JSON.parse(localStorage.getItem("menuVisibility")) || {};

  if (sidebarContent) {
    const allSections = Array.from(sidebarContent.querySelectorAll(".menu-category"));

    // Separate Settings section
    const settingsSection = allSections.find(section =>
      section.dataset.id?.toLowerCase() === "settings"
    );

    // Apply order for all others except "settings"
    const orderedSections = [];

    if (savedOrder && Array.isArray(savedOrder)) {
      savedOrder.forEach(id => {
        if (id.toLowerCase() === "settings") return; // Skip settings for now
        const section = allSections.find(div => div.dataset.id === id);
        if (section) {
          orderedSections.push(section);
        }
      });
    }

    // Add any missing sections not in savedOrder
    allSections.forEach(section => {
      const id = section.dataset.id;
      if (
        id &&
        id.toLowerCase() !== "settings" &&
        !orderedSections.includes(section)
      ) {
        orderedSections.push(section);
      }
    });

    // Append ordered sections
    orderedSections.forEach(section => {
      sidebarContent.appendChild(section);
    });

    // Append settings LAST
    if (settingsSection) {
      sidebarContent.appendChild(settingsSection);
    }

    // --- Apply visibility ---
    allSections.forEach(section => {
      const id = section.dataset.id;
      if (!id) return;

      if (id.toLowerCase() === "settings") {
        section.style.display = ""; // Always show settings
      } else {
        const isVisible = savedVisibility[id];
        section.style.display = isVisible === false ? "none" : "";
      }
    });
  }
});
