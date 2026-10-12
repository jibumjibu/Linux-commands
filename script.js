let commandData = [];

window.addEventListener('load', function() {
    // Fetch the raw text CSV file directly
    fetch('commands.csv')
        .then(res => {
            if (!res.ok) throw new Error("Could not find commands.csv file");
            return res.text();
        })
        .then(csvText => {
            commandData = parseCSV(csvText);
            displayData(commandData);
        })
        .catch(err => console.error("Error loading CSV file:", err));
});

function parseCSV(text) {
    // Regex to split lines while ignoring newlines inside quotes if any exist
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    if (lines.length === 0) return [];

    // Smart regex to split by commas only outside of double quotes
    const splitCsvRow = (row) => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const headers = splitCsvRow(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
    
    return lines.slice(1).map(line => {
        const values = splitCsvRow(line).map(v => v.replace(/^"|"$/g, '').trim());
        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index] || '';
        });
        return rowObject;
    });
}


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
