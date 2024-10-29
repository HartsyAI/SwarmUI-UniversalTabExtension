/**
 * Initializes the application after the DOM is fully loaded.
 * Adds event listeners and prepares the first universal tab.
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Creates the HTML for a new tab button.
     * @param {string} tabId - The unique identifier for the tab.
     * @param {string} tabName - The display name of the tab.
     * @returns {string} HTML string for the tab button.
     */
    function createTabButton(tabId, tabName) {
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
        <div class="tab-pane" id="${tabId}" role="tabpanel" aria-labelledby="${tabId}-button">
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
        // Ensure the Utilities tab content container exists
        const utilitiesTab = document.getElementById('utilities_tab');
        if (!utilitiesTab) {
            console.error('Utilities tab content not found. Unable to add or update tab.');
            return;
        }
        let tabList = utilitiesTab.querySelector('.nav-tabs');
        let tabContentContainer = utilitiesTab.querySelector('.tab-content');
        if (!tabList || !tabContentContainer) {
            console.error('Utilities tab navigation or content container not found. Cannot create new tab.');
            return;
        }
        tabList.insertAdjacentHTML('afterbegin', createTabButton(tabId, tabName));
        // Create the tab content
        const universalTabContent = createTabContent(tabId, tabName, iframeUrl);
        if (tabContentContainer) {
            tabContentContainer.insertAdjacentHTML('beforeend', universalTabContent);
        } else {
            console.error('Tab content container not found.');
        }
        // Add event listeners to the new tab's buttons
        document.getElementById(`settingsToggleButton-${tabId}`).addEventListener('click', () => toggleSettingsPanel(tabId));
        document.getElementById(`saveSettingsButton-${tabId}`).addEventListener('click', () => saveSettings(tabId));
        document.getElementById(`addNewTabButton-${tabId}`).addEventListener('click', () => addNewTab());
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
        const universalTab = document.getElementById(tabId);
        const settingsPanel = universalTab.querySelector(`#settingsPanel-${tabId}`);
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
            if (data.valid && data.iframeSupported) {
                console.log("URL is valid and supports iframes:", data.message, data.iframeMessage);
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
                console.error('URL is invalid or does not support iframes:', data.message, data.error, data.iframeMessage);
            }
        });
    }
    updateOrAddTab('UniversalTab-1', 'UniversalTab', 'https://hartsy.ai');
});