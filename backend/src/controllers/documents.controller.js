'use strict';

const path = require('path');
const fs = require('fs');
const documentService = require('../services/documents.service');
const { STORAGE_DIR } = require('../config');

function list(_req, res) {
  return res.json(documentService.listDocuments());
}

async function download(req, res, next) {
  let doc;
  try {
    doc = documentService.getDocumentById(req.params.id);
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({ error: err.message });
  }

  const resolvedStorage = path.resolve(STORAGE_DIR);
  const filePath = path.resolve(resolvedStorage, doc.storedName);

  if (!filePath.startsWith(resolvedStorage + path.sep)) {
    return res.status(400).json({ error: 'Caminho de arquivo inválido' });
  }

  try {
    await fs.promises.access(filePath);
  } catch {
    return res.status(404).json({ error: 'Arquivo físico não encontrado' });
  }

  res.download(filePath, doc.originalName, (err) => {
    if (err) next(err);
  });
}

module.exports = { list, download };
