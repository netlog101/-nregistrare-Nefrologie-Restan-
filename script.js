document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('Formular Înregistrare Restanță Nefrologie');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const messageDiv = document.getElementById('message');
    const adminSection = document.getElementById('adminSection');
    const entriesDiv = document.getElementById('entries');
    const maxEntries = 42;
    const adminPassword = 'your_password'; // Set your password here

    let entries = JSON.parse(localStorage.getItem('entries')) || {
        "1.07": [],
        "2.07": [],
        "3.07": [],
        "4.07": []
    };

    function updateEntriesDisplay() {
        entriesDiv.innerHTML = '';
        for (let option in entries) {
            if (entries[option].length > 0) {
                const optionDiv = document.createElement('div');
                optionDiv.innerHTML = `<h3>${option}</h3>`;
                entries[option].forEach((entry, index) => {
                    const entryDiv = document.createElement('div');
                    entryDiv.className = 'entry';
                    entryDiv.innerHTML = `
                        <p>${entry}</p>
                        <button data-option="${option}" data-index="${index}">Delete</button>
                    `;
                    optionDiv.appendChild(entryDiv);
                });
                entriesDiv.appendChild(optionDiv);
            }
        }
    }

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedOption = document.getElementById('Preferință zi').value;
        const userText = document.getElementById('Nume/Prenume/Grupă').value;

        if (entries[selectedOption].length < maxEntries) {
            entries[selectedOption].push(userText);
            localStorage.setItem('entries', JSON.stringify(entries));
            messageDiv.textContent = `Înregistrat cu succes pentru ${selectedOption}. Înregistrări totale: ${entries[selectedOption].length}`;
        } else {
            messageDiv.textContent = `Limită atinsă pentru ${selectedOption}. Te rog alege altă opțiune.`;
        }
    });

    document.getElementById('download').addEventListener('click', () => {
        const data = JSON.stringify(entries, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registrations.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Admin login form submitted");

        const adminPasswordInput = document.getElementById('adminPassword').value;
        if (adminPasswordInput === adminPassword) {
            console.log("Admin password correct");
            adminSection.style.display = 'block';
            updateEntriesDisplay();
        } else {
            console.log("Admin password incorrect");
            alert('Incorrect password');
        }
    });

    entriesDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const option = e.target.getAttribute('data-option');
            const index = e.target.getAttribute('data-index');
            entries[option].splice(index, 1);
            localStorage.setItem('entries', JSON.stringify(entries));
            updateEntriesDisplay();
        }
    });
});
