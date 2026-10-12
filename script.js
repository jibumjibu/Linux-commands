let commandData = [];

// Load and parse the XLSX file when the page loads
window.onload = function() {
    // Replace 'commands.xlsx' with the actual path to your file in the repo
    fetch('commands.xlsx')
        .then(res => res.arrayBuffer())
        .then(ab => {
            const wb = XLSX.read(ab, { type: 'array' });
            const firstSheetName = wb.SheetNames[0];
            const worksheet = wb.Sheets[firstSheetName];
            
            // Convert sheet data to a JSON array of objects
            commandData = XLSX.utils.sheet_to_json(worksheet);
            displayData(commandData);
        })
        .catch(err => console.error("Error loading Excel file:", err));
};

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
