document.addEventListener('DOMContentLoaded', () => {
    const dataDiriSection = document.getElementById('data-diri-section');
    const screeningSection = document.getElementById('screening-section');
    const resultSection = document.getElementById('result-section');

    const namaInput = document.getElementById('nama');
    const jenisKelaminInput = document.getElementById('jenis-kelamin');
    const usiaInput = document.getElementById('usia');
    const mulaiScreeningBtn = document.getElementById('mulai-screening-btn');
    const submitScreeningBtn = document.getElementById('submit-screening-btn');
    const ulangScreeningBtn = document.getElementById('ulang-screening-btn');

    const namaDisplay = document.getElementById('nama-display');
    const diagnosisResult = document.getElementById('diagnosis-result');
    const healthTips = document.getElementById('health-tips');
    const questionsContainer = document.getElementById('questions-container');
    const riskChartCanvas = document.getElementById('risk-chart');
    let riskChart; // Untuk menyimpan instance Chart.js

    let userData = {};

    // Pertanyaan screening (contoh)
    const questions = [
        {
            id: 'riwayat-keluarga',
            question: 'Apakah ada riwayat diabetes di keluarga Anda (orang tua/saudara kandung)?',
            options: [
                { value: 'ya', text: 'Ya' },
                { value: 'tidak', text: 'Tidak' }
            ]
        },
        {
            id: 'gaya-hidup',
            question: 'Seberapa sering Anda mengonsumsi makanan manis atau minuman bersoda?',
            options: [
                { value: 'sering', text: 'Sering' },
                { value: 'kadang', text: 'Kadang-kadang' },
                { value: 'jarang', text: 'Jarang' }
            ]
        },
        {
            id: 'aktivitas-fisik',
            question: 'Seberapa sering Anda berolahraga atau melakukan aktivitas fisik?',
            options: [
                { value: 'sering', text: 'Setiap hari' },
                { value: 'kadang', text: 'Beberapa kali seminggu' },
                { value: 'jarang', text: 'Jarang sekali' }
            ]
        },
        {
            id: 'berat-badan',
            question: 'Apakah Anda merasa memiliki berat badan berlebih?',
            options: [
                { value: 'ya', text: 'Ya' },
                { value: 'tidak', text: 'Tidak' }
            ]
        },
        {
            id: 'gejala-awal',
            question: 'Apakah Anda sering merasa haus, sering buang air kecil, atau sering merasa lelah tanpa sebab jelas?',
            options: [
                { value: 'ya', text: 'Ya' },
                { value: 'tidak', text: 'Tidak' }
            ]
        }
    ];

    // Fungsi untuk menampilkan bagian tertentu
    function showSection(section) {
        dataDiriSection.classList.remove('active');
        screeningSection.classList.remove('active');
        resultSection.classList.remove('active');
        section.classList.add('active');
    }

    // Fungsi untuk meng-generate pertanyaan
    function generateQuestions() {
        questionsContainer.innerHTML = ''; // Bersihkan pertanyaan sebelumnya
        questions.forEach(q => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            questionDiv.innerHTML = `
                <p><strong>${q.question}</strong></p>
            `;
            q.options.forEach(option => {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = q.id;
                radioInput.value = option.value;
                radioInput.id = `${q.id}-${option.value}`;

                const label = document.createElement('label');
                label.htmlFor = `${q.id}-${option.value}`;
                label.textContent = option.text;

                questionDiv.appendChild(radioInput);
                questionDiv.appendChild(label);
                questionDiv.appendChild(document.createElement('br'));
            });
            questionsContainer.appendChild(questionDiv);
        });
    }

    // Fungsi untuk menganalisis hasil screening
    function analyzeResults() {
        let riskScore = 0;
        let possibleDiabetesType = "Risiko Rendah Diabetes";
        let tips = "";

        // Mengumpulkan jawaban
        const answers = {};
        questions.forEach(q => {
            const selectedOption = document.querySelector(`input[name="${q.id}"]:checked`);
            if (selectedOption) {
                answers[q.id] = selectedOption.value;
            }
        });

        // Contoh sederhana logika penilaian risiko dan jenis diabetes
        // Ini perlu disempurnakan dengan logika yang lebih kompleks dan akurat
        if (answers['riwayat-keluarga'] === 'ya') riskScore += 2;
        if (answers['gaya-hidup'] === 'sering') riskScore += 3;
        if (answers['aktivitas-fisik'] === 'jarang') riskScore += 2;
        if (answers['berat-badan'] === 'ya') riskScore += 3;
        if (answers['gejala-awal'] === 'ya') riskScore += 4;

        // Logika penentuan jenis diabetes dan tips
        if (riskScore >= 9) {
            possibleDiabetesType = "Kemungkinan Diabetes Tipe 2";
            tips = `
                <ul>
                    <li>**Perubahan Gaya Hidup:** Fokus pada diet sehat (rendah gula dan karbohidrat olahan), porsi makan terkontrol, dan peningkatan aktivitas fisik.</li>
                    <li>**Pemeriksaan Medis:** Segera konsultasikan dengan dokter untuk pemeriksaan lebih lanjut dan diagnosis yang akurat.</li>
                    <li>**Edukasi Diabetes:** Pelajari lebih banyak tentang manajemen diabetes, termasuk pemantauan gula darah.</li>
                </ul>
            `;
        } else if (riskScore >= 5) {
            possibleDiabetesType = "Kemungkinan Prediabetes";
            tips = `
                <ul>
                    <li>**Pencegahan:** Ini adalah kesempatan besar untuk mencegah diabetes tipe 2! Fokus pada penurunan berat badan (jika berlebih) dan peningkatan aktivitas fisik.</li>
                    <li>**Diet Sehat:** Kurangi konsumsi gula, makanan olahan, dan tingkatkan asupan serat (buah, sayur, biji-bijian utuh).</li>
                    <li>**Konsultasi Dokter:** Diskusikan dengan dokter tentang langkah-langkah pencegahan dan pemantauan rutin.</li>
                </ul>
            `;
        } else {
            possibleDiabetesType = "Risiko Rendah Diabetes";
            tips = `
                <ul>
                    <li>**Pertahankan Gaya Hidup Sehat:** Lanjutkan diet seimbang, rutin berolahraga, dan jaga berat badan ideal.</li>
                    <li>**Pemeriksaan Rutin:** Lakukan pemeriksaan kesehatan rutin untuk memantau kondisi tubuh.</li>
                    <li>**Edukasi:** Tetap pelajari tentang diabetes dan faktor risikonya untuk pencegahan jangka panjang.</li>
                </ul>
            `;
        }

        // Jika usia muda dan ada gejala/riwayat keluarga, bisa indikasi tipe 1 (logika lebih kompleks dibutuhkan)
        if (userData.usia < 30 && answers['riwayat-keluarga'] === 'ya' && answers['gejala-awal'] === 'ya') {
             possibleDiabetesType = "Kemungkinan Diabetes Tipe 1 (perlu diagnosis medis)";
             tips = `
                <p>Mengingat usia Anda dan gejala yang dilaporkan, ada kemungkinan ini adalah Diabetes Tipe 1. Sangat penting untuk:</p>
                <ul>
                    <li>**Konsultasi Dokter Segera:** Segera temui dokter atau spesialis endokrinologi untuk diagnosis dan penanganan lebih lanjut.</li>
                    <li>**Edukasi Diabetes Tipe 1:** Pelajari tentang manajemen insulin, pemantauan gula darah, dan penyesuaian gaya hidup.</li>
                </ul>
             `;
        }


        diagnosisResult.innerHTML = `<p>${possibleDiabetesType}</p>`;
        healthTips.innerHTML = tips;

        // Menampilkan grafik
        renderRiskChart(riskScore);
    }

    // Fungsi untuk menampilkan grafik risiko
    function renderRiskChart(score) {
        if (riskChart) {
            riskChart.destroy(); // Hancurkan chart sebelumnya jika ada
        }

        const data = {
            labels: ['Risiko Anda', 'Risiko Maksimal'],
            datasets: [{
                label: 'Skor Risiko Diabetes',
                data: [score, questions.length * 4], // Maksimal skor berdasarkan contoh
                backgroundColor: ['#4CAF50', '#FFC107'], // Hijau untuk risiko, kuning untuk maksimal
                borderColor: ['#388E3C', '#FFA000'],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: questions.length * 4 + 2, // Sedikit lebih tinggi dari maks
                        title: {
                            display: true,
                            text: 'Skor Risiko'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Skor: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        };

        riskChart = new Chart(riskChartCanvas, config);
    }

    // Event Listener untuk tombol "Mulai Screening"
    mulaiScreeningBtn.addEventListener('click', () => {
        const nama = namaInput.value.trim();
        const jenisKelamin = jenisKelaminInput.value;
        const usia = parseInt(usiaInput.value);

        if (nama && jenisKelamin && !isNaN(usia) && usia > 0) {
            userData = { nama, jenisKelamin, usia };
            namaDisplay.textContent = nama;
            generateQuestions();
            showSection(screeningSection);
        } else {
            alert('Mohon lengkapi semua data diri dengan benar!');
        }
    });

    // Event Listener untuk tombol "Lihat Hasil"
    submitScreeningBtn.addEventListener('click', () => {
        // Cek apakah semua pertanyaan sudah dijawab
        let allAnswered = true;
        questions.forEach(q => {
            const selectedOption = document.querySelector(`input[name="${q.id}"]:checked`);
            if (!selectedOption) {
                allAnswered = false;
            }
        });

        if (allAnswered) {
            analyzeResults();
            showSection(resultSection);
        } else {
            alert('Mohon jawab semua pertanyaan sebelum melihat hasil.');
        }
    });

    // Event Listener untuk tombol "Ulang Screening"
    ulangScreeningBtn.addEventListener('click', () => {
        // Reset semua input dan tampilkan kembali halaman data diri
        namaInput.value = '';
        jenisKelaminInput.value = '';
        usiaInput.value = '';
        questionsContainer.innerHTML = '';
        if (riskChart) {
            riskChart.destroy(); // Hancurkan chart saat mengulang
        }
        showSection(dataDiriSection);
    });
});