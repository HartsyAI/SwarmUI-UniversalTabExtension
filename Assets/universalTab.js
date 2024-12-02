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
                        <button id="deleteTabButton-${tabId}" class="basic-button btn-danger translate">Delete Tab</button>
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
        document.getElementById(`deleteTabButton-${tabId}`).addEventListener('click', () => removeTab(tabId));
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
     * Saves all tab data to persistent storage
     */
    async function saveTabsToStorage() {
        const tabs = [];
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            const tabId = pane.id;
            const tabButton = document.getElementById(`${tabId}-button`);
            const iframe = document.getElementById(`universalIframe-${tabId}`);
            if (tabButton && iframe) {
                tabs.push({
                    id: tabId,
                    name: tabButton.textContent,
                    url: iframe.src
                });
            }
        });
        await genericRequest('SaveTabs', {
            data: JSON.stringify(tabs)
        });
    }

    /**
     * Loads saved tabs from storage
     */
    async function loadTabsFromStorage() {
        await genericRequest('LoadSavedTabs', {}, response => {
            if (response && response.success && response.data) {
                try {
                    const tabs = JSON.parse(response.data);
                    // Get the utilities tab container
                    const utilitiesTab = document.getElementById('utilities_tab');
                    if (!utilitiesTab) {
                        console.error('Utilities tab content not found. Unable to load tabs.');
                        return;
                    }
                    let tabList = utilitiesTab.querySelector('.nav-tabs');
                    let tabContentContainer = utilitiesTab.querySelector('.tab-content');
                    if (!tabList || !tabContentContainer) {
                        console.error('Utilities tab navigation or content container not found. Cannot load tabs.');
                        return;
                    }
                    // Remove only our universal tabs if they exist
                    const existingUniversalTabs = tabList.querySelectorAll('[id^="UniversalTab-"]');
                    existingUniversalTabs.forEach(tab => tab.remove());
                    const existingUniversalContent = tabContentContainer.querySelectorAll('[id^="UniversalTab-"]');
                    existingUniversalContent.forEach(content => content.remove());
                    // Add saved universal tabs
                    if (tabs && tabs.length > 0) {
                        tabs.forEach(tab => {
                            updateOrAddTab(tab.id, tab.name, tab.url);
                        });
                    } else {
                        // No saved tabs, create default tab
                        updateOrAddTab('UniversalTab-1', 'UniversalTab', 'https://hartsy.ai');
                    }
                } catch (e) {
                    console.error('Error loading saved tabs:', e);
                    // If loading fails, create a default tab
                    updateOrAddTab('UniversalTab-1', 'UniversalTab', 'https://hartsy.ai');
                }
            } else {
                // No saved tabs, create default tab
                updateOrAddTab('UniversalTab-1', 'UniversalTab', 'https://hartsy.ai');
            }
        });
    }

    /**
     * Removes a tab and its content, then updates storage
     * @param {string} tabId - The ID of the tab to remove
     */
    async function removeTab(tabId) {
        const tabButton = document.getElementById(`${tabId}-button`).closest('.nav-item');
        const tabContent = document.getElementById(tabId);
        // If this is the active tab, activate another tab first
        if (tabButton.querySelector('.nav-link.active')) {
            const otherTab = document.querySelector('.nav-link:not(.active)');
            if (otherTab) {
                otherTab.click();
            }
        }
        // Remove the elements
        if (tabButton) tabButton.remove();
        if (tabContent) tabContent.remove();
        // Save the updated tabs
        await saveTabsToStorage();
        // If no tabs left, create a default one
        const remainingTabs = document.querySelectorAll('.tab-pane');
        if (remainingTabs.length === 0) {
            updateOrAddTab('UniversalTab-1', 'UniversalTab', 'https://hartsy.ai');
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
        await genericRequest('CheckValidURL', { url: iframeUrl }, async data => {
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
                // Save the updated tabs
                await saveTabsToStorage();
            } else {
                console.error('URL is invalid or does not support iframes:', data.message, data.error, data.iframeMessage);
            }
        });
    }
    loadTabsFromStorage();
});