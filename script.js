const BADGE_COLORS = ['#2F6B4F', '#3D5A80', '#8C5E58', '#6A7B76'];
const MEMBERS_LOCALSTORAGE_KEY = "members";

const membersCount = document.getElementById("members-count");
const addMemberForm = document.getElementById("add-member-form");
const memberNameInput = document.getElementById("member-name-input");
const addMemberBtn = document.getElementById("add-member-btn");
const memberErrorMsg = document.getElementById("member-error-msg");
const membersList = document.getElementById("members-list");
const membersEmpty = document.getElementById("members-empty");

let allMembers = getItems(MEMBERS_LOCALSTORAGE_KEY); // Getting members from localStorage

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
    if (!value) {
        memberErrorMsg.classList.remove("hidden");
        return;
    }
    memberErrorMsg.classList.add("hidden");

    allMembers = [...allMembers, { name: value, id: `mem_${Date.now()}` }];
    setItems(MEMBERS_LOCALSTORAGE_KEY, allMembers); // Setting members to localStorage
    memberNameInput.value = "";
    renderAll();
})

function renderMembers() {
    membersList.innerHTML = "";
    membersCount.textContent = `${allMembers.length} members`;
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
                    style="background-color: ${getRandomFetchColor()}">
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
            const id = removeBtn.dataset.id;
            allMembers = allMembers.filter(({ id: memId }) => memId !== id);
            setItems(MEMBERS_LOCALSTORAGE_KEY, allMembers);
            renderAll();
        }
    })
}

function renderAll() {
    renderMembers();
}
renderAll();