/**************************************************
 * Script.js – Lookup by Serial with Model Links
 **************************************************/

let serialData = [];
let modelData = [];

/**************************************************
 * Menu Configuration
 **************************************************/
const leftMenu = [
    { field: "support", label: "Support" },
    { field: "productp", label: "Product Page" },
    { field: "manual", label: "Manual" },
    { field: "winsetup", label: "Win Setup" },
    { field: "macsetup", label: "Mac Setup" },
    { field: "btwinsetup", label: "BT Win Setup" },
    { field: "btmacsetup", label: "BT Mac Setup" },
    { field: "lwwinsetup", label: "L/W Win Setup" },
    { field: "lwmacsetup", label: "L/W Mac Setup" },
    { field: "usbwinsetup", label: "USB Win Setup" },
    { field: "usbmacsetup", label: "USB Mac Setup" },
    { field: "nowps", label: "No WPS Setup" },
    { field: "wps", label: "WPS Setup" },
    { field: "lederrors", label: "LED Errors" },
    { field: "staticip", label: "Assign Static IP" },
    { field: "autoconnect", label: "Auto Connect ON/OFF" },
    { field: "resetnetwork", label: "Reset Network" },
    { field: "resetbt", label: "Reset BT" },
    { field: "resetbtnetwork", label: "Reset BT & Network" }
];

const rightMenu = [
    { field: "density", label: "Density Adjustment" },
    { field: "firmware", label: "Firmware Update" },
    { field: "cut", label: "Cutter Reset" },
    { field: "opos", label: "OPOS Setup" },
    { field: "holdprint", label: "Enb/Dsbl HoldPrint" },
    { field: "emulation", label: "Change Emulation" },
    { field: "btmode", label: "Change BT Mode" },
    { field: "margins", label: "Browser Margins" },
    { field: "sqsu", label: "Quick Setup Utility" },
    { field: "sdk", label: "StarPRNT SDK" },
    { field: "maintenance", label: "Maintenance" },
    { field: "missingdots", label: "Faded/Missing Dots" },
    { field: "dhcp", label: "Disable DHCP Timeout" },
    { field: "cloudprnt", label: "CloudPRNT Setup" },
    { field: "webprnt", label: "WebPRNT Setup" },
    { field: "cloudprntdemo", label: "CloudPRNT Demo" },
    { field: "wifidongle", label: "Setup WiFi Dongle" },
    { field: "pairios", label: "Pair with iOS" },
    { field: "resetpinwin", label: "Reset PIN on Win" }
];

/**************************************************
 * CSV Loader
 **************************************************/
async function loadCSV() {
    try {

        const serialResp = await fetch('info/serials.csv');
        const serialText = await serialResp.text();
        serialData = parseCSV(serialText);

        const modelResp = await fetch('info/models.csv');
        const modelText = await modelResp.text();
        modelData = parseCSV(modelText);

        console.log(`Loaded ${serialData.length} serials`);
        console.log(`Loaded ${modelData.length} models`);

    } catch (error) {

        console.error(error);

        document.getElementById('result').innerHTML =
            '<div class="not-found">Error loading CSV files.</div>';
    }
}

/**************************************************
 * CSV Parser
 **************************************************/
function parseCSV(text) {

    const rows = text.trim().split('\n');

    const headers = rows[0]
        .split(',')
        .map(h => h.trim());

    return rows.slice(1).map(row => {

        const values = row.split(',');

        let obj = {};

        headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || "";
        });

        return obj;
    });
}

/**************************************************
 * Lookup Function
 **************************************************/
function lookupSerial() {

    const inputBox = document.getElementById('serialInput');
    const serial = inputBox.value.trim();

    if (!serial) return;

    // ALWAYS clear panels first
    clearMenus();

    const foundSerial = serialData.find(
        x => x.SerialNumber === serial
    );

    if (!foundSerial) {

        document.getElementById('result').innerHTML =
            '<div class="not-found">Serial Number Not Found</div>';

        return;
    }

    const foundModel = modelData.find(
        x => x.product === foundSerial.Product
    );

    document.getElementById('result').innerHTML = `
        <div><span class="label">Serial Number:</span> ${foundSerial.SerialNumber}</div>
        <div><span class="label">Product:</span> ${foundSerial.Product}</div>
        <div><span class="label">Product Name:</span> ${foundSerial.ProductName}</div>
    `;

    if (!foundModel) {

        document.getElementById("left-panel").innerHTML =
            "<h2>Resources</h2><div></div>";

        document.getElementById("right-panel").innerHTML =
            "<h2>Quick Links</h2><div></div>";

        return;
    }

    buildMenu("left-panel", foundModel, leftMenu, "Resources");
    buildMenu("right-panel", foundModel, rightMenu, "Quick Links");

    inputBox.focus();
    inputBox.select();
}

/**************************************************
 * Clear Panels
 **************************************************/
function clearMenus() {

    document.getElementById("left-panel").innerHTML =
        "<h2>Resources</h2>";

    document.getElementById("right-panel").innerHTML =
        "<h2>Quick Links</h2>";
}

/**************************************************
 * Build Dynamic Menus
 **************************************************/
function buildMenu(containerId, dataRow, menuFields, title) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `<h2>${title}</h2>`;

    let linkCount = 0;

    menuFields.forEach(item => {

        const url = dataRow[item.field];

        if (!url || url.trim() === "") return;

        const a = document.createElement("a");

        a.href = url;
        a.target = "_blank";
        a.textContent = item.label;
        a.className = "resource-link";

        container.appendChild(a);
        container.appendChild(document.createElement("br"));

        linkCount++;
    });

    if (linkCount === 0) {

        const msg = document.createElement("div");

        msg.className = "no-links";
        msg.textContent = "No resources available";

        container.appendChild(msg);
    }
}

/**************************************************
 * Enter Key Support
 **************************************************/
document.getElementById('serialInput')
    .addEventListener('keydown', function(event) {

        if (event.key === 'Enter') {
            lookupSerial();
        }
    });

/**************************************************
 * Initialize
 **************************************************/
loadCSV();