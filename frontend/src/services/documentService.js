const API_BASE = '/api';

export async function uploadDocument(file, owner = 'anonymous') {
  const form = new FormData();
  form.append('file', file);
  form.append('owner', owner);

  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro no upload: ${res.status}`);
  }
  return res.json();
}

export async function listDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error(`Erro ao listar documentos: ${res.status}`);
  return res.json();
}

export function getDownloadUrl(id) {
  return `${API_BASE}/documents/${id}/download`;
}
