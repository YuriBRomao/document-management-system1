'use strict';

const documentService = require('../services/documents.service');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const rawOwner = req.body.owner || req.query.owner || 'anonymous';
  const owner = String(rawOwner).trim().slice(0, 100) || 'anonymous';
  const doc = documentService.createDocument(req.file, owner);
  return res.status(201).json(doc);
}

module.exports = { upload };
