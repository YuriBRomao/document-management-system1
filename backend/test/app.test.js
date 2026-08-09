const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const path = require('path');
const fs = require('fs');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test('o app backend é exportado', () => {
  assert.ok(app);
  assert.strictEqual(typeof app, 'function');
});

test('GET /health retorna status ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
});

test('POST /upload sem arquivo retorna 400', async () => {
  const form = new FormData();
  const res = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.ok(body.error);
});

test('POST /upload com arquivo retorna 201 e metadados', async () => {
  const form = new FormData();
  const content = Buffer.from('conteúdo de teste');
  form.append('file', new Blob([content], { type: 'text/plain' }), 'teste.txt');
  form.append('owner', 'usuario-teste');

  const res = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  assert.strictEqual(res.status, 201);

  const doc = await res.json();
  assert.ok(doc.id);
  assert.strictEqual(doc.originalName, 'teste.txt');
  assert.strictEqual(doc.owner, 'usuario-teste');
  assert.strictEqual(doc.mimeType, 'text/plain');
  assert.ok(doc.uploadedAt);

  // armazena id para os testes seguintes
  process.env._TEST_DOC_ID = doc.id;
  process.env._TEST_STORED = doc.storedName;
});

test('GET /documents retorna lista com ao menos um documento', async () => {
  const res = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(res.status, 200);
  const docs = await res.json();
  assert.ok(Array.isArray(docs));
  assert.ok(docs.length >= 1);
});

test('GET /documents/:id/download retorna conteúdo do arquivo', async () => {
  const id = process.env._TEST_DOC_ID;
  assert.ok(id, 'id deve ter sido definido pelo teste de upload');

  const res = await fetch(`${baseUrl}/documents/${id}/download`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.ok(text.includes('conteúdo de teste'));
});

test('GET /documents/:id/download com id inválido retorna 404', async () => {
  const res = await fetch(`${baseUrl}/documents/id-inexistente/download`);
  assert.strictEqual(res.status, 404);
  const body = await res.json();
  assert.ok(body.error);
});

after(async () => {
  // limpa arquivo de teste gravado em storage
  const stored = process.env._TEST_STORED;
  if (stored) {
    const filePath = path.join(__dirname, '..', 'storage', stored);
    fs.rmSync(filePath, { force: true });
  }
});
