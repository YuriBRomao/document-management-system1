import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/documentService';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDocuments = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await listDocuments();
      setDocuments(response);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1>Document Management System</h1>

      <UploadComponent onUploadSuccess={fetchDocuments} />

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Documentos</h2>
        {status === 'loading' && <p>Carregando documentos...</p>}
        {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {status !== 'loading' && <DocumentList documents={documents} />}
      </section>
    </main>
  );
}
