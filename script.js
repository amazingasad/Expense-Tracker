let participants = [];
let expenses = [];

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        btn.innerText = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        btn.innerText = '☀️';
    }
}

// Original switchScreen Logic
function switchScreen(id) {
    const screens = document.querySelectorAll('.screen');
    for (let i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

// Original initNames Logic
function initNames() {
    const count = document.getElementById('personCount').value;
    if (count < 2) return alert("Please enter at least 2 travelers.");
    switchScreen('step2');
    const container = document.getElementById('nameFields');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" class="name-in" placeholder="Traveler ${i} Name">`;
    }
}

// Original startDashboard Logic
function startDashboard() {
    const inputs = document.querySelectorAll('.name-in');
    participants = [];
    for (let i = 0; i < inputs.length; i++) {
        let currentInput = inputs[i];
        let name = currentInput.value.trim();
        if (name === "") {
            name = "Member " + (i + 1);
        }
        participants.push(name);
    }
    updatePayerDropdown();
    saveData();
    switchScreen('step3');
}

function updatePayerDropdown() {
    const select = document.getElementById('payerSelect');
    select.innerHTML = "";
    for (let i = 0; i < participants.length; i++) {
        let person = participants[i];
        let option = document.createElement("option");
        option.value = person;
        option.innerText = person;
        select.appendChild(option);
    }
}

// Original addExpense Logic
function addExpense() {
    const name = document.getElementById('payerSelect').value;
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    if (!desc || isNaN(amount) || amount <= 0) return alert("Please enter valid expense details.");

    expenses.push({
        id: Date.now(),
        name,
        desc,
        amount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
    render();
    saveData();
}

// Original delete logic style
function deleteExpense(id) {
    let newList = [];
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id !== id) {
            newList.push(expenses[i]);
        }
    }
    expenses = newList;
    render();
    saveData();
}

// Original render logic
function render() {
    const log = document.getElementById('expenseLog');
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    let avg = participants.length > 0 ? total / participants.length : 0;

    document.getElementById('statTotal').innerText = `৳${total.toFixed(2)}`;
    document.getElementById('statAvg').innerText = `৳${avg.toFixed(2)}`;

    let logContent = "";
    for (let i = expenses.length - 1; i >= 0; i--) {
        let e = expenses[i];
        logContent += `
                <div class="expense-item">
                    <div>
                        <div style="font-weight:700;">${e.desc}</div>
                        <div style="font-size:12px; color:var(--muted)">${e.name} • ${e.time}</div>
                    </div>
                    <div style="text-align:right">
                        <div style="font-weight:800; color:var(--primary)">৳${e.amount.toFixed(2)}</div>
                        <button class="delete-btn" onclick="deleteExpense(${e.id})">Remove</button>
                    </div>
                </div>`;
    }
    log.innerHTML = logContent;
}

// Original toggleSettlements logic
function toggleSettlements() {
    const section = document.getElementById('settlementSection');
    if (section.style.display === 'block') {
        section.style.display = 'none';
        return;
    }
    const totals = {};
    for (let i = 0; i < participants.length; i++) { totals[participants[i]] = 0; }
    for (let i = 0; i < expenses.length; i++) { totals[expenses[i].name] += expenses[i].amount; }

    let totalSpent = 0;
    for (let person in totals) { totalSpent += totals[person]; }
    const avg = totalSpent / participants.length;

    let debtors = [];
    let creditors = [];
    for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        const bal = totals[p] - avg;
        if (bal < -0.01) debtors.push({ name: p, bal: bal });
        else if (bal > 0.01) creditors.push({ name: p, bal: bal });
    }

    let resultsText = "<strong>Settlement Plan:</strong><br>";
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
        let pay = Math.min(-debtors[d].bal, creditors[c].bal);
        resultsText += `<b>${debtors[d].name}</b> pays ${pay.toFixed(2)} TK to <b>${creditors[c].name}</b><br>`;
        debtors[d].bal += pay;
        creditors[c].bal -= pay;
        if (Math.abs(debtors[d].bal) < 0.01) d++;
        if (Math.abs(creditors[c].bal) < 0.01) c++;
    }
    if (totalSpent === 0) resultsText += "Everyone is even!";
    section.innerHTML = resultsText;
    section.style.display = 'block';
}

function saveData() {
    localStorage.setItem('tour_split_data', JSON.stringify({ participants, expenses }));
}

function resetApp() {
    if (confirm("Are you sure? This will delete all members and expenses.")) {
        localStorage.removeItem('tour_split_data');
        location.reload();
    }
}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TourSplit Pro - Financial Report", 14, 20);
    
    const tableData = expenses.map(e => [e.time, e.name, e.desc, `TK ${e.amount.toFixed(2)}`]);
    doc.autoTable({
        startY: 30,
        head: [['Time', 'Paid By', 'Description', 'Amount']],
        body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.text("Settlements:", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const settlementText = document.getElementById('settlementSection').innerText;
    doc.text(settlementText || "No settlements calculated.", 14, finalY + 10);
    
    doc.save("TourReport.pdf");
}

window.onload = () => {
    const saved = localStorage.getItem('tour_split_data');
    if (saved) {
        const data = JSON.parse(saved);
        participants = data.participants;
        expenses = data.expenses;
        updatePayerDropdown();
        render();
        switchScreen('step3');
    }
}