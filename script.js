document.addEventListener("DOMContentLoaded", () => {
    const ratingBox = document.getElementById("rating-box");
    const btnPdf = document.getElementById("btn-pdf");
    const btnDocx = document.getElementById("btn-docx");
    const btnClear = document.getElementById("btn-clear");
    const form = document.getElementById("book-form");

    let selectedRating = null;

    // 1. Genera la barra dei voti da 1 a 10
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rating-btn";
        btn.textContent = i;
        
        btn.addEventListener("click", () => {
            document.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedRating = i;
        });
        
        ratingBox.appendChild(btn);
    }

    // 2. Svuota il form
    btnClear.addEventListener("click", () => {
        form.reset();
        document.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
        selectedRating = null;
    });

    // 3. ESPORTAZIONE PDF (Inserisce l'autore accanto al titolo principale)
    btnPdf.addEventListener("click", () => {
        const element = document.getElementById("printable-area");
        const buttons = document.getElementById("action-buttons");
        const firmaWebGroup = document.getElementById("firma-web-group");
        const firmaPdfBlock = document.getElementById("firma-pdf-block");
        const mainTitle = document.getElementById("main-title");
        
        const titolo = document.getElementById("titolo").value.trim() || "---";
        const autore = document.getElementById("autore").value.trim() || "Non specificato";
        const firma = document.getElementById("firma").value.trim() || "Anonimo";

        // Salva il titolo originale della pagina web
        const originalTitleHtml = mainTitle.innerHTML;

        // MODIFICA IL TITOLO IN CIMA INSERENDO L'AUTORE ACCANTO AD IDENTIKIT
        mainTitle.innerHTML = `📚 Identikit (Autore: ${autore}) - Compilato da: ${firma}`;
        
        // Imposta anche la firma in calce
        document.getElementById("firma-testo-pdf").textContent = firma;

        // Nasconde temporaneamente i controlli web per il PDF
        buttons.style.display = "none";
        firmaWebGroup.style.display = "none";
        firmaPdfBlock.style.display = "block";

        const opt = {
            margin:       15,
            filename:     `Identikit_${titolo.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // Ripristina la visualizzazione corretta sul browser ad esportazione finita
            buttons.style.display = "flex";
            firmaWebGroup.style.display = "flex";
            firmaPdfBlock.style.display = "none";
            mainTitle.innerHTML = originalTitleHtml;
        });
    });

    // 4. ESPORTAZIONE DOCX (Inserisce l'autore accanto al titolo principale)
    btnDocx.addEventListener("click", () => {
        const titolo = document.getElementById("titolo").value || "---";
        const autore = document.getElementById("autore").value || "Non specificato";
        const anno = document.getElementById("anno").value || "---";
        const genere = document.getElementById("genere").value || "---";
        const dataLettura = document.getElementById("data-lettura").value || "---";
        const pagine = document.getElementById("pagine").value || "---";
        const trama = document.getElementById("trama").value || "---";
        const personaggi = document.getElementById("personaggi").value || "---";
        const note = document.getElementById("note").value || "---";
        const firma = document.getElementById("firma").value || "Anonimo";
        const valutazione = selectedRating ? `${selectedRating} / 10` : "Non specificata";

        // Costruzione del layout Word con autore e compilatore inseriti direttamente nel tag H1 principale
        const docxContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <title>Identikit Libro Letto</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
                    h1 { text-align: center; color: #000000; font-size: 18pt; margin-bottom: 20px; line-height: 1.3; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    td { padding: 8px; vertical-align: top; }
                    .label { font-weight: bold; color: #000000; width: 30%; }
                    .section-title { font-weight: bold; color: #000000; margin-top: 20px; margin-bottom: 5px; border-bottom: 1px solid #cccccc; padding-bottom: 3px; }
                    .text-block { background-color: #f9f9f9; padding: 10px; border-left: 3px solid #cccccc; margin-bottom: 15px; white-space: pre-wrap; }
                    .footer-signature { margin-top: 40px; text-align: right; font-style: italic; font-size: 12pt; border-top: 1px dashed #cccccc; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>📚 Identikit (Autore: ${autore})<br><span style="font-size: 13pt; font-weight: normal; color: #555555;">Compilato da: ${firma}</span></h1>
                
                <table>
                    <tr><td class="label">Titolo del Libro:</td><td>${titolo}</td></tr>
                    <tr><td class="label">Autore:</td><td>${autore}</td></tr>
                    <tr><td class="label">Anno di pubblicazione:</td><td>${anno}</td></tr>
                    <tr><td class="label">Genere:</td><td>${genere}</td></tr>
                    <tr><td class="label">Data lettura:</td><td>${dataLettura}</td></tr>
                    <tr><td class="label">Numero pagine:</td><td>${pagine}</td></tr>
                    <tr><td class="label">Valutazione:</td><td><strong>${valutazione}</strong></td></tr>
                </table>

                <div class="section-title">Trama (senza spoiler)</div>
                <div class="text-block">${trama.replace(/\n/g, '<br>')}</div>

                <div class="section-title">Personaggi principali</div>
                <div class="text-block">${personaggi.replace(/\n/g, '<br>')}</div>

                <div class="section-title">Note</div>
                <div class="text-block">${note.replace(/\n/g, '<br>')}</div>

                <div class="footer-signature">
                    Identikit compilato da: <strong>${firma}</strong>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff' + docxContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Identikit_${titolo.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});