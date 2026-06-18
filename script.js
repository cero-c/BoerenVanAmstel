// ==========================================
// ORTAK DEĞİŞKENLER
// ==========================================
let currentStep = 1; // Tutorial için adım hafızası
let selectedAmount = '5'; // Varsayılan tutar
let selectedFrequency = 'eenmalige'; // YENİ: Varsayılan sıklık (Eenmalig -> eenmalige)

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. VİDEO VE BAŞLANGIÇ EKRANI (Tutorial)
    // ==========================================
    const beginScherm = document.getElementById('begin-scherm');
    if (beginScherm) {
        beginScherm.addEventListener('click', startVideo);
    }

    const video = document.getElementById('intro-video');
    if (video) {
        video.addEventListener('click', () => {
            video.pause();
            showTutorial();
        });
        video.addEventListener('ended', showTutorial);
    }

    // Tutorial Butonları
    const btnVerder = document.getElementById('btn-verder');
    const btnSkipTerug = document.getElementById('btn-skip-terug');
    const btnTerugSmall = document.getElementById('btn-terug-small');

    if (btnVerder) {
        btnVerder.addEventListener('click', () => {
            if (currentStep === 1) updateStep(2);
            else if (currentStep === 2) updateStep(3);
            else if (currentStep === 3) console.log("Haritayı aç: Keşfetmeye başla!"); 
        });
    }

    if (btnSkipTerug) {
        btnSkipTerug.addEventListener('click', () => {
            if (currentStep === 1) console.log("Tutorial atlandı, haritaya geç!");
            else if (currentStep === 2) updateStep(1); 
            else if (currentStep === 3) window.location.href = 'bijdrage.html';
        });
    }

    if (btnTerugSmall) {
        btnTerugSmall.addEventListener('click', () => {
            updateStep(2); 
        });
    }

    // ==========================================
    // 2. DONEREN (BAĞIŞ) SAYFASI ETKİLEŞİMLERİ
    // ==========================================
    
    // --- Sekmeler (Tabs) Seçimi ve Hafızaya Alma ---
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Görsel olarak aktif olanı değiştir
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // YENİ: Hangi sekmenin seçildiğini bul ve dilbilgisine (Felemenkçe) uyarla
                const tabText = this.innerText.trim().toLowerCase();
                if (tabText === 'eenmalig') {
                    selectedFrequency = 'eenmalige';
                } else if (tabText === 'maandelijks') {
                    selectedFrequency = 'maandelijkse';
                } else if (tabText === 'jaarlijks') {
                    selectedFrequency = 'jaarlijkse';
                }
            });
        });
    }

    // --- Miktar Butonları ve Overlay ---
    const amountBtns = document.querySelectorAll('.amount-btn');
    const overlay = document.getElementById('impact-overlay');
    const impactImage = document.getElementById('impact-image');
    
    if (amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            // TIKLAMA: Seçimi kaydet ve butonu aktif yap
            btn.addEventListener('click', function() {
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Seçilen değeri hafızaya al
                selectedAmount = this.getAttribute('data-amount'); 
            });

            // MOUSE ÜZERİNE GELİNCE: Resmi göster
            btn.addEventListener('mouseenter', function() {
                const amount = this.getAttribute('data-amount'); 
                if (impactImage) {
                    impactImage.src = `images/overlay-donatie-${amount}-euro.png`;
                }
                if (overlay) {
                    overlay.style.display = 'flex';
                }
            });

            // MOUSE ÜZERİNDEN ÇIKINCA: Resmi gizle
            btn.addEventListener('mouseleave', function() {
                if (overlay) {
                    overlay.style.display = 'none';
                }
            });
        });
    }

    // --- Overlay Kapatma ---
    if (overlay) {
        overlay.addEventListener('click', function() {
            overlay.style.display = 'none';
        });
    }

    const modal = document.querySelector('.impact-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            event.stopPropagation(); 
        });
    }
});


// ==========================================
// FONKSİYONLAR (Global)
// ==========================================

// --- Tutorial Geçişleri ---
function startVideo() {
    document.getElementById('begin-scherm').style.display = 'none';
    document.getElementById('video-scherm').style.display = 'block';
    const video = document.getElementById('intro-video');
    if(video) video.play();
}

function showTutorial() {
    document.getElementById('video-scherm').style.display = 'none';
    document.getElementById('tutorial-scherm').style.display = 'block';
    updateStep(1); 
}

function updateStep(step) {
    currentStep = step;
    
    const title = document.getElementById('tut-title');
    const text1 = document.getElementById('tut-text-1');
    const text2 = document.getElementById('tut-text-2');
    const stepInd = document.getElementById('tut-step');
    const btnLeft = document.getElementById('btn-skip-terug');
    const btnRight = document.getElementById('btn-verder');
    const markersContainer = document.getElementById('markers-container');
    const step3Markers = document.getElementById('step3-markers');
    const btnTerugSmall = document.getElementById('btn-terug-small');

    if (!title) return; // Tutorial sayfasında değilsek kodu kırma

    if (step === 1) {
        title.style.display = 'block';
        title.innerHTML = "Hoi, ik ben Grutto!<br>Welkom in Amstelland.";
        text1.innerHTML = "Op deze kaart ontdek je hoe boeren, natuur en weidevogels met elkaar verbonden zijn.";
        text2.style.display = 'block';
        text2.innerHTML = "Scroll over de kaart en verken het gebied.";
        stepInd.innerText = "1/3";
        btnLeft.innerText = "Skip";
        btnRight.innerText = "Verder";
        markersContainer.style.display = 'none';
        btnTerugSmall.style.display = 'none'; 
    } 
    else if (step === 2) {
        title.style.display = 'block';
        title.innerHTML = "Klik op een <strong>marker</strong> om <strong>verhalen, locaties</strong> en bijzondere <strong>plekken</strong> te ontdekken.";
        text1.innerHTML = "Via het menu kun je locaties filteren, wisselen tussen verschillende perspectieven en een uitdagend spelletje vinden.";
        text2.style.display = 'none';
        stepInd.innerText = "2/3";
        btnLeft.innerText = "Terug";
        btnRight.innerText = "Verder";
        markersContainer.style.display = 'block';
        if(step3Markers) step3Markers.style.display = 'none';
        btnTerugSmall.style.display = 'none'; 
    } 
    else if (step === 3) {
        title.style.display = 'none';
        text1.innerHTML = "Ben je klaar? Dan laat ik je graag mijn landschap zien. <strong>Klik op de rechterknop</strong> en ontdek Amstelland.";
        text2.style.display = 'block';
        text2.innerHTML = "Of ben je benieuwd hoe jij vandaag kunt bijdragen aan natuurherstel? <strong>Klik op de linkerknop.</strong>";
        stepInd.innerText = "3/3";
        btnLeft.innerText = "Draag bij aan natuurherstel";
        btnRight.innerText = "Ontdek het Amstelgebied";
        markersContainer.style.display = 'block'; 
        if(step3Markers) step3Markers.style.display = 'block';
        btnTerugSmall.style.display = 'block'; 
    }
}

// --- Doneren (Bağış) Adım Geçişleri ---
function goToStep(stepNumber) {
    const allSteps = [0, 1, 2, 3, 4];
    allSteps.forEach(i => {
        const stepEl = document.getElementById('step-' + i);
        if (stepEl) {
            stepEl.style.display = 'none';
        }
    });

    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) {
        targetStep.style.display = 'flex';
    }

    // 3. Başlığı Güncelle
    const titleObj = document.getElementById('doneren-title');
    if (titleObj) {
        if (stepNumber === 4) {
            titleObj.innerText = "Bedankt voor je bijdrage!";
        } else {
            titleObj.innerText = "Je wilt bijdragen aan natuurherstel";
        }
    }

    // YENİ: ADIM 3'e geçiliyorsa başlığa hem SIKLIĞI hem de MİKTARI yazdır!
    if (stepNumber === 3) {
        const step3Subtitle = document.getElementById('step-3-subtitle');
        if (step3Subtitle) {
            step3Subtitle.innerText = `Je hebt gekozen voor een ${selectedFrequency} donatie van ${selectedAmount} euro`;
        }
    }

    const bird = document.getElementById('doneren-bird');
    if (bird) {
        if (stepNumber >= 2) {
            bird.style.display = 'block';
        } else {
            bird.style.display = 'none';
        }
    }

    // YENİ: SADECE ADIM 4'TE KONFETİYİ GÖSTER
    const confetti = document.getElementById('confetti-img');
    if (confetti) {
        if (stepNumber === 4) {
            confetti.style.display = 'block';
        } else {
            confetti.style.display = 'none';
        }
    }

}