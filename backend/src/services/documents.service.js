'use strict';

const { randomUUID } = require('crypto');
const repository = require('../repositories/documents.repository');

function normalizeOwner(ownerInput) {
  const normalizedOwner = String(ownerInput ?? '').trim().slice(0, 100);
  return normalizedOwner || 'anonymous';
}

function buildDocumentEntity(fileInfo, owner) {
  return {
    id: randomUUID(),
    originalName: fileInfo.originalname,
    storedName: fileInfo.filename,
    mimeType: fileInfo.mimetype,
    size: fileInfo.size,
    uploadedAt: new Date().toISOString(),
    owner,
  };
}

function ensureDocumentExists(doc) {
  if (doc) {
    return doc;
  }

  const err = new Error('Documento não encontrado');
  err.statusCode = 404;
  throw err;
}

function createDocument(fileInfo, ownerInput) {
  const owner = normalizeOwner(ownerInput);
  const doc = buildDocumentEntity(fileInfo, owner);
  return repository.save(doc);
}

function listDocuments() {
  return repository.findAll();
}

function getDocumentById(id) {
  return ensureDocumentExists(repository.findById(id));
}

module.exports = { createDocument, listDocuments, getDocumentById };
