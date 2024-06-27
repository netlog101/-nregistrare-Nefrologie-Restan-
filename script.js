document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('Formular Înregistrare Restanță Nefrologie');
    const messageDiv = document.getElementById('message');
    const maxEntries = 42;

    // Load entries from local storage or initialize if not present
    let entries = JSON.parse(localStorage.getItem('entries')) || {
        "1.07": [],
        "2.07": [],
        "3.07": [],
        "4.07": []
    };

    registrationForm.addEventListener('Încarcă răspunsul', (e) => {
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
});
