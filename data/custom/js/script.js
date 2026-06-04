
  const menu = document.getElementById('menu-customizer');

  const defaultOrder = [
    "start-of-day", "starmicronics", "online-manuals", "led-errors",
    
    "thermal-receipt", "label-printers", "impact-printers",
    "portable-printers", "mltifunctional-system", "kiosk-printers",
    "cups-for-macos", "chromeos", "cash-drawers", 
    "scanners", "accessories", "pos-support", "misc"
  ];

  const defaultVisibility = defaultOrder.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, { settings: true });

  new Sortable(menu, {
    animation: 150,
    filter: ".fixed-item",
    preventOnFilter: false
  });

  function loadOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('menuOrder'));
    const items = Array.from(menu.children);

    (savedOrder || defaultOrder).forEach(id => {
      const item = items.find(li => li.dataset.id === id);
      if (item) menu.appendChild(item);
    });

    const settingsItem = items.find(li => li.dataset.id === 'settings');
    if (settingsItem) menu.appendChild(settingsItem);
  }

  function loadVisibility() {
    const savedVisibility = JSON.parse(localStorage.getItem('menuVisibility')) || defaultVisibility;
    const items = Array.from(document.querySelectorAll('#menu-customizer li'));

    items.forEach(li => {
      const id = li.dataset.id;
      const checkbox = li.querySelector('.menu-toggle');
      if (checkbox) {
        checkbox.checked = savedVisibility[id] !== false;
      }
    });

    const sortedItems = items.sort((a, b) => {
      const aChecked = a.querySelector('.menu-toggle')?.checked ?? true;
      const bChecked = b.querySelector('.menu-toggle')?.checked ?? true;

      if (a.dataset.id === "settings") return 1;
      if (b.dataset.id === "settings") return -1;

      return (bChecked - aChecked);
    });

    sortedItems.forEach(item => menu.appendChild(item));
  }

  function saveVisibility() {
    const visibility = {};
    document.querySelectorAll('#menu-customizer li').forEach(li => {
      const id = li.dataset.id;
      const checkbox = li.querySelector('.menu-toggle');
      visibility[id] = checkbox ? checkbox.checked : true;
    });
    localStorage.setItem('menuVisibility', JSON.stringify(visibility));
  }

  function saveAndReturn() {
    const order = Array.from(menu.children)
      .map(li => li.dataset.id)
      .filter(id => id !== 'settings');

    localStorage.setItem('menuOrder', JSON.stringify(order));
    saveVisibility();

    try {
      window.top.location.reload();
    } catch (e) {
      const message = document.getElementById('save-message');
      if (message) {
        message.style.display = 'block';
        message.textContent = 'Current settings saved. Refresh BookMarks';
      }
      setTimeout(() => {
        if (message) message.style.display = 'none';
      }, 30000);
    }
  }

  function resetMenu() {
    localStorage.removeItem('menuOrder');
    localStorage.removeItem('menuVisibility');
    loadOrder();
    loadVisibility();

    try {
      window.top.location.reload();
    } catch (e) {
      const message = document.getElementById('save-message');
      if (message) {
        message.style.display = 'block';
        message.textContent = 'Menu reset to default. Refresh BookMarks';
      }
      setTimeout(() => {
        if (message) message.style.display = 'none';
      }, 30000);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadOrder();
    loadVisibility();

    document.querySelectorAll('.menu-toggle').forEach(checkbox => {
      checkbox.addEventListener('change', saveVisibility);
    });
  });
