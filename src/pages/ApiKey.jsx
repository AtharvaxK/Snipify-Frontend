import React, { useState } from 'react';
import { apiKeyAPI } from '../api';
import Button from '../components/Button';
import { Alert } from '../components/Alert';

const API_BASE = 'http://localhost:8080';
const LANGUAGES = ['cURL', 'JavaScript', 'Python', 'Java'];

function buildSnippets(apiKey) {
  const key = apiKey || 'snipify/your-key-here';
  const url = `${API_BASE}/generate`;
  const body = `{
  "url": "https://example.com",
  "validTime": 1440
}`;

  return {
    cURL: `curl -X POST ${url} \\
  -H "X-API-KEY: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "validTime": 1440
  }'`,

    JavaScript: `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "X-API-KEY": "${key}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://example.com",
    validTime: 1440
  })
});

const shortUrl = await response.text();
console.log(shortUrl);`,

    Python: `import requests

response = requests.post(
    "${url}",
    headers={
        "X-API-KEY": "${key}",
        "Content-Type": "application/json"
    },
    json={
        "url": "https://example.com",
        "validTime": 1440
    }
)

print(response.text)`,

    Java: `HttpClient client = HttpClient.newHttpClient();

String body = """
${body}
""";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${url}"))
    .header("X-API-KEY", "${key}")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(
    request,
    HttpResponse.BodyHandlers.ofString()
);

System.out.println(response.body());`,
  };
}

export default function ApiKey() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('cURL');
  const [snippetCopied, setSnippetCopied] = useState(false);

  const snippets = buildSnippets(apiKey);

  const handleGenerate = async () => {
    setError(''); setApiKey('');
    setLoading(true);
    try {
      const res = await apiKeyAPI.generate();
      setApiKey(res.data?.apiKey || '');
    } catch (err) {
      setError(err.response?.data || 'Failed to generate API key.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">API Key</h1>
        <p className="text-gray-400 mt-1">Generate a key to use the Snipify API programmatically</p>
      </div>

      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-8">
        <div className="p-4 bg-[#b6ff2e]/5 border border-[#b6ff2e]/20 rounded-xl mb-6">
          <h3 className="text-[#b6ff2e] font-semibold text-sm mb-2">How to use your API key</h3>
          <p className="text-gray-400 text-sm mb-3">
            Send your API key as an <code className="bg-gray-800 text-[#b6ff2e] px-1 py-0.5 rounded text-xs">X-API-KEY</code> header with your requests.
            Copy a snippet below and replace the placeholder key if you have not generated one yet.
          </p>
          <ul className="text-gray-400 text-xs space-y-1 mb-4 list-disc list-inside">
            <li><span className="text-gray-300">POST</span> {API_BASE}/generate</li>
            <li><span className="text-gray-300">url</span> — the long URL to shorten</li>
            <li><span className="text-gray-300">validTime</span> — lifetime in minutes (example: 1440 = 1 day)</li>
            <li>Success response is <span className="text-gray-300">201</span> with the short URL as plain text</li>
          </ul>

          <div className="flex flex-wrap gap-2 mb-3">
            {LANGUAGES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setLang(name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  lang === name
                    ? 'bg-[#b6ff2e] text-[#23262f]'
                    : 'bg-[#23262f] text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="bg-[#23262f] rounded-lg p-3 relative">
            <button
              type="button"
              onClick={copySnippet}
              className="absolute top-2 right-2 px-3 py-1 bg-[#b6ff2e]/10 border border-[#b6ff2e]/30 text-[#b6ff2e] rounded-md text-xs hover:bg-[#b6ff2e]/20 transition-colors"
            >
              {snippetCopied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto pr-16 whitespace-pre-wrap">
              {snippets[lang]}
            </pre>
          </div>
        </div>

        <Alert type="error" message={error} />

        {apiKey ? (
          <div className="mt-4 space-y-4">
            <Alert type="warning" message="⚠ Save this key now! It will not be shown again." />
            <div className="bg-[#23262f] border border-[#b6ff2e]/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Your API Key</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-[#b6ff2e] text-sm font-mono break-all">{apiKey}</code>
                <button
                  onClick={copy}
                  className="shrink-0 px-4 py-2 bg-[#b6ff2e]/10 border border-[#b6ff2e]/30 text-[#b6ff2e] rounded-lg text-sm hover:bg-[#b6ff2e]/20 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              The snippets above now include this key. Copy a template and paste it into your app.
            </p>
            <Button variant="outline" onClick={() => setApiKey('')}>Generate New Key</Button>
          </div>
        ) : (
          <div className="mt-4">
            <Button variant="primary" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : '🔑 Generate API Key'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
