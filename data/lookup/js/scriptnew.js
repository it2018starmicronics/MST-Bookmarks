/**************************************************
 * Script.js – Lookup by Serial with Model Links
 **************************************************/

let serialData = [];
let modelData = [];

/**************************************************
 * Menu Configuration – 4 Columns
 **************************************************/
const setupMenu = [
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
    { field: "wps", label: "WPS Setup" }
];

const networkMenu = [
    { field: "staticip", label: "Assign Static IP" },
    { field: "autoconnect", label: "Auto Connect ON/OFF" },
    { field: "resetnetwork", label: "Reset Network" },
    { field: "resetbt", label: "Reset BT" },
    { field: "resetbtnetwork", label: "Reset BT & Network" },
    { field: "btmode", label: "Change BT Mode" },
    { field: "cloudprnt", label: "CloudPRNT Setup" },
    { field: "webprnt", label: "WebPRNT Setup" },
    { field: "cloudprntdemo", label: "CloudPRNT Demo" },
    { field: "wifidongle", label: "Setup WiFi Dongle" },
    { field: "pairios", label: "Pair with iOS" }
];

const maintenanceMenu = [
    { field: "density", label: "Density Adjustment" },
    { field: "firmware", label: "Firmware Update" },
    { field: "cut", label: "Cutter Reset" },
    { field: "opos", label: "OPOS Setup" },
    { field: "holdprint", label: "Enb/Dsbl HoldPrint" },
    { field: "emulation", label: "Change Emulation" },
    { field: "sdk", label: "StarPRNT SDK" },
    { field: "maintenance", label: "Maintenance" },
    { field: "missingdots", label: "Faded/Missing Dots" },
    { field: "dhcp", label: "Disable DHCP Timeout" },
    { field: "resetpinwin", label: "Reset PIN on Win" }
];

const advancedMenu = [
    { field: "lederrors", label: "LED Errors" },
    { field: "margins", label: "Browser Margins" }
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
    const headers = rows[0].split(',').map(h => h.trim());

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

    // Hide previous results and panels
    document.getElementById("result").style.display = "none";
    document.querySelector(".page-layout").style.display = "none";

    const foundSerial = serialData.find(x => x.SerialNumber === serial);

    if (!foundSerial) {
        document.getElementById('result').innerHTML =
            '<div class="not-found">Serial Number Not Found</div>';
        document.getElementById("result").style.display = "block";
        return;
    }

    const foundModel = modelData.find(x => x.product === foundSerial.Product);

    document.getElementById('result').innerHTML = `
        <div><span class="label">Serial Number:</span> ${foundSerial.SerialNumber}</div>
        <div><span class="label">Product:</span> ${foundSerial.Product}</div>
        <div><span class="label">Product Name:</span> ${foundSerial.ProductName}</div>
    `;
    document.getElementById("result").style.display = "block";

    if (!foundModel) return;

    // Build the 4-column resource menus
    buildMenu("setup-resources", foundModel, setupMenu);
    buildMenu("network-resources", foundModel, networkMenu);
    buildMenu("maintenance-resources", foundModel, maintenanceMenu);
    buildMenu("advanced-resources", foundModel, advancedMenu);

    // Show the 4 columns now
    document.querySelector(".page-layout").style.display = "grid";

    // Focus and select input for next search
    inputBox.focus();
    inputBox.select();
}

/**************************************************
 * Build Dynamic Menus for a Column
 **************************************************/
function buildMenu(containerId, dataRow, menuFields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // clear previous links
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