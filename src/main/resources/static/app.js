const API_URL = 'http://localhost:8080';

// Initialize and Fetch
document.addEventListener('DOMContentLoaded', () => {
    loadListas();
});

async function loadListas() {
    // Alunos
    try {
        const alunos = await apiCall('/alunos', 'GET');
        if (Array.isArray(alunos) && alunos.length > 0) {
            let html = '<table class="data-table"><tr><th>ID</th><th>Nome</th><th>Email</th><th>CPF</th></tr>';
            alunos.forEach(a => html += `<tr><td>${a.id}</td><td>${a.nomeCompleto}</td><td>${a.email}</td><td>${a.cpf}</td></tr>`);
            html += '</table>';
            document.getElementById('list-alunos').innerHTML = html;
        } else {
            document.getElementById('list-alunos').innerHTML = '<p style="color:var(--text-secondary)">Nenhum aluno cadastrado.</p>';
        }
    } catch(e) {}

    // Professores
    try {
        const professores = await apiCall('/professores', 'GET');
        if (Array.isArray(professores) && professores.length > 0) {
            let html = '<table class="data-table"><tr><th>ID</th><th>Nome</th><th>Email</th><th>CPF</th></tr>';
            professores.forEach(p => html += `<tr><td>${p.id}</td><td>${p.nomeCompleto}</td><td>${p.email}</td><td>${p.cpf}</td></tr>`);
            html += '</table>';
            document.getElementById('list-professores').innerHTML = html;
        } else {
            document.getElementById('list-professores').innerHTML = '<p style="color:var(--text-secondary)">Nenhum professor cadastrado.</p>';
        }
    } catch(e) {}

    // Disciplinas
    try {
        const disciplinas = await apiCall('/disciplinas', 'GET');
        if (Array.isArray(disciplinas) && disciplinas.length > 0) {
            let html = '<table class="data-table"><tr><th>ID</th><th>Nome</th><th>Carga</th><th>Professor</th></tr>';
            disciplinas.forEach(d => {
                const profName = d.professor ? d.professor.nomeCompleto : '-';
                html += `<tr><td>${d.id}</td><td>${d.nome}</td><td>${d.cargaHoraria}h</td><td>${profName}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('list-disciplinas').innerHTML = html;
        } else {
            document.getElementById('list-disciplinas').innerHTML = '<p style="color:var(--text-secondary)">Nenhuma disciplina cadastrada.</p>';
        }
    } catch(e) {}
}

async function loadProfessores() {
    try {
        const professores = await apiCall('/professores', 'GET');
        const select = document.getElementById('disc-prof-id');
        select.innerHTML = '<option value="" disabled selected>Selecione o Professor</option>';
        if (Array.isArray(professores)) {
            professores.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nomeCompleto}</option>`;
            });
        }
    } catch(e) {}
}

async function loadAlunosAndDisciplinas() {
    try {
        const alunos = await apiCall('/alunos', 'GET');
        const disciplinas = await apiCall('/disciplinas', 'GET');
        
        const selectAlunoMat = document.getElementById('mat-aluno-id');
        const selectAlunoHist = document.getElementById('hist-aluno-id');
        const selectDiscMat = document.getElementById('mat-disc-id');
        
        let alunosHtml = '<option value="" disabled selected>Selecione o Aluno</option>';
        if (Array.isArray(alunos)) {
            alunos.forEach(a => {
                alunosHtml += `<option value="${a.id}">${a.nomeCompleto}</option>`;
            });
        }
        selectAlunoMat.innerHTML = alunosHtml;
        selectAlunoHist.innerHTML = alunosHtml;

        let discHtml = '<option value="" disabled selected>Selecione a Disciplina</option>';
        if (Array.isArray(disciplinas)) {
            disciplinas.forEach(d => {
                discHtml += `<option value="${d.id}">${d.nome}</option>`;
            });
        }
        selectDiscMat.innerHTML = discHtml;

    } catch(e) {}
}

async function loadMatriculas() {
    try {
        const matriculas = await apiCall('/matriculas', 'GET');
        const selectNota = document.getElementById('nota-mat-id');
        const selectTrancar = document.getElementById('trancar-mat-id');
        let matHtml = '<option value="" disabled selected>Selecione a Matrícula</option>';
        if (Array.isArray(matriculas)) {
            matriculas.forEach(m => {
                const alunoNome = m.aluno ? m.aluno.nomeCompleto : 'Sem Nome';
                const discNome = m.disciplina ? m.disciplina.nome : 'Sem Disciplina';
                matHtml += `<option value="${m.id}">${alunoNome} - ${discNome} (${m.status})</option>`;
            });
        }
        selectNota.innerHTML = matHtml;
        selectTrancar.innerHTML = matHtml;
    } catch(e) {}
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const target = e.target.dataset.target;
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        
        // Load data dynamically
        if (target === 'alunos' || target === 'professores') loadListas();
        if (target === 'disciplinas') { loadProfessores(); loadListas(); }
        if (target === 'matriculas') { loadAlunosAndDisciplinas(); loadMatriculas(); }
        if (target === 'historico') loadAlunosAndDisciplinas();
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
            let errorMsg = 'Erro na requisição';
            try {
                const errorData = await res.json();
                if (errorData.message) errorMsg = errorData.message;
                else if (typeof errorData === 'string') errorMsg = errorData;
            } catch (e) {
                errorMsg = await res.text() || errorMsg;
            }
            throw new Error(errorMsg);
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

// Forms
document.getElementById('form-aluno').addEventListener('submit', async (e) => {
    e.preventDefault();
    await apiCall('/alunos', 'POST', {
        nomeCompleto: document.getElementById('aluno-nome').value,
        email: document.getElementById('aluno-email').value,
        cpf: document.getElementById('aluno-cpf').value
    });
    showToast('Aluno cadastrado!');
    e.target.reset();
    loadListas();
});

document.getElementById('form-professor').addEventListener('submit', async (e) => {
    e.preventDefault();
    await apiCall('/professores', 'POST', {
        nomeCompleto: document.getElementById('prof-nome').value,
        email: document.getElementById('prof-email').value,
        cpf: document.getElementById('prof-cpf').value
    });
    showToast('Professor cadastrado!');
    e.target.reset();
    loadListas();
});

document.getElementById('form-disciplina').addEventListener('submit', async (e) => {
    e.preventDefault();
    await apiCall('/disciplinas', 'POST', {
        nome: document.getElementById('disc-nome').value,
        cargaHoraria: parseInt(document.getElementById('disc-carga').value),
        professor: { id: parseInt(document.getElementById('disc-prof-id').value) }
    });
    showToast('Disciplina cadastrada!');
    e.target.reset();
    loadListas();
});

document.getElementById('form-matricula').addEventListener('submit', async (e) => {
    e.preventDefault();
    await apiCall('/matriculas', 'POST', {
        aluno: { id: parseInt(document.getElementById('mat-aluno-id').value) },
        disciplina: { id: parseInt(document.getElementById('mat-disc-id').value) }
    });
    showToast('Matrícula realizada!');
    e.target.reset();
    loadMatriculas();
});

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
    loadMatriculas();
});

document.getElementById('form-trancar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('trancar-mat-id').value;
    await apiCall(`/matriculas/trancar/${id}`, 'PATCH');
    showToast('Matrícula trancada com sucesso!');
    e.target.reset();
    loadMatriculas();
});

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
