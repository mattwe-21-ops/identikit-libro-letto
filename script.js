document.addEventListener("DOMContentLoaded", () => {
    const ratingBox = document.getElementById("rating-box");
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

    // 3. ESPORTAZIONE DOCX (Word) con Autore e Compilatore accanto a Identikit nel titolo principale
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
                <div class="text-block">${trama.replace(/\n/g, '<br>')}</div>

                <div class="section-title">Personaggi principali</div>
                <div class="text-block">${personaggi.replace(/\n/g, '<br>')}</div>

                <div class="section-title">Note</div>
                <div class="text-block">${note.replace(/\n/g, '<br>')}</div>

                <div class="footer-signature">
                    Identikit compilato e firmato da: <strong>${firma}</strong>
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