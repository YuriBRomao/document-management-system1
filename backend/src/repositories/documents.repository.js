'use strict';

// Armazenamento em memória — perdido ao reiniciar o servidor (fase inicial).
const documents = [];

function save(doc) {
  documents.push(doc);
  return doc;
}

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((doc) => doc.id === id) ?? null;
}

module.exports = { save, findAll, findById };
