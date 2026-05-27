package br.com.alunoonline.api.service;

import br.com.alunoonline.api.model.Disciplina;
import br.com.alunoonline.api.repository.DisciplinaRepository;
import br.com.alunoonline.api.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DisciplinaService {
    @Autowired
    DisciplinaRepository disciplinaRepository;

    @Autowired
    ProfessorRepository professorRepository;

    public void criarDisciplina(Disciplina disciplina) {
        if (disciplina.getProfessor() != null && disciplina.getProfessor().getId() != null) {
            boolean professorExiste = professorRepository.existsById(disciplina.getProfessor().getId());
            if (!professorExiste) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O Professor informado não existe!");
            }
        }
        disciplinaRepository.save(disciplina);
    }

    public List<Disciplina> listarTodasDisciplinas() {
        return disciplinaRepository.findAll();
    }

    public List<Disciplina> listarDisciplinarDoProf(Long professorId) {
        return disciplinaRepository.findByProfessorId(professorId);
    }
}
