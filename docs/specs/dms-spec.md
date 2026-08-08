## Plan: Especificação Completa DMS

Vou gerar a especificação completa usando o modelo em spec-template.md, com foco em requisitos verificáveis, contratos de API consistentes e aderência explícita à Clean Architecture simples e ao storage local com multer.

**Steps**
1. Fase 1 - Consolidação de contexto: validar requisitos do template e terminologia real do projeto (backend + frontend).
2. Fase 1 - Baseline contratual: fixar contrato alvo dos endpoints POST /upload, GET /documents e GET /documents/:id/download.
3. Fase 2 - Requisitos funcionais: redigir RF-01 a RF-07 com critérios de aceite objetivos e testáveis.
4. Fase 2 - Requisitos não funcionais: explicitar constraints de arquitetura em camadas, 12-Factor e armazenamento local com multer diskStorage.
5. Fase 2 - Modelo de dados: padronizar campos, tipos e obrigatoriedade dos metadados do documento.
6. Fase 3 - Contratos de API: detalhar entradas, saídas, status codes e formato de erro por endpoint.
7. Fase 3 - Decisões arquiteturais: consolidar responsabilidades por camada e fluxo de dependência routes -> controllers -> services -> repositories.
8. Fase 4 - Plano de execução: organizar implementação incremental com backend, testes e integração frontend.
9. Fase 4 - Revisão final: checar rastreabilidade completa entre RF/RNF, modelo de dados, contratos e etapas.

**Relevant files**
- spec-template.md - estrutura base da especificação.
- app.js - health endpoint e configuração de aplicação.
- uploadRoutes.js - upload com multer diskStorage.
- documentRoutes.js - rotas de listagem e download.
- uploadController.js - validações e respostas HTTP de upload.
- documentController.js - listagem/download e mapeamento de erro.
- documentService.js - regras de negócio de documentos.
- documentRepository.js - metadados em memória.
- documentService.js - expectativas de contrato no consumo da API.
- app.test.js - cobertura comportamental atual.

**Verification**
1. Cada RF deve ter critério de aceite mensurável.
2. RNF de arquitetura e storage local devem aparecer explicitamente nas seções técnicas.
3. Endpoints e verbos devem bater com as rotas reais do backend.
4. Campos do modelo devem estar coerentes com os payloads dos contratos.
5. Plano de execução deve cobrir ponta a ponta: upload, listagem e download.

**Decisions**
- A especificação será normativa (estado alvo), não apenas descritiva do estado atual.
- Owner permanece obrigatório no contrato de upload.
- Health endpoint fica como requisito opcional operacional.
- Escopo inclui upload, listagem, download, vínculo por owner e erros padronizados.
- Escopo exclui storage externo e versionamento.

Esse plano já foi salvo em memória de sessão em /memories/session/plan.md.  
Se você aprovar, no próximo passo eu te entrego a versão final da especificação pronta para uso, já consolidada seção por seção.