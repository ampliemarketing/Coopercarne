// Utility for exporting reports in PDF and Excel formats

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDFPrint(title: string, headers: string[], rows: (string | number)[][]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #c51d1f; padding-bottom: 12px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #c51d1f; text-transform: uppercase; }
          .subtitle { font-size: 14px; color: #666; }
          h2 { margin-top: 0; color: #111; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
          th { background-color: #f8f9fa; font-weight: bold; color: #333; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; font-size: 11px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">COOPERCARNE</div>
            <div class="subtitle">Cooperativa dos Carnejos e Pecuária</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #666;">
            Emissão: ${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR")}
          </div>
        </div>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
        <div class="footer">
          Relatório gerado automaticamente pelo Sistema Oficial COOPERCARNE | Documento Operacional
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
