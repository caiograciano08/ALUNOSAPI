const API_URL = 'http://localhost:8080';

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(e.target.dataset.target).classList.add('active');
    });
});

// Toast notification
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Generic Fetch
async function apiCall(endpoint, method, body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);
        
        const res = await fetch(`${API_URL}${endpoint}`, options);
        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || 'Erro na requisição');
        }
        
        if (res.status !== 204 && res.status !== 201) {
            const text = await res.text();
            return text ? JSON.parse(text) : {};
        }
        return {};
    } catch (err) {
        showToast(err.message, 'error');
        throw err;
    }
}

// Aluno Form
document.getElementById('form-aluno').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nomeCompleto: document.getElementById('aluno-nome').value,
        email: document.getElementById('aluno-email').value,
        cpf: document.getElementById('aluno-cpf').value
    };
    await apiCall('/alunos', 'POST', payload);
    showToast('Aluno cadastrado!');
    e.target.reset();
});

// Professor Form
document.getElementById('form-professor').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nomeCompleto: document.getElementById('prof-nome').value,
        email: document.getElementById('prof-email').value,
        cpf: document.getElementById('prof-cpf').value
    };
    await apiCall('/professores', 'POST', payload);
    showToast('Professor cadastrado!');
    e.target.reset();
});

// Disciplina Form
document.getElementById('form-disciplina').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('disc-nome').value,
        cargaHoraria: parseInt(document.getElementById('disc-carga').value),
        professor: { id: parseInt(document.getElementById('disc-prof-id').value) }
    };
    await apiCall('/disciplinas', 'POST', payload);
    showToast('Disciplina cadastrada!');
    e.target.reset();
});

// Matricula Form
document.getElementById('form-matricula').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        aluno: { id: parseInt(document.getElementById('mat-aluno-id').value) },
        disciplina: { id: parseInt(document.getElementById('mat-disc-id').value) }
    };
    await apiCall('/matriculas', 'POST', payload);
    showToast('Matrícula realizada!');
    e.target.reset();
});

// Atualizar Notas Form
document.getElementById('form-notas').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('nota-mat-id').value;
    const n1 = document.getElementById('nota-1').value;
    const n2 = document.getElementById('nota-2').value;
    
    const payload = {};
    if (n1) payload.nota1 = parseFloat(n1);
    if (n2) payload.nota2 = parseFloat(n2);
    
    await apiCall(`/matriculas/atualizar-notas/${id}`, 'PATCH', payload);
    showToast('Notas atualizadas!');
    e.target.reset();
});

// Historico Form
document.getElementById('form-historico').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('hist-aluno-id').value;
    
    try {
        const historico = await apiCall(`/matriculas/emitir-historico/${id}`, 'GET');
        
        if (historico && historico.nomeAluno) {
            const container = document.getElementById('historico-resultado');
            
            let html = `
                <div class="historico-header">
                    <h3>${historico.nomeAluno}</h3>
                    <p>${historico.emailAluno} | CPF: ${historico.cpfAluno}</p>
                </div>
                <div class="disciplina-list">
            `;
            
            historico.disciplinas.forEach(d => {
                html += `
                    <div class="disciplina-item">
                        <div>
                            <h4 style="font-size: 1.2rem; margin-bottom: 4px;">${d.nomeDisciplina}</h4>
                            <p style="color: var(--text-secondary)">Prof. ${d.nomeProfessor}</p>
                            <div style="margin-top: 8px; font-family: monospace;">
                                Nota 1: ${d.nota1 || '-'} | Nota 2: ${d.nota2 || '-'} 
                                ${d.media ? `<strong>| Média: ${d.media}</strong>` : ''}
                            </div>
                        </div>
                        <span class="status-badge status-${d.status}">${d.status}</span>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
            container.classList.remove('hidden');
            showToast('Histórico carregado');
        }
    } catch (err) {
        document.getElementById('historico-resultado').classList.add('hidden');
    }
});
