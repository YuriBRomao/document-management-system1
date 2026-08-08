const API_PREFIX = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_PREFIX}${path}`, options);

  if (!response.ok) {
    let message = `Erro na requisicao: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Mantem mensagem padrao quando o backend nao retorna JSON.
    }

    throw new Error(message);
  }

  return response;
}

export async function get(path) {
  const response = await request(path);
  return response.json();
}

export async function post(path, body) {
  const response = await request(path, { method: 'POST', body });
  return response.json();
}

export async function getBlob(path) {
  const response = await request(path);
  return response.blob();
}
