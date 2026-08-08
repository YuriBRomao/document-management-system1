'use strict';

const documentService = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const owner = req.body.owner || req.query.owner || 'anonymous';
  const doc = documentService.createDocument(req.file, owner);
  return res.status(201).json(doc);
}

module.exports = { upload };
