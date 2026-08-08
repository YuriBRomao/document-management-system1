# Especificação - Document Management System

> Modelo de especificação (spec) para orientar o desenvolvimento guiado por
> especificação (Spec Driven Development). Preencha cada seção com o apoio do
> Plan Mode do GitHub Copilot durante o Passo 1.

## 1. Objetivo

Entregar um sistema web simples e evolutivo para upload, listagem e download de documentos por usuário, com arquivos salvos localmente e metadados mantidos em memória.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos

## 3. Requisitos funcionais

| ID    | Requisito                                                                 | Critério de aceite                                                                 |
| ----- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| RF-01 | O usuário pode enviar um documento                                        | Ao enviar multipart/form-data com arquivo válido, o sistema retorna metadados e id |
| RF-02 | O usuário pode listar os documentos enviados                              | A listagem retorna coleção de metadados com filtro por owner quando informado      |
| RF-03 | O usuário pode baixar um documento pelo identificador                     | Ao informar id existente, o sistema retorna o arquivo para download                 |
| RF-04 | O sistema associa cada documento a um usuário (owner)                     | Cada metadado persistido em memória contém owner preenchido                         |
| RF-05 | O sistema valida entradas obrigatórias no limite HTTP                     | Requisições sem arquivo ou sem owner retornam erro 400 com mensagem clara           |
| RF-06 | O sistema informa erro quando documento não existe para download          | Download com id inexistente retorna 404                                             |
| RF-07 | O sistema expõe endpoint de saúde da aplicação (opcional para operação)  | Endpoint de health responde 200 quando aplicação está disponível                    |

## 4. Requisitos não funcionais

| ID     | Requisito                                                                          |
| ------ | ---------------------------------------------------------------------------------- |
| RNF-01 | Arquivos gravados no filesystem local via multer (diskStorage) em backend/storage |
| RNF-02 | Metadados mantidos em memória nesta fase (sem banco de dados)                     |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)                                |
| RNF-04 | Estrutura backend em Clean Architecture simples: routes -> controllers -> services -> repositories |
| RNF-05 | Tratamento de erros nos limites do sistema com respostas HTTP consistentes         |
| RNF-06 | Código em JavaScript (CommonJS no backend e ESM no frontend), sem TypeScript       |
| RNF-07 | Solução deve permanecer simples e evolutiva, evitando overengineering              |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Obrigatório | Exemplo                          | Descrição                                        |
| ------------ | ------ | ----------- | -------------------------------- | ------------------------------------------------ |
| id           | string | Sim         | doc_1723113569123_a8f1           | Identificador único do documento                 |
| originalName | string | Sim         | contrato-social.pdf              | Nome original do arquivo enviado                 |
| filename     | string | Sim         | 1723113569123-contrato-social.pdf| Nome físico salvo no storage local               |
| mimetype     | string | Sim         | application/pdf                  | Tipo MIME reportado no upload                    |
| size         | number | Sim         | 245123                           | Tamanho em bytes                                 |
| uploadedAt   | string | Sim         | 2026-08-08T15:04:23.521Z         | Data/hora do upload em ISO 8601                  |
| owner        | string | Sim         | user-123                         | Identificador do usuário dono                    |
| path         | string | Sim         | backend/storage/1723...-arquivo  | Caminho local do arquivo para leitura/download   |

Observações de modelo:

- Os metadados vivem em memória e são reiniciados quando o processo sobe novamente.
- O arquivo físico permanece no filesystem local até remoção manual ou futura funcionalidade de exclusão.

## 6. Contratos de API

### POST /upload

- Objetivo: receber arquivo e registrar metadados do documento.
- Content-Type: multipart/form-data
- Campos esperados:
	- file (arquivo): obrigatório
	- owner (string): obrigatório
- Resposta de sucesso:
	- Status: 201 Created
	- Body (JSON):

```json
{
	"id": "doc_1723113569123_a8f1",
	"originalName": "contrato-social.pdf",
	"filename": "1723113569123-contrato-social.pdf",
	"mimetype": "application/pdf",
	"size": 245123,
	"uploadedAt": "2026-08-08T15:04:23.521Z",
	"owner": "user-123"
}
```

- Erros esperados:
	- 400 Bad Request: arquivo ausente, owner ausente ou inválido
	- 500 Internal Server Error: falha no salvamento local ou processamento

### GET /documents

- Objetivo: listar metadados dos documentos cadastrados.
- Query params:
	- owner (string): opcional; quando informado, filtra documentos do usuário
- Resposta de sucesso:
	- Status: 200 OK
	- Body (JSON):

```json
[
	{
		"id": "doc_1723113569123_a8f1",
		"originalName": "contrato-social.pdf",
		"filename": "1723113569123-contrato-social.pdf",
		"mimetype": "application/pdf",
		"size": 245123,
		"uploadedAt": "2026-08-08T15:04:23.521Z",
		"owner": "user-123"
	}
]
```

- Erros esperados:
	- 500 Internal Server Error: falha de leitura de metadados em memória

### GET /documents/:id/download

- Objetivo: baixar um documento pelo identificador.
- Path params:
	- id (string): obrigatório
- Resposta de sucesso:
	- Status: 200 OK
	- Headers:
		- Content-Type: conforme mimetype do arquivo
		- Content-Disposition: attachment; filename="<originalName>"
	- Body: conteúdo binário do arquivo

- Erros esperados:
	- 404 Not Found: documento não encontrado por id
	- 410 Gone (opcional): metadado existe, mas arquivo local foi removido
	- 500 Internal Server Error: erro inesperado no stream/download

### Formato padrão de erro (recomendado)

```json
{
	"error": "BadRequest",
	"message": "Campo owner é obrigatório"
}
```

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples (routes, controllers, services, repositories)
- Frontend baseado em componentes (React)
- Armazenamento local apenas

Detalhamento por camada (backend/src):

- routes/: define endpoints HTTP, aplica middlewares de rota e delega para controllers.
- controllers/: valida entrada HTTP, converte request/response e chama serviços.
- services/: implementa regras de negócio (geração de id, metadados, filtros, validações de domínio).
- repositories/: gerencia persistência de metadados em memória e consultas por id/owner.

Regras de dependência:

- Fluxo obrigatório: routes -> controllers -> services -> repositories.
- Camadas internas não dependem de detalhes de HTTP ou framework.
- A escrita de arquivo local é tratada no boundary de upload (multer) e os metadados seguem para o serviço.

## 8. Plano de execução

Liste as etapas na ordem de implementação (gerado no Passo 1).

1. Preparar configuração e base da aplicação
2. Configurar variáveis de ambiente essenciais (porta, pasta de storage)
3. Garantir existência de backend/storage e configuração do multer com diskStorage
4. Implementar repositório em memória para metadados (save, findAll, findById, findByOwner)
5. Implementar serviço de documentos (criação de metadados, listagem e busca para download)
6. Implementar controllers com validação de entrada e mapeamento de erros HTTP
7. Implementar rotas: POST /upload, GET /documents, GET /documents/:id/download
8. Integrar stream/download de arquivo físico usando path salvo em metadados
9. Padronizar respostas de erro e mensagens para cliente
10. Implementar testes backend (node:test) para fluxos de sucesso e falhas principais
11. Integrar frontend (UploadForm, DocumentList, DownloadButton) com API via /api
12. Validar fluxo ponta a ponta (upload -> listagem -> download) e revisar regressões
