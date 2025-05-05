import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export default function App() {
  const [pubkey, setPubkey] = useState('');
  const [id, setId] = useState('');
  const [kind, setKind] = useState('');
  const [nevent, setNevent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateNevent();
  }, [pubkey, id, kind]);

  const generateNevent = () => {
    setError('');
    setNevent('');

    if (!pubkey || !id || !kind) {
      return;
    }

    try {
      const kindNum = parseInt(kind, 10);

      if (isNaN(kindNum)) {
        setError('Kind must be a valid number');
        return;
      }

      // Create an nevent using nostr-tools
      const neventString = nip19.neventEncode({
        id,
        author: pubkey,
        kind: kindNum,
      });

      setNevent(`nostr:${neventString}`);
    } catch (err) {
      setError(
        'Error generating nevent: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const copyToClipboard = () => {
    if (nevent) {
      navigator.clipboard
        .writeText(nevent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          setError('Failed to copy: ' + err.message);
        });
    }
  };

  return (
    <div className="app-container">
      <h1>Nevent Generator</h1>

      <div className="input-group">
        <label htmlFor="pubkey">Public Key:</label>
        <input
          id="pubkey"
          type="text"
          value={pubkey}
          onChange={e => setPubkey(e.target.value)}
          placeholder="Enter pubkey"
        />
      </div>

      <div className="input-group">
        <label htmlFor="id">ID:</label>
        <input
          id="id"
          type="text"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Enter id"
        />
      </div>

      <div className="input-group">
        <label htmlFor="kind">Kind:</label>
        <input
          id="kind"
          type="number"
          value={kind}
          onChange={e => setKind(e.target.value)}
          placeholder="Enter kind (number)"
        />
      </div>

      {error && <div className="error">{error}</div>}

      {nevent && (
        <div className="result">
          <h2>Generated Nevent:</h2>
          <div className="nevent-container">
            <pre>{nevent}</pre>
            <button onClick={copyToClipboard} className="copy-button">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
