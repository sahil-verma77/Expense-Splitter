const BADGE_COLORS = ['#2F6B4F', '#3D5A80', '#8C5E58', '#6A7B76'];
const MEMBERS_LOCALSTORAGE_KEY = "members";
const EXPENSES_LOCALSTORAGE_KEY = "expenses";

function getElementById(id) {
    return document.getElementById(id);
}

// Header
const clearAllDefault = getElementById("clear-all-default");
const clearAllBtn = getElementById("clear-all-btn");
const clearAllConfirm = getElementById("clear-all-confirm");
const confirmClearBtn = getElementById("confirm-clear-btn");
const cancelClearBtn = getElementById("cancel-clear-btn");

// Section: Group Members
const membersCount = getElementById("members-count");
const addMemberForm = getElementById("add-member-form");
const memberNameInput = getElementById("member-name-input");
const addMemberBtn = getElementById("add-member-btn");
const memberErrorMsg = getElementById("member-error-msg");
const membersList = getElementById("members-list");
const membersEmpty = getElementById("members-empty");

// Section: Add Expense
const addExpenseContent = getElementById("add-expense-content");
const expenseMembersWarning = getElementById("expense-members-warning");
const addExpenseForm = getElementById("add-expense-form");
const expenseTitleInput = getElementById("expense-title-input");
const expenseAmountInput = getElementById("expense-amount-input");
const expensePayerSelect = getElementById("expense-payer-select");
const splitSelectAllBtn = getElementById("split-select-all-btn");
const splitClearAllBtn = getElementById("split-clear-all-btn");
const splitMembersContainer = getElementById("split-members-container");
const splitMemberCheckbox = document.querySelectorAll(".split-member-checkbox");
const addExpenseBtn = getElementById("add-expense-btn");
const expenseValidationHint = getElementById("expense-validation-hint");

// Section: Expenses
const expensesCount = getElementById("expenses-count");
const expensesContent = getElementById("expenses-content");
const expensesListWrapper = getElementById("expenses-list-wrapper");
const expensesList = getElementById("expenses-list");
const expensesEmpty = getElementById("expenses-empty");

// Section: Balances
const balancesContent = getElementById("balances-content");
const balancesListWrapper = getElementById("balances-list-wrapper");
const balancesList = getElementById("balances-list");
const balancesEmpty = getElementById("balances-empty");
const balancesHelperText = getElementById("balances-helper-text");

let allMembers = getItems(MEMBERS_LOCALSTORAGE_KEY); // Getting members from localStorage
let expenses = getItems(EXPENSES_LOCALSTORAGE_KEY); // Getting members from localStorage

function getItems(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}
function setItems(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
}
function getRandomFetchColor() {
    let randomIndex = Math.floor(Math.random() * BADGE_COLORS.length);
    return BADGE_COLORS[randomIndex];
}

addMemberForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = memberNameInput.value.trim(); // Input Value
    memberErrorMsg.classList.add("hidden");
    if (!value) {
        memberErrorMsg.classList.remove("hidden");
        memberErrorMsg.textContent = "Please enter a name.";
        return;
    }

    const isMemberAlreadyExist = allMembers.some(({ name }) => name.toLowerCase() === value.toLowerCase());
    if (isMemberAlreadyExist) {
        memberErrorMsg.classList.remove("hidden");
        memberErrorMsg.textContent = "A member with this name already exist.";
        return;
    }

    allMembers = [...allMembers, { name: value, id: `mem_${Date.now()}` }];
    setItems(MEMBERS_LOCALSTORAGE_KEY, allMembers); // Setting members to localStorage

    memberNameInput.value = "";
    renderAll();
})

function renderMembers() {
    membersList.innerHTML = "";
    expenseMembersWarning.classList.remove("hidden");
    addExpenseForm.classList.add("hidden");

    membersCount.textContent = `${allMembers.length} ${allMembers.length === 1 ? "member" : "members"}`;

    expensePayerSelect.innerHTML = "";
    splitMembersContainer.innerHTML = "";
    if (!allMembers.length) { // Empty Message
        membersEmpty.classList.remove("hidden");
        membersList.classList.add("hidden");
        return;
    }
    membersEmpty.classList.add("hidden");
    membersList.classList.remove("hidden");

    allMembers.forEach(({ name, id }) => { // Adding Members in the list
        let li = document.createElement("li");
        li.className = "flex items-center justify-between py-2.5 px-1 hover:bg-slate-100/50 transition-colors gap-2";
        li.innerHTML = `
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <span
                    class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium text-white shrink-0 select-none"
                    style="background-color: #2F6B4F;">
                    ${name[0].toUpperCase()}
                </span>
                <span class="font-sans text-sm font-medium text-ledger-ink truncate break-words">${name}</span>
            </div>
            <button type="button"
                class="remove-member-btn text-ledger-muted hover:text-ledger-rust p-2 rounded-sm transition-colors cursor-pointer shrink-0 ml-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                data-id=${id} title="Remove ram" aria-label="Remove ram">
                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>`;
        membersList.append(li);
    });
    membersList.addEventListener("click", (e) => {
        e.stopPropagation();
        const removeBtn = e.target.closest(".remove-member-btn"); // Finding Remove Button
        if (removeBtn) {
            memberErrorMsg.classList.add("hidden");
            const id = removeBtn.dataset.id;
            const isExpRecordExist = expenses.some((exp) => {
                if (exp.payer === id || exp.splitMember.includes(id)) {
                    return exp;
                }
            })
            if (isExpRecordExist) {
                memberErrorMsg.classList.remove("hidden");
                memberErrorMsg.textContent = "Cannot remove member included in record expenses. Remove their expenses first.";
                return;
            }

            allMembers = allMembers.filter(({ id: memId }) => memId !== id);
            setItems(MEMBERS_LOCALSTORAGE_KEY, allMembers);
            renderAll();
        }
    })

    expensePayerSelect.innerHTML = "";
    splitMembersContainer.innerHTML = "";

    if (allMembers.length < 2) { // Empty Message
        expenseMembersWarning.classList.remove("hidden");
        addExpenseForm.classList.add("hidden");
        addExpenseFormReset();
    } else {
        expenseMembersWarning.classList.add("hidden");
        addExpenseForm.classList.remove("hidden");

        allMembers.forEach(({ name, id }) => {
            let option = document.createElement("option");
            option.textContent = name;
            option.value = id;
            expensePayerSelect.append(option);

            let label = document.createElement("label");
            label.className = "flex items-center gap-2.5 text-xs font-sans text-ledger-ink cursor-pointer hover:bg-slate-100/60 px-2 py-2 rounded-sm select-none border border-transparent hover:border-ledger-border transition-colors min-h-[36px]";
            label.innerHTML = `
                <input type="checkbox" value="${id}"
                    class="split-member-checkbox rounded-sm text-ledger-forest accent-[#2F6B4F] cursor-pointer w-4 h-4 shrink-0"
                    checked>
                <span class="truncate break-all min-w-0">${name}</span>`;
            splitMembersContainer.append(label);
        })
    }
    validateAddExpenseForm();
    renderBalance();
}

let isValid = false;

function validateAddExpenseForm() {
    const title = expenseTitleInput.value.trim();

    const amount = parseFloat(expenseAmountInput.value);
    const isValidAmount = amount > 0;

    const payer = expensePayerSelect.value;

    const selectedCount = splitMembersContainer.querySelectorAll("input:checked").length;
    const isValidSelectedCount = selectedCount > 0;

    isValid = title && isValidAmount && isValidSelectedCount && payer;
    addExpenseBtn.disabled = !isValid;

    if (!title) {
        expenseValidationHint.textContent = "Enter expense title.";
    } else if (!isValidAmount) {
        expenseValidationHint.textContent = "Enter a valid amount.";
    } else if (!payer) {
        expenseValidationHint.textContent = "Please select payer.";
    } else if (selectedCount < 1) {
        expenseValidationHint.textContent = "Select atleast 1 person to split.";
    } else if (selectedCount > 1) {
        expenseValidationHint.textContent = `Splitting between ${selectedCount} people.`;
    } else if (selectedCount == 1) {
        expenseValidationHint.textContent = `Splitting between 1 person.`;
    } else if (!payer) {
        expenseValidationHint.textContent = `Please select payer.`;
    }
}

[expenseTitleInput, expenseAmountInput].forEach((ele) => {
    ele.addEventListener("input", validateAddExpenseForm);
})

splitMembersContainer.addEventListener("change", validateAddExpenseForm);
expensePayerSelect.addEventListener("change", validateAddExpenseForm);

function splitCheckboxToggle(checkedFlag) {
    const checkedInputs = splitMembersContainer.querySelectorAll("input");
    checkedInputs.forEach((e) => e.checked = checkedFlag);
    validateAddExpenseForm();
}
splitSelectAllBtn.addEventListener("click", () => splitCheckboxToggle(true));
splitClearAllBtn.addEventListener("click", () => splitCheckboxToggle(false));

addExpenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!isValid) {
        return;
    }
    const title = expenseTitleInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const payer = expensePayerSelect.value;

    // const splitMember = [];
    // splitMembersContainer.querySelectorAll("input:checked").forEach(e => {
    //     splitMember.push(e.value);
    // });
    let splitMember = Array.from(splitMembersContainer.querySelectorAll("input:checked")).map(e => e.value);

    expenses.push({ id: `exp_${Date.now()}`, title, amount: amount.toFixed(2), payer, splitMember });

    setItems(EXPENSES_LOCALSTORAGE_KEY, expenses);
    addExpenseFormReset();
    renderAll();
})

function addExpenseFormReset() {
    expenseTitleInput.value = "";
    expenseAmountInput.value = "";
    expensePayerSelect.value = "";
    validateAddExpenseForm();
}

function getNameById(id) {
    const result = allMembers.find((mem) => mem.id === id);
    return result?.name || "Anonymous";
}

function renderExpenses() {
    expensesList.innerHTML = "";
    const totalExpense = expenses.length;
    expensesCount.textContent = `${totalExpense} ${totalExpense === 1 ? "expense" : "expenses"}`;
    if (!totalExpense) {
        expensesEmpty.classList.remove("hidden");
        expensesList.classList.add("hidden");
        return;
    }
    expensesEmpty.classList.add("hidden");
    expensesList.classList.remove("hidden");

    expenses.map(({ id, title, amount, payer, splitMember }) => {
        const li = document.createElement("li");
        const splitMemberNames = splitMember.map((mem) => getNameById(mem)).join(", ");
        li.className = "py-3 px-1 hover:bg-slate-100/50 transition-colors";
        li.innerHTML = `
            <div class="flex items-start justify-between gap-3 sm:gap-4">
                <div class="min-w-0 flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                        <h3 class="font-sans text-sm sm:text-base font-semibold text-ledger-ink break-words min-w-0">
                            ${title}
                        </h3>
                        <div class="flex items-baseline gap-2 shrink-0 self-start sm:self-auto">
                            <span class="font-mono text-sm sm:text-base font-semibold text-ledger-ink">
                            ₹${amount}
                            </span>
                            <span class="font-mono text-xs text-ledger-muted">
                            (₹${(amount / splitMember.length).toFixed(2)} / person)
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-ledger-muted font-sans">
                        <span>Paid by <strong class="font-medium text-ledger-ink">${getNameById(payer)}</strong></span>
                        <span class="text-ledger-border">•</span>
                        <span>Split between: <span class="text-ledger-ink font-medium break-words">${splitMemberNames}</span></span>
                    </div>
                </div>
                <button type="button"
                    class="delete-expense-btn text-ledger-muted hover:text-ledger-rust p-2 rounded-sm transition-colors cursor-pointer shrink-0 ml-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    data-id=${id} title="Delete Groceries" aria-label="Delete Groceries">
                    <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="1.75"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>`;
        expensesList.append(li);
    });

    expensesList.addEventListener("click", (e) => {
        e.stopPropagation();
        const dltExpBtn = e.target.closest(".delete-expense-btn");
        if (dltExpBtn) {
            const id = dltExpBtn.dataset.id;
            expenses = expenses.filter(({ id: expId }) => expId !== id);
            setItems(EXPENSES_LOCALSTORAGE_KEY, expenses);
            renderAll();
        }
    })
}

function renderBalance() {
    balancesList.innerHTML = "";
    if (!allMembers.length) {
        balancesList.classList.add("hidden");
        balancesHelperText.classList.add("hidden");
        balancesEmpty.classList.remove("hidden");
        return;
    }
    balancesList.classList.remove("hidden");
    balancesHelperText.classList.remove("hidden");
    balancesEmpty.classList.add("hidden");

    allMembers.map(({ name, id }) => {
        let paid = 0;
        let owed = 0;

        expenses.forEach(({ amount, splitMember, payer }) => {
            const expAmount = Number(amount);
            if (payer === id) {
                paid += expAmount;
            }
            if (splitMember.includes(id) && splitMember.length > 0) {
                owed += expAmount / splitMember.length;
            }
        })
        let net = (paid - owed).toFixed(2);
        let statusElement = `<span class="text-ledger-muted">settled up</span>`;

        if (net > 0) {
            statusElement = `<span class="text-ledger-forest font-medium">gets back ₹${Math.abs(net)}</span>`;
        } else if (net < 0) {
            statusElement = `<span class="text-ledger-rust font-medium">owes ₹${Math.abs(net)}</span>`;
        }

        const li = document.createElement("li");
        li.className = "flex items-center justify-between py-2.5 px-1 hover:bg-slate-100/50 transition-colors gap-3";
        li.innerHTML = `
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <span
                    class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium text-white shrink-0 select-none"
                    style="background-color: #8C5E58;">
                    ${name[0].toUpperCase()}
                </span>
                <span class="font-sans text-sm font-medium text-ledger-ink truncate break-words">${name}</span>
            </div>
            <div class="font-mono text-sm shrink-0 ml-2 text-right">
                ${statusElement}
            </div>`;
        balancesList.append(li);
    })
}

clearAllBtn.addEventListener("click", (e) => {
    clearAllConfirm.classList.remove("hidden");
    clearAllConfirm.classList.add("flex");
    clearAllBtn.classList.add("hidden");
})
confirmClearBtn.addEventListener("click", (e) => {
    allMembers = [];
    expenses = [];
    setItems(MEMBERS_LOCALSTORAGE_KEY, allMembers);
    setItems(EXPENSES_LOCALSTORAGE_KEY, expenses);

    addExpenseFormReset();
    clearAllConfirm.classList.add("hidden");
    clearAllConfirm.classList.remove("flex");
    clearAllBtn.classList.remove("hidden");

    memberNameInput.value = "";
    renderAll();
})
cancelClearBtn.addEventListener("click", (e) => {
    clearAllConfirm.classList.add("hidden");
    clearAllConfirm.classList.remove("flex");
    clearAllBtn.classList.remove("hidden");
})

function renderAll() {
    memberErrorMsg.classList.add("hidden");
    renderMembers();
    renderExpenses();
    renderBalance();
}
renderAll();