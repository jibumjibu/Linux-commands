let commandData = [];

// Wait for the entire window and all scripts to be fully loaded
window.addEventListener('load', function() {
    // Check if the library actually loaded
    if (typeof XLSX === 'undefined') {
        console.error("Critical Error: The SheetJS (XLSX) library is still not loaded in the browser. Check your index.html script tags.");
        return;
    }

    fetch('commands.xlsx')
        .then(res => {
            if (!res.ok) throw new Error("Could not find commands.xlsx file");
            return res.arrayBuffer();
        })
        .then(ab => {
            const wb = XLSX.read(ab, { type: 'array' });
            const firstSheetName = wb.SheetNames[0]; // Fixed index safety
            const worksheet = wb.Sheets[firstSheetName];
            
            commandData = XLSX.utils.sheet_to_json(worksheet);
            displayData(commandData);
        })
        .catch(err => console.error("Error loading Excel file:", err));
});


// Function to render rows into the table
function displayData(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.Command || ''}</strong></td>
            <td><code>${row.Syntax || ''}</code></td>
            <td>${row.Keywords || ''}</td>
            <td>${row.Description || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to filter data based on search input
function searchCommands() {
    const searchVal = document.getElementById('search').value.toLowerCase();
    
    const filtered = commandData.filter(row => {
        return (
            (row.Command && row.Command.toLowerCase().includes(searchVal)) ||
            (row.Syntax && row.Syntax.toLowerCase().includes(searchVal)) ||
            (row.Keywords && row.Keywords.toLowerCase().includes(searchVal)) ||
            (row.Description && row.Description.toLowerCase().includes(searchVal))
        );
    });
    
    displayData(filtered);
}
