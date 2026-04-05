let participants = [];
let expenses = [];
let destination = "";
let currentStepId = "step0";

function getCurrency() {
  return document.getElementById('currencySelect')?.value || "৳";
}

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

function switchScreen(id) {
    currentStepId = id;
    const screens = document.querySelectorAll('.screen');
    for (let i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active'); 
    }
    document.getElementById(id).classList.add('active');
    const backBtn = document.getElementById('backBtn');
    if (id === 'step1' || id === 'step2' || id === 'step3') {
        backBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
    } 
}

function goBack() {
    if (currentStepId === 'step_welcome') switchScreen('step0');
    else if (currentStepId === 'step1') switchScreen('step_welcome');
    else if (currentStepId === 'step2') switchScreen('step1');
    else if (currentStepId === 'step3') switchScreen('step2');
}

function initNames() {
    const count = document.getElementById('personCount').value;
    if (count < 2) return alert("Enter at least 2 travelers.");
    switchScreen('step2');
    const container = document.getElementById('nameFields');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" class="name-in" placeholder="Traveler ${i} Name">`;
    }
}

function startDashboard() {
    const inputs = document.querySelectorAll('.name-in');
    participants = [];
    for (let i = 0; i < inputs.length; i++) {
        let name = inputs[i].value.trim() || ("Member " + (i + 1));
        participants.push(name);
    }
    destination = document.getElementById('destInput').value.trim() || "My Tour";
    document.getElementById('dashDest').innerText = destination;
    updatePayerDropdown();
    render();
    saveData();
    switchScreen('step3');
}

function updatePayerDropdown() {
    const select = document.getElementById('payerSelect');
    select.innerHTML = "";
    for (let i = 0; i < participants.length; i++) {
        let opt = document.createElement("option");
        opt.value = participants[i];
        opt.innerText = participants[i];
        select.appendChild(opt);//parent er sathe child element(new) jog korbe
    }
}

function addExpense() {
    const name = document.getElementById('payerSelect').value;
    const cat = document.getElementById('categorySelect').value;
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const editId = document.getElementById('editId').value;

    if (!desc || isNaN(amount) || amount <= 0) return alert("Fill all fields correctly.");

    if (editId !== "") {
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id == editId) {
                expenses[i].name = name;
                expenses[i].category = cat;
                expenses[i].desc = desc;
                expenses[i].amount = amount;
            }
        }
        cancelEdit();
    } else {
        expenses.push({
            id: Date.now(),
            name: name,
            category: cat,
            desc: desc,
            amount: amount,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
    render();
    saveData();
}

function editExpense(id) {
    let item = null;
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id == id) item = expenses[i];
    }
    if (!item) return;

    document.getElementById('payerSelect').value = item.name;
    document.getElementById('categorySelect').value = item.category || "Other";
    document.getElementById('descInput').value = item.desc;
    document.getElementById('amountInput').value = item.amount;
    document.getElementById('editId').value = item.id;

    document.getElementById('addBtn').innerText = "Update Expense";
    document.getElementById('cancelEditBtn').style.display = "block";
    document.getElementById('inputCard').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('editId').value = "";
    document.getElementById('descInput').value = "";
    document.getElementById('amountInput').value = "";
    document.getElementById('addBtn').innerText = "Add Expense";
    document.getElementById('cancelEditBtn').style.display = "none";
}

function deleteExpense(id) {
    if (!confirm("Delete this entry?")) return;
    let newList = [];
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id !== id) newList.push(expenses[i]);
    }
    expenses = newList;
    render();
    saveData();
}

function render() {
    const log = document.getElementById('expenseLog');
    let total = 0;
    let catTotals = { Food: 0, Transport: 0, Hotel: 0, Other: 0 };

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
        let c = expenses[i].category || "Other";
        catTotals[c] += expenses[i].amount;
    }

    document.getElementById('statTotal').innerText = `${getCurrency()}${total.toFixed(2)}`;
    document.getElementById('statAvg').innerText = `${getCurrency()}${(participants.length > 0 ? total / participants.length : 0).toFixed(2)}`;

    const cats = ["Food", "Transport", "Hotel", "Other"];
    for (let i = 0; i < cats.length; i++) {
        let cName = cats[i];
        let perc = total > 0 ? (catTotals[cName] / total) * 100 : 0;
        document.getElementById('bar' + cName.substring(0, 5)).style.width = perc + "%";
        document.getElementById('txt' + cName.substring(0, 5)).innerText = Math.round(perc);
    }

    let html = "";
    for (let i = expenses.length - 1; i >= 0; i--) {
        let e = expenses[i];
        html += `
                    <div class="expense-item">
                        <div>
                            <div style="font-weight:700;">${e.desc}</div>
                            <div style="font-size:11px; color:var(--muted)">[${e.category || 'Other'}] ${e.name} • ${e.time}</div>
                            <div style="margin-top:5px;">
                                <button class="edit-btn" onclick="editExpense(${e.id})">Edit</button>
                                <button class="delete-btn" onclick="deleteExpense(${e.id})">Delete</button>
                            </div>
                        </div>
                        <div style="font-weight:800; color:var(--primary)">${getCurrency()}${e.amount.toFixed(2)}</div>
                    </div>`;
    }
    log.innerHTML = html;
}

function toggleSettlements() {
    const section = document.getElementById('settlementSection');
    if (section.style.display === 'block') { section.style.display = 'none'; return; }

    const totals = {};
    for (let i = 0; i < participants.length; i++) totals[participants[i]] = 0;
    for (let i = 0; i < expenses.length; i++) totals[expenses[i].name] += expenses[i].amount;

    let grandTotal = 0;
    for (let p in totals) grandTotal += totals[p];
    const avg = grandTotal / participants.length;

    let debtors = [], creditors = [];
    for (let i = 0; i < participants.length; i++) {
        let bal = totals[participants[i]] - avg;
        if (bal < -0.01) debtors.push({ name: participants[i], bal: bal });
        else if (bal > 0.01) creditors.push({ name: participants[i], bal: bal });
    }

    let text = "<strong>Settlement Plan:</strong><br>";
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
        let pay = Math.min(-debtors[d].bal, creditors[c].bal);
        text += `<b>${debtors[d].name}</b> pays ${pay.toFixed(2)} ${getCurrency()} to <b>${creditors[c].name}</b><br>`;
        debtors[d].bal += pay; creditors[c].bal -= pay;
        if (Math.abs(debtors[d].bal) < 0.01) d++;
        if (Math.abs(creditors[c].bal) < 0.01) c++;
    }
    section.innerHTML = text || "No debts to settle!";
    section.style.display = 'block';
}

function saveData() {
    localStorage.setItem('tour_split_data', JSON.stringify({ participants, expenses, destination }));
}

function resetApp() {
    if (confirm("Reset everything?")) { localStorage.removeItem('tour_split_data'); location.reload(); }
}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const currentSym = getCurrency();
    let safeCurrency = currentSym;
    if (currentSym === "৳") safeCurrency = "BDT";
    else if (currentSym === "₹") safeCurrency = "INR";
    else safeCurrency = currentSym;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`TourSplit Pro - ${destination}`, 14, 20);

    
    const tableData = expenses.map(e => [
        e.time, 
        e.name, 
        e.desc, 
        `${safeCurrency} ${e.amount.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 30,
        head: [['Time', 'Paid By', 'Description', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] }
    });


    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Settlement Summary:", 14, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const settlementDiv = document.getElementById('settlementSection');
    if (settlementDiv.style.display === 'none') toggleSettlements();
    

    let rawText = settlementDiv.innerText;
    let cleanText = rawText.replace(/৳/g, "BDT").replace(/₹/g, "INR");
    
    
    const splitText = doc.splitTextToSize(cleanText, 180);
    doc.text(splitText, 14, finalY + 10);

    doc.save(`${destination}_Report.pdf`);
}

window.onload = () => {
    const saved = localStorage.getItem('tour_split_data');
    if (saved) {
        const data = JSON.parse(saved);
        participants = data.participants;
        expenses = data.expenses;
        destination = data.destination || "Trip";
        document.getElementById('dashDest').innerText = destination;
        updatePayerDropdown();
        render();
        switchScreen('step3');
    } else {
        setTimeout(() => { switchScreen('step_welcome'); }, 2000);
    }
}