import { useState, useEffect, useCallback } from 'react';
import UploadForm from '../components/UploadForm';
import DocumentList from '../components/DocumentList';
import { listDocuments } from '../services/documentService';

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [loadError, setLoadError] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <UploadForm onUploadSuccess={fetchDocuments} />
      <hr style={{ margin: '2rem 0' }} />
      <h2>Documentos</h2>
      {loadError && <p style={{ color: 'red' }}>{loadError}</p>}
      <DocumentList documents={documents} />
    </main>
  );
}
