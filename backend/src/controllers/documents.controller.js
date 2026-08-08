'use strict';

const path = require('path');
const documentService = require('../services/documents.service');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

function list(_req, res) {
  return res.json(documentService.listDocuments());
}

function download(req, res) {
  let doc;
  try {
    doc = documentService.getDocumentById(req.params.id);
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({ error: err.message });
  }

  const filePath = path.join(STORAGE_DIR, doc.storedName);
  res.download(filePath, doc.originalName);
}

module.exports = { list, download };
