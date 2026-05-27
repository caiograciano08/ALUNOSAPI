const API_URL = 'http://localhost:8080';

// Fetch Dropdowns Dynamically
async function loadProfessores() {
    try {
        const professores = await apiCall('/professores', 'GET');
        const select = document.getElementById('disc-prof-id');
        select.innerHTML = '<option value="" disabled selected>Selecione o Professor</option>';
        if (Array.isArray(professores)) {
            professores.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nomeCompleto} (CPF: ${p.cpf})</option>`;
            });
        }
    } catch(e) { console.error("Erro ao carregar professores:", e); }
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
                alunosHtml += `<option value="${a.id}">${a.nomeCompleto} (CPF: ${a.cpf})</option>`;
            });
        }
        selectAlunoMat.innerHTML = alunosHtml;
        selectAlunoHist.innerHTML = alunosHtml;

        let discHtml = '<option value="" disabled selected>Selecione a Disciplina</option>';
        if (Array.isArray(disciplinas)) {
            disciplinas.forEach(d => {
                discHtml += `<option value="${d.id}">${d.nome} (Carga: ${d.cargaHoraria}h)</option>`;
            });
        }
        selectDiscMat.innerHTML = discHtml;

    } catch(e) { console.error("Erro ao carregar alunos/disciplinas:", e); }
}

async function loadMatriculas() {
    try {
        const matriculas = await apiCall('/matriculas', 'GET');
        const select = document.getElementById('nota-mat-id');
        select.innerHTML = '<option value="" disabled selected>Selecione a Matrícula</option>';
        if (Array.isArray(matriculas)) {
            matriculas.forEach(m => {
                const alunoNome = m.aluno ? m.aluno.nomeCompleto : 'Sem Nome';
                const discNome = m.disciplina ? m.disciplina.nome : 'Sem Disciplina';
                select.innerHTML += `<option value="${m.id}">${alunoNome} - ${discNome} (${m.status})</option>`;
            });
        }
    } catch(e) { console.error("Erro ao carregar matrículas:", e); }
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const target = e.target.dataset.target;
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        
        // Load data dynamically based on view
        if (target === 'disciplinas') loadProfessores();
        if (target === 'matriculas') {
            loadAlunosAndDisciplinas();
            loadMatriculas();
        }
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
    loadMatriculas(); // Reload the mat list for notes
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
    loadMatriculas(); // To update the select dropdown display name if status changed
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
