let commandData = [];

window.addEventListener('load', function() {
    if (typeof XLSX === 'undefined') {
        alert("CRITICAL ERROR: The XLSX library is completely missing or blocked by your browser/network. Try turning off ad-blockers or extensions.");
        return;
    }

    fetch('commands.xlsx')
        .then(res => {
            if (!res.ok) throw new Error("Could not find commands.xlsx file");
            return res.arrayBuffer();
        })
        .then(ab => {
            const wb = XLSX.read(ab, { type: 'array' });
            const firstSheetName = wb.SheetNames; 
            const worksheet = wb.Sheets[firstSheetName];
            
            commandData = XLSX.utils.sheet_to_json(worksheet);
            displayData(commandData);
        })
        .catch(err => console.error("Error loading Excel file:", err));
});

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
