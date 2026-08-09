'use strict';

const documentService = require('../services/documents.service');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const ownerInput = req.body?.owner ?? req.query?.owner;
  const doc = documentService.createDocument(req.file, ownerInput);
  return res.status(201).json(doc);
}

module.exports = { upload };
