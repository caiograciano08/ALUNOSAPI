package br.com.alunoonline.api.controller;

import br.com.alunoonline.api.model.Aluno;
import br.com.alunoonline.api.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/alunos") // Define a rota principal para este controller
public class AlunoController {

    @Autowired
    AlunoService alunoService;

    // 1. Criar (POST)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criarAluno(@RequestBody Aluno aluno) {
        alunoService.criarAluno(aluno);
    }

    // 2. Listar Todos (GET)
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Aluno> listarTodosAlunos() {
        return alunoService.listarTodosAlunos();
    }

    // 3. Buscar por ID (GET com variável na rota)
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Aluno> buscarAlunoPorId(@PathVariable Long id) {
        return alunoService.buscarAlunoPorId(id);
    }

    // 4. Atualizar (PUT)
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarAlunoPorId(@PathVariable Long id, @RequestBody Aluno aluno) {
        alunoService.atualizarAlunoPorId(id, aluno);
    }

    // 5. Deletar (DELETE)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarAlunoPorId(@PathVariable Long id) {
        alunoService.deletarAlunoPorId(id);
    }
}