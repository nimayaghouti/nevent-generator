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
    <>
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
      <div className="iframe-container">
        <a
          href="https://playground.nostr.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nostr Playground
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g id="Interface / External_Link">
                <path
                  id="Vector"
                  d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </g>
          </svg>
        </a>
        <iframe
          src="https://playground.nostr.com/"
          title="Nostr Playground"
        ></iframe>
      </div>
    </>
  );
}
