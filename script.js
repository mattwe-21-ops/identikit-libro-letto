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

    // FUNZIONE DI SUPPORTO: Costruisce un layout di testo pulito isolato per evitare i bug grafici dei form in html2pdf
    const generaStrutturaDocumento = (titolo, autore, anno, genere, dataLettura, pagine, trama, personaggi, note, firma, valutazione) => {
        const div = document.createElement("div");
        div.style.padding = "25px";
        div.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
        div.style.color = "#222222";
        div.style.backgroundColor = "#ffffff";

        div.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000000; padding-bottom: 15px;">
                <h1 style="margin: 0 0 5px 0; font-size: 24px; color: #000000; font-weight: bold;">📚 Identikit (Autore: ${autore})</h1>
                <p style="margin: 0; font-size: 14px; color: #555555; font-style: italic;">Compilato da: <strong>${firma}</strong></p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; width: 35%; color: #000000;">Titolo del Libro:</td><td style="padding: 10px 5px;">${titolo}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Autore del Libro:</td><td style="padding: 10px 5px;">${autore}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Anno di Pubblicazione:</td><td style="padding: 10px 5px;">${anno}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Genere:</td><td style="padding: 10px 5px;">${genere}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Data Lettura:</td><td style="padding: 10px 5px;">${dataLettura}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Numero Pagine:</td><td style="padding: 10px 5px;">${pagine}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 5px; font-weight: bold; color: #000000;">Valutazione:</td><td style="padding: 10px 5px; font-weight: bold; color: #000000; font-size: 16px;">${valutazione}</td></tr>
            </table>

            <div style="margin-top: 25px;">
                <h3 style="border-bottom: 1px solid #000000; padding-bottom: 5px; margin-bottom: 10px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #000000;">Trama (senza spoiler)</h3>
                <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-left: 4px solid #000000; margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; border-radius: 0 8px 8px 0;">${trama}</p>
            </div>

            <div style="margin-top: 25px;">
                <h3 style="border-bottom: 1px solid #000000; padding-bottom: 5px; margin-bottom: 10px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #000000;">Personaggi principali</h3>
                <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-left: 4px solid #000000; margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; border-radius: 0 8px 8px 0;">${personaggi}</p>
            </div>

            <div style="margin-top: 25px;">
                <h3 style="border-bottom: 1px solid #000000; padding-bottom: 5px; margin-bottom: 10px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #000000;">Note</h3>
                <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-left: 4px solid #000000; margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; border-radius: 0 8px 8px 0;">${note}</p>
            </div>

            <div style="margin-top: 50px; text-align: right; font-style: italic; font-size: 14px; border-top: 1px dashed #cbd5e1; padding-top: 12px; color: #444444;">
                Identikit compilato e firmato da: <strong style="color: #000000;">${firma}</strong>
            </div>
        `;
        return div;
    };

    // 3. ESPORTAZIONE PDF REVISIONATA ED INESPUGNABILE
    btnPdf.addEventListener("click", () => {
        const titolo = document.getElementById("titolo").value.trim() || "Senza Titolo";
        const autore = document.getElementById("autore").value.trim() || "Non specificato";
        const anno = document.getElementById("anno").value.trim() || "---";
        const genere = document.getElementById("genere").value.trim() || "---";
        const dataLettura = document.getElementById("data-lettura").value || "---";
        const pagine = document.getElementById("pagine").value || "---";
        const trama = document.getElementById("trama").value.trim() || "---";
        const personaggi = document.getElementById("personaggi").value.trim() || "---";
        const note = document.getElementById("note").value.trim() || "---";
        const firma = document.getElementById("firma").value.trim() || "Anonimo";
        const valutazione = selectedRating ? `${selectedRating} / 10` : "Non specificata";

        // Estrae i contenuti strutturandoli in un blocco di solo testo pulito (Risolve il bug dei moduli vuoti)
        const sorgentePdf = generaStrutturaDocumento(titolo, autore, anno, genere, dataLettura, pagine, trama, personaggi, note, firma, valutazione);

        const opt = {
            margin:       15,
            filename:     `Identikit_${titolo.replace(/\\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Genera il PDF dal modello virtuale infallibile
        html2pdf().from(sorgentePdf).set(opt).save().catch(err => {
            console.error("Innesco sistema di stampa nativo alternativo...", err);
            // Fallback d'emergenza in caso di blocchi rigidi del browser locale (CORS/file://)
            window.print();
        });
    });

    // 4. ESPORTAZIONE DOCX (Word)
    btnDocx.addEventListener("click", () => {
        const titolo = document.getElementById("titolo").value || "Senza Titolo";
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

        const docxContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <title>Identikit Libro Letto</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #222222; }
                    h1 { text-align: center; color: #000000; font-size: 18pt; margin-bottom: 20px; line-height: 1.3; border-bottom: 2px solid #000000; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    td { padding: 8px; vertical-align: top; border-bottom: 1px solid #eeeeee; }
                    .label { font-weight: bold; color: #000000; width: 35%; }
                    .section-title { font-weight: bold; color: #000000; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #000000; padding-bottom: 3px; text-transform: uppercase; font-size: 11pt; }
                    .text-block { background-color: #f8fafc; padding: 12px; border-left: 4px solid #000000; margin-bottom: 15px; white-space: pre-wrap; }
                    .footer-signature { margin-top: 50px; text-align: right; font-style: italic; font-size: 11pt; border-top: 1px dashed #cccccc; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>📚 Identikit (Autore: ${autore})<br><span style="font-size: 12pt; font-weight: normal; color: #555555;">Compilato da: ${firma}</span></h1>
                
                <table>
                    <tr><td class="label">Titolo del Libro:</td><td>${titolo}</td></tr>
                    <tr><td class="label">Autore del Libro:</td><td>${autore}</td></tr>
                    <tr><td class="label">Anno di pubblicazione:</td><td>${anno}</td></tr>
                    <tr><td class="label">Genere:</td><td>${genere}</td></tr>
                    <tr><td class="label">Data lettura:</td><td>${dataLettura}</td></tr>
                    <tr><td class="label">Numero pagine:</td><td>${pagine}</td></tr>
                    <tr><td class="label">Valutazione:</td><td><strong>${valutazione}</strong></td></tr>
                </table>

                <div class="section-title">Trama (senza spoiler)</div>
                <div class="text-block">${trama.replace(/\\n/g, '<br>')}</div>

                <div class="section-title">Personaggi principali</div>
                <div class="text-block">${personaggi.replace(/\\n/g, '<br>')}</div>

                <div class="section-title">Note</div>
                <div class="text-block">${note.replace(/\\n/g, '<br>')}</div>

                <div class="footer-signature">
                    Identikit compilato e firmato da: <strong>${firma}</strong>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\\ufeff' + docxContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Identikit_${titolo.replace(/\\s+/g, '_')}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});