/**
 * Initializes the application after the DOM is fully loaded.
 * Adds event listeners and prepares the first universal tab.
 */
document.addEventListener('DOMContentLoaded', function () {
    const maxRetries = 5; // Maximum number of retries
    const retryInterval = 1000; // Retry interval in milliseconds
    let retryCount = 0; // Current retry count
    let hartsyCoreLoaded = false; // Flag for HartsyCore load state

    /**
     * Checks if HartsyCore has been loaded by searching for the hartsyCoreContent element.
     * Retries until `maxRetries` is reached.
     * @returns {boolean} True if HartsyCore is loaded, otherwise retries.
     */
    function isHartsyCoreLoaded() {
        const hartsyCoreContent = document.getElementById('hartsyCoreContent');
        if (hartsyCoreContent) {
            console.log('HartsyCore loaded successfully.');
            hartsyCoreLoaded = true;
            return true;
        }
        if (retryCount >= maxRetries) {
            console.error('HartsyCore failed to load after maximum retries.');
            return false;
        }
        retryCount++;
        console.warn(`HartsyCore not loaded. Retrying ${retryCount}/${maxRetries} in ${retryInterval / 1000} seconds...`);
        setTimeout(isHartsyCoreLoaded, retryInterval);
        return false;
    }

    /**
     * Creates the HTML for a new tab button.
     * @param {string} tabId - The unique identifier for the tab.
     * @param {string} tabName - The display name of the tab.
     * @returns {string} HTML string for the tab button.
     */
    function createTabButton(tabId, tabName) {
        isHartsyCoreLoaded();
        console.log(`Creating tab button with Name: ${tabName} and ID: ${tabId}`);
        return `
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="${tabId}-button" data-bs-toggle="tab" href="#${tabId}" role="tab" aria-controls="${tabId}" aria-selected="false">${tabName}</a>
            </li>
        `;
    }

    /**
     * Creates the HTML for a new tab content section with an iframe.
     * @param {string} tabId - The unique identifier for the tab.
     * @param {string} tabName - The display name of the tab.
     * @param {string} [iframeUrl='https://hartsy.ai'] - The URL to be displayed in the iframe.
     * @returns {string} HTML string for the tab content.
     */
    function createTabContent(tabId, tabName = 'New Tab', iframeUrl = 'https://hartsy.ai') {
        return `
            <div class="card" style="position: relative;" id="${tabId}">
                <div class="card-body">
                    <div id="settingsPanel-${tabId}" class="settings-panel" style="display:none; position:absolute; top:20px; right:10px; z-index:1000; background-color: inherit; border:1px solid #ccc; padding:10px;">
                        <div>
                            <label for="tabNameInput-${tabId}">Tab Name:</label>
                            <input type="text" id="tabNameInput-${tabId}" class="form-control" value="${tabName}" placeholder="Enter tab name">
                        </div>
                        <div>
                            <label for="iframeUrlInput-${tabId}">Tab URL:</label>
                            <input type="url" id="iframeUrlInput-${tabId}" class="form-control" value="${iframeUrl}" placeholder="Enter URL">
                        </div>
                        <button id="saveSettingsButton-${tabId}" class="basic-button translate">Save</button>
                        <button id="addNewTabButton-${tabId}" class="basic-button translate">Add New Tab</button>
                    </div>
                    <button id="settingsToggleButton-${tabId}" class="btn btn-secondary" style="position:absolute; top:10px; right:10px; z-index:1000;">⚙️</button>
                    <iframe id="universalIframe-${tabId}" src="${iframeUrl}" style="height: 100vh; width: 100vw;"></iframe>
                </div>
            </div>
        `;
    }

    /**
    * Updates an existing tab or adds a new one if it doesn't exist.
    * @param {string} tabId - The unique identifier for the tab.
    * @param {string} [tabName='New Tab'] - The display name of the tab.
    * @param {string} [iframeUrl='https://example.com'] - The URL to be displayed in the iframe.
    */
    function updateOrAddTab(tabId, tabName = 'New Tab', iframeUrl = 'https://example.com') {
        // Ensure the HartsyCore content container exists
        const hartsyCoreContent = document.getElementById('hartsyCoreContent');
        if (!hartsyCoreContent) {
            console.error('HartsyCore content not found. Unable to add or update tab.');
            return;
        }

        // Check if the tab content already exists, if not, create a new one
        let container = document.getElementById(tabId);
        if (!container) {
            // Create new tab button and append it to the tab navigation
            const tabNavContainer = document.getElementById('usertablist');
            if (!tabNavContainer) {
                console.error('Tab navigation container not found. Cannot create new tab.');
                return;
            }
            const newTabButton = document.createElement('li');
            newTabButton.innerHTML = createTabButton(tabId, tabName);
            tabNavContainer.appendChild(newTabButton);

            // Create a new tab content container
            container = document.createElement('div');
            container.classList.add('tab-pane', 'fade'); // Ensure Bootstrap tab classes are added
            container.id = tabId; // Use the unique tabId for the container ID
            hartsyCoreContent.appendChild(container);
        }

        // Update the tab content
        container.innerHTML = createTabContent(tabId, tabName, iframeUrl);

        // Add event listeners to the new tab's buttons
        document.getElementById(`settingsToggleButton-${tabId}`).addEventListener('click', () => toggleSettingsPanel(tabId));
        document.getElementById(`saveSettingsButton-${tabId}`).addEventListener('click', () => saveSettings(tabId));
        document.getElementById(`addNewTabButton-${tabId}`).addEventListener('click', () => addNewTab());

        // Activate the new tab
        const tabButtonElement = document.getElementById(`${tabId}-button`);
        if (tabButtonElement) {
            const tabTrigger = new bootstrap.Tab(tabButtonElement);
            tabTrigger.show();
        } else {
            console.error(`Tab button with ID ${tabId}-button not found.`);
        }
    }

    /**
     * Creates and adds a new tab to the interface.
     * Generates a unique ID for each new tab.
     */
    function addNewTab() {
        const newTabId = 'UniversalTab-' + Date.now(); // Generate unique tab ID
        console.log('Creating new tab with ID:', newTabId);
        updateOrAddTab(newTabId, 'New Tab', 'https://hartsy.ai');
    }

    /**
     * Toggles the visibility of the settings panel for a given tab.
     * @param {string} tabId - The unique identifier for the tab.
     */
    function toggleSettingsPanel(tabId) {
        const settingsPanel = document.getElementById(`settingsPanel-${tabId}`);
        console.log(`Toggling settings for tab ${tabId}`);
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    }

    /**
     * Saves the settings for a given tab.
     * Updates the tab name and iframe URL based on user input.
     *
     * @param {string} tabId - The unique identifier for the tab.
     */
    async function saveSettings(tabId) {
        const tabName = document.getElementById(`tabNameInput-${tabId}`).value.trim();
        const iframeUrl = document.getElementById(`iframeUrlInput-${tabId}`).value.trim();
        if (!tabName) {
            console.error('Tab name is required');
            return;
        }
        await genericRequest('CheckValidURL', { url: iframeUrl }, data => {
            // Check the result of the URL validation within the callback
            if (data.valid) {
                console.log("URL is valid:", data.message);
                // Update the tab name in the button
                const tabButton = document.getElementById(`${tabId}-button`);
                console.log(`Saving settings for tab ${tabId}`);
                if (tabButton) {
                    tabButton.textContent = tabName;
                } else {
                    console.error(`Element with ID ${tabId}-button not found before the request`);
                }
                // Update the iframe URL
                const iframe = document.getElementById(`universalIframe-${tabId}`);
                if (iframe) {
                    iframe.src = iframeUrl;
                }
            } else {
                console.error('URL is invalid:', data.message, data.error);
            }
            if (!iframeUrl || !data.valid) {
                console.error('Valid iframe URL is required');
                return;
            }
        });
    }
    // Check if HartsyCore is loaded before proceeding
    isHartsyCoreLoaded();
    // Initialize the first UniversalTab on page load
    updateOrAddTab('UniversalTab', 'UniversalTab', 'https://hartsy.ai');
    // Add listener to the "Add New Tab" button
    const addNewTabButton = document.getElementById('addNewTabButton');
    if (addNewTabButton) {
        addNewTabButton.addEventListener('click', addNewTab);
    }
});
