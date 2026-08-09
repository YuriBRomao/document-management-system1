import DownloadButton from './DownloadButton';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>Nome</th>
          <th style={thStyle}>Tamanho</th>
          <th style={thStyle}>Usuário</th>
          <th style={thStyle}>Data</th>
          <th style={thStyle}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td style={tdStyle}>{doc.originalName}</td>
            <td style={tdStyle}>{formatBytes(doc.size)}</td>
            <td style={tdStyle}>{doc.owner}</td>
            <td style={tdStyle}>{new Date(doc.uploadedAt).toLocaleString('pt-BR')}</td>
            <td style={tdStyle}>
              <DownloadButton id={doc.id} originalName={doc.originalName} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = { textAlign: 'left', borderBottom: '2px solid #ccc', padding: '8px' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '8px' };
