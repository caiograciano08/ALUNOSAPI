# 🎓 AlunoOnline API

API para gerenciamento de alunos e professores, desenvolvida para facilitar o controle acadêmico de instituições de ensino. O projeto permite realizar o CRUD completo de estudantes e docentes através de uma interface REST.

---

## 🚀 Tecnologias Utilizadas

* **Java 17**
* **Spring Boot 3**
* **Spring Data JPA** (Persistência de dados)
* **Lombok** (Produtividade com anotações)
* **H2 Database / MySQL / PostgreSQL** (Suporte a diversos bancos de dados)
* **Maven** (Gerenciador de dependências)

---

## 🏗️ Arquitetura do Projeto

O projeto segue o padrão de arquitetura **MVC (Model-View-Controller)**, focado na camada de serviço para desacoplamento:

1.  **Model**: Representa as entidades do banco de dados (Ex: `Aluno`, `Professor`).
2.  **Repository**: Interface que estende o `JpaRepository`, responsável pelas consultas ao banco de dados.
3.  **Service**: Camada de regra de negócio, onde a lógica de processamento é executada antes de salvar ou retornar dados.
4.  **Controller**: Camada de exposição da API, responsável por receber as requisições HTTP e retornar as respostas ao cliente.

---

## 🛠️ Detalhamento do Código

A API disponibiliza os seguintes endpoints para **Alunos** e **Professores**:

| Funcionalidade | Verbo HTTP | Endpoint |
| :--- | :--- | :--- |
| Criar Novo | `POST` | `/alunos` ou `/professores` |
| Listar Todos | `GET` | `/alunos` ou `/professores` |
| Buscar por ID | `GET` | `/alunos/{id}` ou `/professores/{id}` |
| Atualizar | `PUT` | `/alunos/{id}` ou `/professores/{id}` |
| Deletar | `DELETE` | `/alunos/{id}` ou `/professores/{id}` |

---

## 📸 Demonstração das Requisições (Insomnia)

Nesta seção, estão os testes realizados durante o desenvolvimento.

### 1. Criar Registro (POST)
<img width="1920" height="1080" alt="Screenshot_41" src="https://github.com/user-attachments/assets/5733b5a9-b304-4163-bc44-b2911472af48" />

### 2. Listar Todos (GET)
<img width="1920" height="1080" alt="Screenshot_44" src="https://github.com/user-attachments/assets/139228a1-7ab6-4649-91e9-6df77e73189d" />

### 3. Atualizar Registro (PUT)
<img width="1920" height="1080" alt="Screenshot_45" src="https://github.com/user-attachments/assets/ee5bbe41-519e-471a-9b7e-049e9f74a749" />


### 4. Deletar Registro (DELETE)
<img width="1920" height="1080" alt="Screenshot_46" src="https://github.com/user-attachments/assets/9ef2e808-c458-4809-87e3-177b232f7930" />

### 5. Buscar por Id (GET)
<img width="1920" height="1080" alt="Screenshot_47" src="https://github.com/user-attachments/assets/2d825bed-0540-4bb0-ac10-cf06ce920e14" />


---

## 🗄️ Banco de Dados (DBeaver)

Visualização das tabelas e dados persistidos no banco de dados após os testes das rotas.

### Tabela de Alunos
<img width="1920" height="1080" alt="Screenshot_49" src="https://github.com/user-attachments/assets/e1939dab-925b-4df8-bf3d-7bd62def450c" />


### Tabela de Professores
<img width="1920" height="1080" alt="Screenshot_50" src="https://github.com/user-attachments/assets/af27a1c7-b3ce-4506-a5a1-465abcc468ab" />

---

## 🔧 Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiograciano08/ALUNOSAPI.git
   ```
2. Importe o projeto na sua IDE (IntelliJ ou Eclipse).
3. Aguarde o Maven baixar as dependências.
4. Execute a classe `ApiApplication.java`.
5. A API estará disponível em `http://localhost:8080`.

---
