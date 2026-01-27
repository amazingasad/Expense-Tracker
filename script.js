let participants = [];
let expenses = [];

// Screen Navigation
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Initialization
function initNames() {
    const count = document.getElementById('personCount').value;
    if (count < 2) return alert("Please enter at least 2 travelers.");
    
    const container = document.getElementById('nameFields');
    container.innerHTML = '';
    for(let i=1; i<=count; i++) {
        container.innerHTML += `<input type="text" class="name-in" placeholder="Traveler ${i} Name">`;
    }
    switchScreen('step2');
}

function startDashboard() {
    const inputs = document.querySelectorAll('.name-in');
    participants = Array.from(inputs).map((inp, i) => inp.value.trim() || `Member ${i+1}`);
    
    updatePayerDropdown();
    switchScreen('step3');
    saveData();
}

function updatePayerDropdown() {
    const select = document.getElementById('payerSelect');
    select.innerHTML = participants.map(p => `<option value="${p}">${p}</option>`).join('');
}

// Expense Management
function addExpense() {
    const name = document.getElementById('payerSelect').value;
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);

    if(!desc || isNaN(amount) || amount <= 0) return alert("Please enter valid expense details.");

    expenses.push({ 
        id: Date.now(), 
        name, 
        desc, 
        amount, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    });

    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
    
    render();
    saveData();
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    render();
    saveData();
}

function render() {
    const log = document.getElementById('expenseLog');
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const avg = participants.length ? (total / participants.length) : 0;

    document.getElementById('statTotal').innerText = `$${total.toFixed(2)}`;
    document.getElementById('statAvg').innerText = `$${avg.toFixed(2)}`;

    log.innerHTML = expenses.map(e => `
        <div class="expense-item">
            <div>
                <div style="font-weight:700; color:#1e293b">${e.desc}</div>
                <div style="font-size:12px; color:#64748b">${e.name} • ${e.time}</div>
            </div>
            <div style="text-align:right">
                <div style="font-weight:800; color:var(--primary)">$${e.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteExpense(${e.id})">Remove</button>
            </div>
        </div>
    `).reverse().join('');
}

// Logic for Splitting
function toggleSettlements() {
    const section = document.getElementById('settlementSection');
    if(section.style.display === 'block') {
        section.style.display = 'none';
        return;
    }

    const totals = {};
    participants.forEach(p => totals[p] = 0);
    expenses.forEach(e => totals[e.name] += e.amount);
    
    const totalSpent = Object.values(totals).reduce((a,b) => a+b, 0);
    const avg = totalSpent / participants.length;

    let balances = participants.map(p => ({ name: p, bal: totals[p] - avg }));
    let debtors = balances.filter(b => b.bal < -0.01).sort((a,b) => a.bal - b.bal);
    let creditors = balances.filter(b => b.bal > 0.01).sort((a,b) => b.bal - a.bal);
    
    let results = [];
    let d=0, c=0;

    while(d < debtors.length && c < creditors.length) {
        let pay = Math.min(-debtors[d].bal, creditors[c].bal);
        results.push(`<b>${debtors[d].name}</b> pays $${pay.toFixed(2)} to <b>${creditors[c].name}</b>`);
        debtors[d].bal += pay;
        creditors[c].bal -= pay;
        if(Math.abs(debtors[d].bal) < 0.01) d++;
        if(Math.abs(creditors[c].bal) < 0.01) c++;
    }

    section.innerHTML = `<strong>Settlement Plan:</strong><br>${results.join('<br>') || 'Everyone is even!'}`;
    section.style.display = 'block';
}

// Data Persistence
function saveData() {
    localStorage.setItem('tour_split_data', JSON.stringify({participants, expenses}));
}

function resetApp() {
    if(confirm("Are you sure? This will delete all members and expenses.")) {
        localStorage.removeItem('tour_split_data');
        location.reload();
    }
}

// PDF Export
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TourSplit Pro - Financial Report", 14, 20);
    
    const tableData = expenses.map(e => [e.time, e.name, e.desc, `$${e.amount.toFixed(2)}`]);
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

// Load on start
window.onload = () => {
    const saved = localStorage.getItem('tour_split_data');
    if(saved) {
        const data = JSON.parse(saved);
        participants = data.participants;
        expenses = data.expenses;
        updatePayerDropdown();
        render();
        switchScreen('step3');
    }
}