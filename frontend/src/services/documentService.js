import { get, getBlob, post } from './apiClient';

export async function uploadDocument(file, owner = 'anonymous') {
  const form = new FormData();
  form.append('file', file);
  form.append('owner', owner);

  return post('/upload', form);
}

export async function listDocuments() {
  return get('/documents');
}

export async function downloadDocument(id, originalName) {
  const blob = await getBlob(`/documents/${id}/download`);
  const url = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = originalName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(url);
  }
}
