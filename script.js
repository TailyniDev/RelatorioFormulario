function gerar(pdf = false, print = false) {
    const getValueOrDefault = (id, fallback = "Não informado") => {
      const el = document.getElementById(id);
      return el ? el.value || fallback : fallback;
    };
  
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
  
    setText('doc-cliente', getValueOrDefault('cliente'));
    
    const dataInput = document.getElementById('data')?.value;
    setText('doc-data', dataInput ? new Date(dataInput).toLocaleDateString('pt-BR') : "Sem data");
  
    const today = new Date();
    setText('current-date', today.toLocaleDateString('pt-BR'));
  
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    setText('full-date', today.toLocaleDateString('pt-BR', options));
  
    const itensContainer = document.getElementById('doc-itens');
    if (itensContainer) {
      itensContainer.innerHTML = '';
      const rows = document.querySelectorAll('.item-row');
      let total = 0;
  
      rows.forEach((row, index) => {
        const desc = row.querySelector('.item-desc')?.value || `Item ${index + 1}`;
        const tamanho = row.querySelector('.item-tamanho')?.value || '-';
        const qtd = parseFloat(row.querySelector('.item-qtd')?.value) || 0;
        const valor = parseFloat(row.querySelector('.item-valor')?.value) || 0;
        const itemTotal = qtd * valor;
        total += itemTotal;
  
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${desc}</td>
          <td>${tamanho}</td>
          <td>${qtd}</td>
          <td>R$ ${valor.toFixed(2).replace('.', ',')}</td>
          <td>R$ ${itemTotal.toFixed(2).replace('.', ',')}</td>
        `;
        itensContainer.appendChild(tr);
      });
  
      setText('doc-total', `R$ ${total.toFixed(2).replace('.', ',')}`);
    }
  
    setText('doc-observacoes', getValueOrDefault('observacoes', "Nenhuma."));
    setText('doc-responsavel', getValueOrDefault('responsavel'));
    setText('doc-autorizador', getValueOrDefault('autorizador'));
  
    const relatorio = document.getElementById('relatorio');
    if (relatorio) {
      relatorio.classList.remove('hidden');
      relatorio.style.position = 'static';
      relatorio.style.visibility = 'visible';
    }
  
    if (pdf) {
      html2pdf().from(relatorio).save('Controle_Estoque.pdf');
    } else if (print) {
      window.print();
    }
  }
  
  function adicionarItem() {
    const container = document.getElementById('itens-container');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
      <input type="text" class="item-desc" placeholder="Descrição" />
      <input type="number" class="item-qtd" placeholder="Qtd" />
      <select class="item-tamanho">
        <option value="">Tamanho</option>
        <option value="P">P</option>
        <option value="M">M</option>
        <option value="G">G</option>
      </select>
      <input type="number" class="item-valor" placeholder="Valor" />
      <button onclick="removerItem(this)">❌</button>
    `;
    container.appendChild(newRow);
  }
  
  function removerItem(button) {
    const row = button.closest('.item-row');
    row.remove();
  }
  
  function validarFormulario() {
    gerar(); // Visualizar
  }
  
  function gerarPDF() {
    gerar(true, false);
  }
  
  function imprimirDocumento() {
    gerar(false, true);
  }
  
  function limparFormulario() {
    location.reload();
  }
  