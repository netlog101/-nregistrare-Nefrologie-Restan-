import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBaY09UOzbRhC47atAKM7MSKy2wVrRJl58",
    authDomain: "inregistrare-nefro.firebaseapp.com",
    databaseURL: "https://inregistrare-nefro-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "inregistrare-nefro",
    storageBucket: "inregistrare-nefro.appspot.com",
    messagingSenderId: "946617723576",
    appId: "1:946617723576:web:f0f1ca4f0ee11cba15e24d"
}

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('Formular Înregistrare Restanță Nefrologie');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const messageDiv = document.getElementById('message');
    const adminSection = document.getElementById('adminSection');
    const entriesDiv = document.getElementById('entries');
    const maxEntries = 42;
    const adminPassword = 'vdTyS9$Z:2Fa!Q-*(z;.f{'; // Set your password here

// Fetch existing entries from Firebase
function fetchEntries() {
    firebase.database().ref('entries').on('value', (snapshot) => {
        const data = snapshot.val();
        const entries = data ? Object.values(data) : [];
        updateEntriesDisplay(entries);
    });
}

// Update entries display
function updateEntriesDisplay(entries) {
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

    // Check if the limit is reached for the selected option
    firebase.database().ref('entries').orderByChild('option').equalTo(selectedOption).once('value', (snapshot) => {
        const data = snapshot.val();
        const optionEntriesCount = data ? Object.keys(data).length : 0;

        if (optionEntriesCount < maxEntries) {
            const newEntryKey = firebase.database().ref().child('entries').push().key;
            firebase.database().ref('entries/' + newEntryKey).set({
                key: newEntryKey,
                option: selectedOption,
                text: userText
            });
            messageDiv.textContent = `Înregistrat cu succes pentru ${selectedOption}. Înregistrări totale: ${optionEntriesCount + 1}`;
        } else {
            messageDiv.textContent = `Limită atinsă pentru ${selectedOption}. Te rog alege altă opțiune.`;
        }
    });
});

// Download current entries
document.getElementById('download').addEventListener('click', () => {
    console.log('Download button clicked'); // Debugging log

    firebase.database().ref('entries').once('value', (snapshot) => {
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
    });
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
        firebase.database().ref('entries/' + entryKey).remove();
    }
});
