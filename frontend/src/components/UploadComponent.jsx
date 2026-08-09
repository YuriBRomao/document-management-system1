import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await uploadDocument(file, owner || 'anonymous');
      setFile(null);
      setOwner('');
      event.target.reset();
      setStatus('idle');
      onUploadSuccess();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar documento</h2>
      <div>
        <label htmlFor="upload-file">Arquivo</label>
        <input
          id="upload-file"
          type="file"
          required
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label htmlFor="upload-owner">Usuario (opcional)</label>
        <input
          id="upload-owner"
          type="text"
          value={owner}
          placeholder="anonymous"
          onChange={(event) => setOwner(event.target.value)}
        />
      </div>

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar'}
      </button>

      {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}
