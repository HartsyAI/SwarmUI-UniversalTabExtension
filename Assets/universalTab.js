document.addEventListener('DOMContentLoaded', function () {
    const maxRetries = 5; // Maximum number of retries
    const retryInterval = 1000; // Retry interval in milliseconds
    let retryCount = 0; // Current retry count
    let hartsyCoreLoaded = false; // Flag for HartsyCore load state

    // Function to check if HartsyCore has been loaded
    function isHartsyCoreLoaded() {
        const hartsyCoreContent = document.getElementById('hartsyCoreContent');
        if (hartsyCoreContent) {
            hartsyCoreLoaded = true;
            return true;
        }
        else {
            console.error('HartsyCore not loaded retrying in 1 second...');
            setTimeout(isHartsyCoreLoaded, 1000);
            return false;
        }
    }

    // Function to create the tab button
    function createTabButton(tabId, tabName) {
        isHartsyCoreLoaded();
        console.log(`Creating tab button with Name: ${tabName} and ID: ${tabId}`);
        return `
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="${tabId}-button" data-bs-toggle="tab" href="#${tabId}" role="tab" aria-controls="${tabId}" aria-selected="false">${tabName}</a>
            </li>
        `;
    }

    // Function to create the tab content
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
                    <div id="tabHeader-${tabId}" class="tab-header" style="font-weight: bold;">${tabName}</div>
                    <iframe id="universalIframe-${tabId}" src="${iframeUrl}" style="height: 100vh; width: 100vw;"></iframe>
                </div>
            </div>
        `;
    }

    // Function to update or add a tab (tab button + content)
    function updateOrAddTab(tabId, tabName = 'New Tab', iframeUrl = 'https://example.com') {
        function tryUpdateOrAddTab() {
            let container = document.getElementById(tabId);
            console.log('updateOrAddTab with ID:', tabId);
            if (!container) {
                // Try to find the tab container and retry if it's not found
                const tabNavContainer = document.getElementById('usertablist');
                if (!tabNavContainer) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        console.log(`TabNav not found, retrying in ${retryInterval / 1000} seconds...`);
                        setTimeout(tryUpdateOrAddTab, retryInterval);
                    } else {
                        console.error('TabNav element not found after maximum retries');
                    }
                    return;
                }
                // Add tab button
                const newTabButton = document.createElement('li');
                newTabButton.innerHTML = createTabButton(tabId, tabName);
                console.log(`Adding tab button ${tabId}`);
                tabNavContainer.appendChild(newTabButton);

                // Add tab content
                container = document.createElement('div');
                document.getElementById('hartsyCoreContent').appendChild(container);
            }

            container.innerHTML = createTabContent(tabId, tabName, iframeUrl);
            document.getElementById(`settingsToggleButton-${tabId}`).addEventListener('click', () => toggleSettingsPanel(tabId));
            document.getElementById(`saveSettingsButton-${tabId}`).addEventListener('click', () => saveSettings(tabId));
            document.getElementById(`addNewTabButton-${tabId}`).addEventListener('click', () => addNewTab());

            // Activate the tab
            const tabButtonElement = document.getElementById(`${tabId}-button`);
            if (!tabButtonElement) {
                console.log(`Tab button with id ${tabId}-button not found`);
                return;
            }
            const tabTrigger = new bootstrap.Tab(tabButtonElement);
            tabTrigger.show();
        }
        tryUpdateOrAddTab(); // Start the retry process
    }

    // Function to add a new tab
    function addNewTab() {
        const newTabId = 'UniversalTab-' + Date.now(); // Generate unique tab ID
        console.log('Creating new tab with ID:', newTabId);
        updateOrAddTab(newTabId, 'New Tab', 'https://hartsy.ai');
    }

    // Toggle the settings panel for each tab
    function toggleSettingsPanel(tabId) {
        const settingsPanel = document.getElementById(`settingsPanel-${tabId}`);
        console.log(`Toggling settings for tab ${tabId}`);
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    }

    // Save settings: tab name and iframe URL
    function saveSettings(tabId) {
        const tabName = document.getElementById(`tabNameInput-${tabId}`).value.trim();
        const iframeUrl = document.getElementById(`iframeUrlInput-${tabId}`).value.trim();
        if (!tabName) {
            console.error('Tab name is required');
            return;
        }
        if (!iframeUrl || !isValidURL(iframeUrl)) {
            console.error('Valid iframe URL is required');
            return;
        }
        // Update the tab name in the button
        const tabButton = document.getElementById(`${tabId}-button`);
        console.log(`Saving settings for tab ${tabId}`);
        if (tabButton) {
            tabButton.textContent = tabName;
        } else {
            console.error('Unable to find tab button to update name');
        }
        // Update the iframe URL
        const iframe = document.getElementById(`universalIframe-${tabId}`);
        if (iframe) {
            iframe.src = iframeUrl;
        }
    }

    // Validate URL format
    function isValidURL(urlString) {
        try {
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Initialize the first UniversalTab on page load
    updateOrAddTab('UniversalTab', 'UniversalTab', 'https://hartsy.ai');

    // Add listener to the "Add New Tab" button (if it exists outside the tabs)
    const addNewTabButton = document.getElementById('addNewTabButton');
    if (addNewTabButton) {
        addNewTabButton.addEventListener('click', addNewTab);
    }
});
