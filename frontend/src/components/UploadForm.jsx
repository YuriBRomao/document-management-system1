import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setStatus('loading');
    setErrorMsg('');
    try {
      await uploadDocument(file, owner || 'anonymous');
      setFile(null);
      setOwner('');
      e.target.reset();
      setStatus(null);
      onUploadSuccess();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar documento</h2>
      <div>
        <label>
          Arquivo
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
      </div>
      <div>
        <label>
          Usuário (opcional)
          <input
            type="text"
            value={owner}
            placeholder="anonymous"
            onChange={(e) => setOwner(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando…' : 'Enviar'}
      </button>
      {status === 'error' && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </form>
  );
}
