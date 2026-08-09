'use strict';

const { randomUUID } = require('crypto');
const repository = require('../repositories/documents.repository');

function createDocument(fileInfo, owner = 'anonymous') {
  const doc = {
    id: randomUUID(),
    originalName: fileInfo.originalname,
    storedName: fileInfo.filename,
    mimeType: fileInfo.mimetype,
    size: fileInfo.size,
    uploadedAt: new Date().toISOString(),
    owner,
  };
  return repository.save(doc);
}

function listDocuments() {
  return repository.findAll();
}

function getDocumentById(id) {
  const doc = repository.findById(id);
  if (!doc) {
    const err = new Error('Documento não encontrado');
    err.statusCode = 404;
    throw err;
  }
  return doc;
}

module.exports = { createDocument, listDocuments, getDocumentById };
