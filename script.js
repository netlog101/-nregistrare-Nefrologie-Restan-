// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, orderByChild, equalTo, remove } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBaY09UOzbRhC47atAKM7MSKy2wVrRJl58",
    authDomain: "inregistrare-nefro.firebaseapp.com",
    databaseURL: "https://inregistrare-nefro-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "inregistrare-nefro",
    storageBucket: "inregistrare-nefro.appspot.com",
    messagingSenderId: "946617723576",
    appId: "1:946617723576:web:f0f1ca4f0ee11cba15e24d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const messageDiv = document.getElementById('message');
    const adminSection = document.getElementById('adminSection');
    const entriesDiv = document.getElementById('entries');
    const maxEntries = 42;
    const adminPassword = 'vdTyS9$Z:2Fa!Q-*(z;.f{'; // Set your admin password here

    // Fetch existing entries from Firebase
    function fetchEntries() {
        console.log('Fetching entries...'); // Debugging log
        const entriesRef = ref(database, 'entries');
        onValue(entriesRef, (snapshot) => {
            const data = snapshot.val();
            const entries = data ? Object.values(data) : [];
            console.log('Entries fetched:', entries); // Debugging log
            updateEntriesDisplay(entries);
        });
    }

    // Update entries display
    function updateEntriesDisplay(entries) {
        console.log('Updating entries display...'); // Debugging log
        entriesDiv.innerHTML = '';
        entries.forEach((entry) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
                <p>${entry.option}: ${entry.text}</p>
                <button data-key="${entry.key}">Delete</button>
            `;
            entriesDiv.appendChild(entryDiv);
        });
    }

    // Form submission handler
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedOption = document.getElementById('Preferință zi').value;
        const userText = document.getElementById('Nume/Prenume/Grupă').value;
        console.log('Form submitted with:', selectedOption, userText); // Debugging log

        // Check if the limit is reached for the selected option
        const entriesRef = ref(database, 'entries');
        const query = orderByChild(entriesRef, 'option').equalTo(selectedOption);
        onValue(query, (snapshot) => {
            const data = snapshot.val();
            const optionEntriesCount = data ? Object.keys(data).length : 0;
            console.log('Entries for selected option:', optionEntriesCount); // Debugging log

            if (optionEntriesCount < maxEntries) {
                const newEntryKey = push(entriesRef).key;
                set(ref(database, 'entries/' + newEntryKey), {
                    key: newEntryKey,
                    option: selectedOption,
                    text: userText
                });
                messageDiv.textContent = `Înregistrat cu succes pentru ${selectedOption}. Înregistrări totale: ${optionEntriesCount + 1}`;
            } else {
                messageDiv.textContent = `Limită atinsă pentru ${selectedOption}. Te rog alege altă opțiune.`;
            }
        }, { onlyOnce: true });
    });

    // Download current entries
    document.getElementById('download').addEventListener('click', () => {
        console.log('Download button clicked'); // Debugging log

        const entriesRef = ref(database, 'entries');
        onValue(entriesRef, (snapshot) => {
            const data = snapshot.val();
            const entries = data ? Object.values(data) : [];
            console.log('Entries to download:', entries); // Debugging log

            if (entries.length > 0) {
                const jsonEntries = JSON.stringify(entries, null, 2);
                const blob = new Blob([jsonEntries], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'registrations.json';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                console.log('No entries to download'); // Debugging log
                alert('No entries to download');
            }
        }, { onlyOnce: true });
    });

    // Admin login handler
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const adminPasswordInput = document.getElementById('adminPassword').value;
        console.log('Admin form submitted'); // Debugging log
        console.log('Password entered:', adminPasswordInput); // Debugging log

        if (adminPasswordInput === adminPassword) {
            console.log('Admin login successful'); // Debugging log
            adminSection.style.display = 'block';
            fetchEntries();
        } else {
            console.log('Incorrect password'); // Debugging log
            alert('Incorrect password');
        }
    });

    // Delete entry handler
    entriesDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const entryKey = e.target.getAttribute('data-key');
            console.log('Deleting entry with key:', entryKey); // Debugging log
            remove(ref(database, 'entries/' + entryKey));
        }
    });
});
