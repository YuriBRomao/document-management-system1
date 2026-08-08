import { useState } from 'react';
import { downloadDocument } from '../services/documentService';

export default function DownloadButton({ id, originalName }) {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDownload() {
    setStatus('loading');
    setErrorMessage('');

    try {
      await downloadDocument(id, originalName);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleDownload} disabled={status === 'loading'}>
        {status === 'loading' ? 'Baixando...' : 'Baixar'}
      </button>
      {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
