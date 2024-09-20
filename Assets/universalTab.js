document.addEventListener('DOMContentLoaded', function () {

    // Function to modify the UniversalTab content with dynamic iframe and settings button
    function modifyUniversalTabContent(iframeUrl = 'https://hartsy.ai') {
        const universalTabContent = document.getElementById('UniversalTab');
        if (!universalTabContent) {
            console.error('Universal tab content container not found');
            return;
        }

        // Replace the content for the UniversalTab with settings button and iframe
        universalTabContent.innerHTML = `
            <div class="card" style="position: relative;">
                <div class="card-body">
                    <div id="settingsPanel" class="settings-panel" style="display:none; position:absolute; top:20px; right:10px; z-index:1000; background-color: inherit; border:1px solid #ccc; padding:10px;">
                        <div>
                            <label for="tabNameInput">Tab Name:</label>
                            <input type="text" id="tabNameInput" class="form-control" placeholder="Enter tab name">
                        </div>
                        <div>
                            <label for="iframeUrlInput">Tab URL:</label>
                            <input type="url" id="iframeUrlInput" class="form-control" placeholder="Enter URL">
                        </div>
                        <button id="saveSettingsButton" class="basic-button translate">Save</button>
                        <button id="addNewTabButton" class="basic-button translate">Add New Tab</button>
                    </div>
                    <button id="settingsToggleButton" class="btn btn-secondary" style="position:absolute; top:10px; right:10px; z-index:1000;">⚙️</button>
                    <iframe id="universalIframe" src="${iframeUrl}" style="height: 100vh; width: 100vw;"></iframe>
                </div>
            </div>
        `;
        document.getElementById('settingsToggleButton').addEventListener('click', toggleSettingsPanel);
        document.getElementById('saveSettingsButton').addEventListener('click', saveSettings);
        document.getElementById('addNewTabButton').addEventListener('click', addNewTab);

        // Enable dragging of the settings panel, but exclude input fields
        makePanelDraggable(document.getElementById('settingsPanel'));
    }

    // Function to toggle the visibility of the settings panel
    function toggleSettingsPanel() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    }

    // Function to open the settings modal and apply changes
    function saveSettings() {
        const tabNameInput = document.getElementById('tabNameInput').value.trim();
        const iframeUrlInput = document.getElementById('iframeUrlInput').value.trim();
        if (!tabNameInput) {
            console.error('Tab name is required');
            return;
        }
        if (!iframeUrlInput || !isValidURL(iframeUrlInput)) {
            console.error('Valid iFrame URL is required');
            return;
        }
        // Set new tab name
        const universalTabButton = document.getElementById('universaltabbutton');
        if (universalTabButton) {
            universalTabButton.textContent = tabNameInput;
        } else {
            console.error('Unable to find UniversalTab button to set new name');
        }
        modifyUniversalTabContent(iframeUrlInput);
        console.log('Tab name and URL updated');
    }

    // Helper function to validate URLs
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Function to check if the Universal tab is available and modify its content
    function checkAndModifyTab() {
        const universalTabButton = document.getElementById('universaltabbutton');
        if (universalTabButton) {
            modifyUniversalTabContent();
        } else {
            console.log('Universal tab not found, retrying in 1 second...');
            setTimeout(checkAndModifyTab, 1000); // Retry after 1 second
        }
    }
    checkAndModifyTab();

    // Function to make the settings panel draggable
    function makePanelDraggable(panel) {
        let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
        let isDragging = false;

        // Disable dragging if clicking on input, textarea, button, or select elements
        panel.addEventListener('mousedown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
                return; // Don't allow dragging when interacting with form fields
            }
            e.preventDefault();
            isDragging = true;
            mouseX = e.clientX;
            mouseY = e.clientY;

            document.onmouseup = stopDraggingPanel;
            document.onmousemove = dragPanel;
        });

        function dragPanel(e) {
            if (!isDragging) return;
            e.preventDefault();
            offsetX = mouseX - e.clientX;
            offsetY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update panel position
            panel.style.top = (panel.offsetTop - offsetY) + "px";
            panel.style.left = (panel.offsetLeft - offsetX) + "px";
        }

        function stopDraggingPanel() {
            isDragging = false;
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
