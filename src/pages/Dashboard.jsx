import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend); // Register chart.js components

function Dashboard() {
  const [ip, setIp] = useState('');
  const [url, setUrl] = useState('');
  const [hash, setHash] = useState('');
  const [domain, setDomain] = useState('');
  const [ipResult, setIpResult] = useState(null);
  const [urlResult, setUrlResult] = useState(null);
  const [hashResult, setHashResult] = useState(null);
  const [domainResult, setDomainResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [ipFrequencyData, setIpFrequencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpFrequency = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/stats/ip-frequency');
        const data = response.data;

        const labels = data.map(item => `${item._id.year}-${item._id.month}-${item._id.day}`);
        const counts = data.map(item => item.count);

        setIpFrequencyData({
          labels,
          datasets: [
            {
              label: 'IP Frequency',
              data: counts,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching IP frequency data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIpFrequency();
  }, []);

  const handleCheckIp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/threat/check-ip', { ip });
      setIpResult(res.data);
      setHistory(prevHistory => [...prevHistory, { type: 'IP', value: ip, result: res.data }]);
    } catch (err) {
      console.error(err);
      setIpResult({ error: 'Failed to check IP' });
    }
  };

  const handleCheckUrl = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/threat/check-url', { url });
      setUrlResult(res.data);
      setHistory(prevHistory => [...prevHistory, { type: 'URL', value: url, result: res.data }]);
    } catch (err) {
      console.error(err);
      setUrlResult({ error: 'Failed to check URL' });
    }
  };

  const handleCheckHash = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/threat/check-hash', { hash });
      setHashResult(res.data);
      setHistory(prevHistory => [...prevHistory, { type: 'Hash', value: hash, result: res.data }]);
    } catch (err) {
      console.error(err);
      setHashResult({ error: 'Failed to check hash' });
    }
  };

  const handleCheckDomain = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/threat/check-domain', { domain });
      setDomainResult(res.data);
      setHistory(prevHistory => [...prevHistory, { type: 'Domain', value: domain, result: res.data }]);
    } catch (err) {
      console.error(err);
      setDomainResult({ error: 'Failed to check domain' });
    }
  };

  return (
    <div className="dashboard">
      <div class="sidebar">
        <div class="logo-container">
          <img src="/src/images/UniThreat_Logo.png" alt="UniThreat Logo" class="logo" />
        </div>
        <ul>
          <li><a href="#ip-lookup">IP Lookup</a></li>
          <li><a href="#url-scan">URL Scan</a></li>
          <li><a href="#hash-analysis">Hash Analysis</a></li>
          <li><a href="#domain-report">Domain Report</a></li>
          <li><a href="#search-history">Search History</a></li>
          <li><a href="#ip-frequency">IP Frequency Stats</a></li>
        </ul>
      </div>
      <div className="main">
        <div className="section" id="ip-lookup">
          <h2 className="subtitle">Check IP (AbuseIPDB)</h2>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP Address"
            className="input"
          />
          <button onClick={handleCheckIp} className="button blue">
            Check IP
          </button>

          {ipResult && (
            <div className="result card">
              {ipResult.error ? (
                <p className="error">{ipResult.error}</p>
              ) : (
                <>
                  <h3>IP Address: <span className="highlight">{ipResult.data.ipAddress}</span></h3>
                  <p><strong>Country:</strong> {ipResult.data.countryCode}</p>
                  <p><strong>ISP:</strong> {ipResult.data.isp}</p>
                  <p><strong>Abuse Score:</strong> <span className="score">{ipResult.data.abuseConfidenceScore}%</span></p>
                  <p><strong>Severity:</strong> {ipResult.severity}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="section" id="url-scan">
          <h2 className="subtitle">Check URL (URLhaus)</h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="input"
          />
          <button onClick={handleCheckUrl} className="button green">
            Check URL
          </button>

          {urlResult && (
            <div className="result card">
              {urlResult.error ? (
                <p className="error">{urlResult.error}</p>
              ) : (
                <>
                  <h3>URL: <span className="highlight">{urlResult.url}</span></h3>
                  <p><strong>Status:</strong> {urlResult.url_status}</p>
                  <p><strong>Threat:</strong> {urlResult.threat}</p>
                  <p><strong>Host:</strong> {urlResult.host}</p>
                  <p><strong>Date Added:</strong> {new Date(urlResult.date_added).toLocaleString()}</p>
                  <p><strong>Reporter:</strong> {urlResult.reporter}</p>
                  <p><strong>URLHaus Reference:</strong> <a href={urlResult.urlhaus_reference} target="_blank" rel="noopener noreferrer" className="link">View Report</a></p>

                  <div>
                    <strong>Tags:</strong>
                    <ul className="tag-list">
                      {urlResult.tags && urlResult.tags.map((tag, index) => (
                        <li key={index} className="tag">{tag}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Blacklists:</strong>
                    <ul>
                      <li><strong>Spamhaus DBL:</strong> {urlResult.blacklists.spamhaus_dbl}</li>
                      <li><strong>SURBL:</strong> {urlResult.blacklists.surbl}</li>
                    </ul>
                  </div>

                  {urlResult.payloads && urlResult.payloads.length > 0 && (
                    <div className="payload-section">
                      <h4>Payload Information</h4>
                      {urlResult.payloads.map((payload, index) => (
                        <div key={index} className="payload">
                          <p><strong>Filename:</strong> {payload.filename}</p>
                          <p><strong>File Type:</strong> {payload.file_type}</p>
                          <p><strong>First Seen:</strong> {payload.firstseen}</p>
                          <p><strong>Response Size:</strong> {payload.response_size} bytes</p>
                          <p><strong>MD5:</strong> {payload.response_md5}</p>
                          <p><strong>SHA256:</strong> {payload.response_sha256}</p>
                          <p><strong>Download:</strong> <a href={payload.urlhaus_download} target="_blank" rel="noopener noreferrer" className="link">Download Payload</a></p>

                          {payload.virustotal && (
                            <div>
                              <p><strong>VirusTotal Detection:</strong> {payload.virustotal.result} ({payload.virustotal.percent}%)</p>
                              <p><strong>VirusTotal Link:</strong> <a href={payload.virustotal.link} target="_blank" rel="noopener noreferrer" className="link">View on VirusTotal</a></p>
                            </div>
                          )}

                          {payload.ssdeep && (
                            <p><strong>SSDEEP:</strong> {payload.ssdeep}</p>
                          )}
                          {payload.tlsh && (
                            <p><strong>TLSH:</strong> {payload.tlsh}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
        <div className="section" id="hash-analysis">
          <h2 className="subtitle">Check Hash (VirusTotal)</h2>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter Hash"
            className="input"
          />
          <button onClick={handleCheckHash} className="button purple">
            Check Hash
          </button>

          {hashResult && (
            <div className="result card">
              {hashResult.error ? (
                <p className="error">{hashResult.error}</p>
              ) : (
                <>
                  <h3>Hash: <span className="highlight">{hashResult.data.hash}</span></h3>
                  <p><strong>Malicious Count:</strong> {hashResult.data.maliciousCount}</p>
                  <p><strong>Severity:</strong> {hashResult.severity}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="section" id="domain-report">
          <h2 className="subtitle">Check Domain (ThreatFox)</h2>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter Domain"
            className="input"
          />
          <button onClick={handleCheckDomain} className="button orange">
            Check Domain
          </button>

          {domainResult && (
            <div className="result card">
              {domainResult.error ? (
                <p className="error">{domainResult.error}</p>
              ) : (
                <>
                  <h3>Domain: <span className="highlight">{domainResult.domain}</span></h3>
                  <p><strong>Threat Score:</strong> {domainResult.threat_score}</p>
                  <p><strong>Severity:</strong> {domainResult.severity}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="section" id="search-history">
          <h2 className="subtitle">Search History</h2>
          <ul className="hostname-list">
            {history.map((entry, index) => (
              <li key={index}>
                <strong>{entry.type}:</strong> {entry.value} <br />
                <span className="highlight">Result:</span> {entry.result ? 'Checked' : 'Failed'}
              </li>
            ))}
          </ul>
        </div>
        <div className="section" id="ip-frequency">
          <h2 className="subtitle">IP Frequency Statistics</h2>
          {loading ? (
            <p>Loading IP Frequency data...</p>
          ) : ipFrequencyData ? (
            <Line data={ipFrequencyData} options={{ responsive: true }} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
