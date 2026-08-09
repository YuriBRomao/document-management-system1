---
description: Revisa uma camada backend (route, controller, service, repository) e sugere melhorias.
name: revisar-camada
argument-hint: nome do recurso (ex. documents)
agent: agent
---

# Revisão de camada do backend

Revise a camada completa do recurso ${input:recurso:nome do recurso} em backend/src, considerando:

1. Fluxo correto entre camadas:
- routes -> controllers -> services -> repositories
- Sem inversão de dependência entre camadas

2. Responsabilidades:
- Route define endpoint e delega
- Controller valida entrada e monta resposta HTTP
- Service concentra regra de negócio
- Repository cuida da persistência

3. Tratamento de erros:
- Erros tratados nos limites HTTP
- Respostas consistentes para sucesso e falha
- Mensagens claras para o cliente

4. Regras do projeto:
- Sem overengineering
- Código simples e legível
- SOLID, DRY, KISS, YAGNI
- 12-Factor para configuração

5. Upload e persistência:
- Upload via multer com diskStorage local
- Arquivos em backend/storage
- Metadados em memória nesta fase

Saída esperada:
- Lista de problemas encontrados por severidade (alta, média, baixa)
- Trechos de código sugeridos para correção
- Checklist final de conformidade da camada
- Sugestão de testes faltantes em backend/test