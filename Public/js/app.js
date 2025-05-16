// js/app.js

// 🚀 Fungsi Membuka Modal Form
function openInvestmentModal() {
  const modal = document.getElementById('investmentModal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('fade-in');
      document.getElementById('investmentInput').focus();
    }, 10);
  } else {
    const name = prompt('Nama investasi:');
    if (name) addInvestment(name);
  }
}

// 🚀 Fungsi Menutup Modal Form
function closeInvestmentModal() {
  const modal = document.getElementById('investmentModal');
  if (modal) {
    modal.classList.remove('fade-in');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 200);
  }
}

// 🚀 Fungsi Tambah Investasi dari Form (Manual)
async function addInvestmentFromForm() {
  const investmentInput = document.getElementById('investmentInput');
  const newInvestment = investmentInput.value.trim();

  if (!newInvestment) {
    alert('Nama investasi tidak boleh kosong.');
    return;
  }

  // Simpan investasi dan tetap fokus input
  await addInvestment(newInvestment);
  investmentInput.value = '';
  investmentInput.focus();
  fetchInvestments();
}

// 🚀 Fungsi Tambah Investasi ke Server
async function addInvestment(name) {
  try {
    const response = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(response.status === 409 ? 'Investasi sudah ada.' : 'Gagal menyimpan investasi.');
    }
  } catch (error) {
    alert(error.message);
  }
}

// 🚀 Fungsi Memuat Daftar Investasi
async function fetchInvestments() {
  try {
    const response = await fetch('/api/investments');
    if (!response.ok) throw new Error('Gagal memuat data investasi.');

    const investments = await response.json();
    renderInvestments(investments);
  } catch (error) {
    alert(error.message);
  }
}

// 🚀 Fungsi Menampilkan Daftar Investasi
function renderInvestments(investments) {
  const investmentList = document.getElementById('investmentList');
  investmentList.innerHTML = '';

  if (investments.length === 0) {
    investmentList.innerHTML = '<p class="empty-message">Belum ada investasi.</p>';
    return;
  }

  investments.forEach(({ name }) => {
    const investmentItem = document.createElement('div');
    investmentItem.className = 'investment-item';
    investmentItem.textContent = name;
    investmentList.appendChild(investmentItem);
  });
}

// 🚀 Fungsi Memulai Aplikasi
document.addEventListener('DOMContentLoaded', () => {
  fetchInvestments();

  const saveButton = document.getElementById('saveInvestmentButton');
  if (saveButton) {
    saveButton.addEventListener('click', addInvestmentFromForm);
  }
});
