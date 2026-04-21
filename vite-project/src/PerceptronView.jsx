function PerceptronView({ onNavigate }) {
  const [lr, setLr] = useState(0.1);
  const [epochs, setEpochs] = useState(10);
  const [w1, setW1] = useState(0.0);
  const [w2, setW2] = useState(0.0);
  const [b, setBias] = useState(0.0);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Dynamic column names — updated when CSV is uploaded
  const [colNames, setColNames] = useState(['Study Hours', 'Attendance', 'Pass?']);

  const [testX1, setTestX1] = useState('');
  const [testX2, setTestX2] = useState('');
  const [testResult, setTestResult] = useState(null);

  // Visualization animation state
  const [vizEpoch, setVizEpoch] = useState(null); // current epoch index shown
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizTimerRef = useRef(null);

  // Clean up any running timer
  const stopVizTimer = useCallback(() => {
    if (vizTimerRef.current) {
      clearInterval(vizTimerRef.current);
      vizTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopVizTimer, [stopVizTimer]); // cleanup on unmount

  const startVizPlay = useCallback((fromEpoch, totalEpochs, delay) => {
    stopVizTimer();
    setVizPlaying(true);
    let cur = fromEpoch;
    vizTimerRef.current = setInterval(() => {
      cur++;
      if (cur >= totalEpochs) {
        clearInterval(vizTimerRef.current);
        vizTimerRef.current = null;
        setVizPlaying(false);
        setVizEpoch(totalEpochs - 1);
      } else {
        setVizEpoch(cur);
      }
    }, delay);
  }, [stopVizTimer]);

  const handleManualPredict = () => {
    if (!results) return;
    const v1 = parseFloat(testX1);
    const v2 = parseFloat(testX2);
    if (isNaN(v1) || isNaN(v2)) return;

    // Mirror the backend's Min-Max scaling:
    // The backend normalises features before training, so we must apply the
    // same normalisation here using the bounds of the current dataset.
    const isDefault = data.length <= 6;
    const x1_arr = data.map(r => r[0]);
    const x2_arr = data.map(r => r[1]);

    // For the default 6-row sample the backend falls back to its own 100-row
    // synthetic generator with known bounds (hours 0-10, attendance 50-100).
    const min1 = isDefault ? 0 : Math.min(...x1_arr);
    const max1 = isDefault ? 10 : Math.max(...x1_arr);
    const min2 = isDefault ? 50 : Math.min(...x2_arr);
    const max2 = isDefault ? 100 : Math.max(...x2_arr);

    const diff1 = max1 - min1 || 1;
    const diff2 = max2 - min2 || 1;

    const x1_scaled = (v1 - min1) / diff1;
    const x2_scaled = (v2 - min2) / diff2;

    const fw1 = results.final_weights[0];
    const fw2 = results.final_weights[1];
    const fb = results.final_bias;
    const y = (fw1 * x1_scaled) + (fw2 * x2_scaled) + fb;

    console.log(`[Debug] Raw: ${colNames[0]}=${v1}, ${colNames[1]}=${v2}`);
    console.log(`[Debug] Scaled: x1=${x1_scaled.toFixed(3)}, x2=${x2_scaled.toFixed(3)}`);
    console.log(`[Debug] Pre-activation y:`, y);

    setTestResult(y >= 0 ? 1 : 0);
  };

  const initialData = [
    [2, 50, 0],
    [3, 60, 0],
    [5, 70, 1],
    [7, 80, 1],
    [1, 40, 0],
    [8, 90, 1],
  ];

  const [data, setData] = useState(initialData);

  const handleTrain = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("http://localhost:8000/perceptron/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data,
          learning_rate: parseFloat(lr),
          epochs: parseInt(epochs),
          weights: [parseFloat(w1), parseFloat(w2)],
          bias: parseFloat(b)
        })
      });
      const resData = await res.json();
      setResults(resData);
      // Kick off visualization – auto-play with justified delay
      setVizEpoch(0);
      const totalEps = resData.loss_per_epoch?.length ?? 1;
      const delay = Math.max(300, Math.min(1200, Math.round(8000 / totalEps)));
      startVizPlay(0, totalEps, delay);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const header = colNames.join(',');
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "perceptron_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 2) return;

      // Read column names from CSV header
      const headers = lines[0].split(',').map(h => h.trim());
      if (headers.length >= 3) {
        setColNames([headers[0], headers[1], headers[2]]);
      }

      const parsedData = [];
      for (let i = 1; i < lines.length; i++) { // skip header
        const parts = lines[i].split(',');
        if (parts.length >= 3) {
          const v1 = parseFloat(parts[0]);
          const v2 = parseFloat(parts[1]);
          const label = parseInt(parts[2]);
          if (!isNaN(v1) && !isNaN(v2) && !isNaN(label)) {
            parsedData.push([v1, v2, label]);
          }
        }
      }
      if (parsedData.length > 0) {
        setData(parsedData);
        setResults(null);
        setTestResult(null);
        setTestX1('');
        setTestX2('');
      }
    };
    reader.readAsText(file);
  };

  const renderGraph = () => {
    if (!results || !results.loss_per_epoch || results.loss_per_epoch.length === 0) return null;
    const maxLoss = Math.max(...results.loss_per_epoch, 0.001);
    const points = results.loss_per_epoch.map((loss, idx) => {
      const x = (idx / (results.loss_per_epoch.length - 1 || 1)) * 100;
      const y = 100 - (loss / maxLoss) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  const calculateAccuracy = () => {
    if (!results || !results.predictions) return 0;
    let correct = 0;
    data.forEach((row, i) => {
      if (row[2] === results.predictions[i]) correct++;
    });
    return ((correct / data.length) * 100).toFixed(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Perceptron Learning Module</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works</h2>
            <p className="mb-4 text-sm text-slate-600">
              The Perceptron is the simplest neural network.
              It predicts an output based on weighted inputs.
            </p>
            <div className="mb-4 rounded bg-slate-50 p-4 font-mono text-sm text-slate-800 border border-slate-100">
              <p>Formula: y = step(w₁*x₁ + w₂*x₂ + b)</p>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Current Dataset Features:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600">
              <li><strong>x₁ (Input 1):</strong> {colNames[0]}</li>
              <li><strong>x₂ (Input 2):</strong> {colNames[1]}</li>
              <li><strong>Output (y):</strong> {colNames[2]} (1 = positive class, 0 = negative class)</li>
            </ul>
            <p className="text-sm text-slate-600">
              Upload any CSV with 2 numeric feature columns + 1 binary label column (0/1) to train on your own data!
            </p>
          </section>

          {/* Dataset Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">2. Dataset</h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                {data.length} row{data.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="overflow-x-auto rounded border border-slate-200 flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-400 w-8">#</th>
                    <th className="px-4 py-2 font-semibold">{colNames[0]}</th>
                    <th className="px-4 py-2 font-semibold">{colNames[1]}</th>
                    <th className="px-4 py-2 font-semibold">{colNames[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-3 py-2 text-xs text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-4 py-2">{row[0]}</td>
                      <td className="px-4 py-2">{row[1]}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${row[2] ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                          {row[2] ? '1' : '0'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.length > 10 && (
                    <tr className="border-t border-dashed border-slate-200 bg-slate-50">
                      <td colSpan={4} className="px-4 py-2 text-center text-xs text-slate-400 tracking-widest font-medium">
                        · · · {data.length - 10} more row{data.length - 10 !== 1 ? 's' : ''} hidden · · ·
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleDownload} className="text-sm text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition font-medium">
                Download CSV
              </button>
              <label className="text-sm text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center">
                Upload CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </section>

          {/* Controls Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">3. Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Initial w₁ ({colNames[0]})</label>
                <input type="number" step="0.1" value={w1} onChange={e => setW1(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Initial w₂ ({colNames[1]})</label>
                <input type="number" step="0.1" value={w2} onChange={e => setW2(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Initial Bias (b)</label>
                <input type="number" step="0.1" value={b} onChange={e => setBias(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50">
              {loading ? 'Training...' : 'Train Model'}
            </button>
          </section>

          {/* Graph Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">4. Live Epoch Graph</h2>
            {results ? (
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Epoch Loss</span>
                </div>
                <div className="mx-4 mb-4 relative h-48 border-l-2 border-b-2 border-slate-300 bg-slate-50">
                  {renderGraph()}
                  <div className="absolute top-0 -left-10 text-xs text-slate-400">{Math.max(...results.loss_per_epoch).toFixed(2)}</div>
                  <div className="absolute bottom-0 -left-6 text-xs text-slate-400">0</div>
                </div>

                {/* Result Section */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 shadow-inner">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Final Weights</p>
                      <p className="font-mono text-slate-900">w₁: {results.final_weights[0].toFixed(3)}</p>
                      <p className="font-mono text-slate-900">w₂: {results.final_weights[1].toFixed(3)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 shadow-inner">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Final Bias</p>
                      <p className="font-mono text-slate-900">{results.final_bias.toFixed(3)}</p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-purple-50 p-4 border border-purple-100 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1">Accuracy</p>
                        <p className="text-3xl font-bold text-purple-900">{calculateAccuracy()}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1">Predictions</p>
                        <p className="text-sm text-purple-900 font-medium">[{results.predictions.slice(0, 4).join(', ')}{results.predictions.length > 4 ? ', ...' : ''}]</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Your Input Section */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">Test Your Input</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{colNames[0]}</label>
                      <input type="number" step="0.1" value={testX1} onChange={e => setTestX1(e.target.value)} placeholder={`Enter ${colNames[0]}`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{colNames[1]}</label>
                      <input type="number" step="0.1" value={testX2} onChange={e => setTestX2(e.target.value)} placeholder={`Enter ${colNames[1]}`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                  </div>
                  <button onClick={handleManualPredict} className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition">
                    Predict Result
                  </button>
                  {testResult !== null && (
                    <div className={`mt-4 rounded-lg p-3 text-center border font-bold text-sm ${testResult === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      <span className="block text-xs font-normal text-current opacity-70 mb-1">{colNames[2]}</span>
                      Result: {testResult === 1 ? '1 — Positive Class ✅' : '0 — Negative Class ❌'}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                Click Train to start learning
              </div>
            )}
          </section>

          {/* ── Section 5: Visualization ── */}
          <section className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-900">5. Network Visualization</h2>
            <p className="mb-6 text-sm text-slate-500">Watch the perceptron network — weights &amp; bias update dynamically at every epoch. Use the controls to pause, replay, or step through.</p>

            {(() => {
              if (!results || !results.weights_per_epoch) {
                return (
                  <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                    Train the model to see the network visualization
                  </div>
                );
              }

              const lpe = results.loss_per_epoch;
              const wpe = results.weights_per_epoch;
              const bpe = results.bias_per_epoch;
              const totalEpochs = lpe.length;
              const ei = vizEpoch !== null ? Math.min(vizEpoch, totalEpochs - 1) : 0;
              const isFinished = ei === totalEpochs - 1;

              // Current epoch weights/bias for the live diagram
              const cw1 = wpe[ei][0];
              const cw2 = wpe[ei][1];
              const cb = bpe[ei];

              const loss = lpe[ei];
              const maxLoss = Math.max(...lpe, 1);
              const pct = Math.max(0, 100 - (loss / maxLoss) * 100);

              // Justified delay: aim for ~8s total regardless of epoch count
              const epochDelay = Math.max(300, Math.min(1200, Math.round(8000 / totalEpochs)));

              // Weight magnitude → line thickness (clamped)
              const w1Thick = Math.max(1.5, Math.min(6, Math.abs(cw1) * 4 + 1.5));
              const w2Thick = Math.max(1.5, Math.min(6, Math.abs(cw2) * 4 + 1.5));
              const bThick = Math.max(1.5, Math.min(5, Math.abs(cb) * 3 + 1.5));

              // Label truncation helper (avoid overlap)
              const shortName = (n) => n.length > 12 ? n.slice(0, 11) + '…' : n;

              return (
                <div className="space-y-6">

                  {/* ── Main network SVG ── */}
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50/30 p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Live Network — Epoch {ei + 1} / {totalEpochs}</p>
                      {isFinished && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Final Model
                        </span>
                      )}
                    </div>

                    <svg viewBox="0 0 520 280" className="w-full" style={{ minHeight: 240, maxHeight: 340 }}>
                      {/* ── Defs: glow & gradient ── */}
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ede9fe" />
                          <stop offset="100%" stopColor="#ddd6fe" />
                        </linearGradient>
                        <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d1fae5" />
                          <stop offset="100%" stopColor="#a7f3d0" />
                        </linearGradient>
                        <linearGradient id="biasGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fef9c3" />
                          <stop offset="100%" stopColor="#fef08a" />
                        </linearGradient>
                        <marker id="arrowG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
                        </marker>
                      </defs>

                      {/* ── Connection lines with live weights ── */}
                      {/* w1 line */}
                      <line x1="110" y1="90" x2="290" y2="138" stroke="#a78bfa" strokeWidth={w1Thick} strokeLinecap="round" opacity="0.85" />
                      {/* w1 label — placed above midpoint to avoid overlap */}
                      <rect x="170" y="88" width="84" height="18" rx="4" fill="white" fillOpacity="0.88" />
                      <text x="212" y="101" textAnchor="middle" fontSize="11" fill="#7c3aed" fontWeight="bold">
                        w₁ = {cw1.toFixed(3)}
                      </text>

                      {/* w2 line */}
                      <line x1="110" y1="180" x2="290" y2="152" stroke="#818cf8" strokeWidth={w2Thick} strokeLinecap="round" opacity="0.85" />
                      {/* w2 label — placed below midpoint */}
                      <rect x="170" y="172" width="84" height="18" rx="4" fill="white" fillOpacity="0.88" />
                      <text x="212" y="185" textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">
                        w₂ = {cw2.toFixed(3)}
                      </text>

                      {/* bias dashed line */}
                      <line x1="110" y1="250" x2="290" y2="162" stroke="#f59e0b" strokeWidth={bThick} strokeDasharray="6,4" strokeLinecap="round" opacity="0.8" />
                      {/* bias label — placed to the left, clear of w2 label */}
                      <rect x="148" y="226" width="72" height="18" rx="4" fill="white" fillOpacity="0.88" />
                      <text x="184" y="239" textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="bold">
                        b = {cb.toFixed(3)}
                      </text>

                      {/* ── Output line with arrowhead ── */}
                      <line x1="336" y1="148" x2="415" y2="148" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowG)" />

                      {/* ── Input node x₁ ── */}
                      <circle cx="80" cy="90" r="30" fill="url(#nodeGrad)" stroke="#8b5cf6" strokeWidth="2.2" filter="url(#glow)" />
                      <text x="80" y="87" textAnchor="middle" fontSize="14" fill="#5b21b6" fontWeight="bold">x₁</text>
                      <text x="80" y="102" textAnchor="middle" fontSize="8.5" fill="#7c3aed">input 1</text>
                      {/* Feature name — outside, above node */}
                      <text x="80" y="52" textAnchor="middle" fontSize="9.5" fill="#475569" fontWeight="600">{shortName(colNames[0])}</text>

                      {/* ── Input node x₂ ── */}
                      <circle cx="80" cy="180" r="30" fill="url(#nodeGrad)" stroke="#8b5cf6" strokeWidth="2.2" filter="url(#glow)" />
                      <text x="80" y="177" textAnchor="middle" fontSize="14" fill="#5b21b6" fontWeight="bold">x₂</text>
                      <text x="80" y="192" textAnchor="middle" fontSize="8.5" fill="#7c3aed">input 2</text>
                      {/* Feature name — outside, below node */}
                      <text x="80" y="222" textAnchor="middle" fontSize="9.5" fill="#475569" fontWeight="600">{shortName(colNames[1])}</text>

                      {/* ── Bias node ── */}
                      <circle cx="80" cy="250" r="22" fill="url(#biasGrad)" stroke="#f59e0b" strokeWidth="2" />
                      <text x="80" y="247" textAnchor="middle" fontSize="13" fill="#92400e" fontWeight="bold">b</text>
                      <text x="80" y="261" textAnchor="middle" fontSize="8" fill="#b45309">bias</text>

                      {/* ── Neuron body (Σ + step) ── */}
                      <circle cx="313" cy="148" r="38" fill="url(#nodeGrad)" stroke="#7c3aed" strokeWidth="2.8" filter="url(#glow)" />
                      <text x="313" y="142" textAnchor="middle" fontSize="16" fill="#5b21b6" fontWeight="bold">Σ</text>
                      <text x="313" y="157" textAnchor="middle" fontSize="10" fill="#5b21b6">step( )</text>

                      {/* ── Output node ŷ ── */}
                      <circle cx="445" cy="148" r="30" fill="url(#outGrad)" stroke="#10b981" strokeWidth="2.5" filter="url(#glow)" />
                      <text x="445" y="145" textAnchor="middle" fontSize="15" fill="#065f46" fontWeight="bold">ŷ</text>
                      <text x="445" y="161" textAnchor="middle" fontSize="9" fill="#065f46">output</text>

                      {/* ── Loss badge inside SVG ── */}
                      <rect x="370" y="62" width="148" height="52" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
                      <text x="444" y="82" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">EPOCH {ei + 1} STATS</text>
                      <text x="444" y="98" textAnchor="middle" fontSize="10" fill="#7c3aed">Loss: {loss}  Acc: {pct.toFixed(0)}%</text>
                      <text x="444" y="112" textAnchor="middle" fontSize="9" fill={loss === 0 ? '#059669' : '#d97706'}>
                        {loss === 0 ? '✓ Converged' : '⚡ Updating…'}
                      </text>

                      {/* "INPUT LAYER" / "OUTPUT" labels at bottom */}
                      <text x="80" y="278" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontWeight="600">INPUT LAYER</text>
                      <text x="313" y="200" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontWeight="600">NEURON</text>
                      <text x="445" y="190" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontWeight="600">OUTPUT</text>
                    </svg>
                  </div>

                  {/* ── Playback controls ── */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4">
                      {/* ── Progress bars ── */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Epoch Progress</span>
                            <span>{ei + 1} / {totalEpochs}</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                              style={{ width: `${((ei + 1) / totalEpochs) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Misclassifications</span>
                            <span>{loss}</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-300"
                              style={{ width: `${(loss / maxLoss) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Accuracy (approx)</span>
                            <span>{pct.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* ── Button row ── */}
                      <div className="flex flex-wrap gap-2">
                        {/* Replay */}
                        <button
                          onClick={() => {
                            stopVizTimer();
                            setVizEpoch(0);
                            startVizPlay(0, totalEpochs, epochDelay);
                          }}
                          className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition shadow-sm"
                        >⟳ Replay</button>

                        {/* Pause / Resume */}
                        {vizPlaying ? (
                          <button
                            onClick={() => { stopVizTimer(); setVizPlaying(false); }}
                            className="flex-1 min-w-[80px] rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                          >⏸ Pause</button>
                        ) : (
                          <button
                            onClick={() => {
                              if (ei < totalEpochs - 1) startVizPlay(ei, totalEpochs, epochDelay);
                            }}
                            disabled={ei >= totalEpochs - 1}
                            className="flex-1 min-w-[80px] rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40"
                          >▶ Continue</button>
                        )}

                        {/* Step back */}
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizEpoch(e => Math.max(0, (e ?? 0) - 1)); }}
                          disabled={ei === 0}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                        >← Prev</button>

                        {/* Step forward */}
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizEpoch(e => Math.min(totalEpochs - 1, (e ?? 0) + 1)); }}
                          disabled={ei >= totalEpochs - 1}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                        >Next →</button>

                        {/* Jump to end */}
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizEpoch(totalEpochs - 1); }}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                        >⏭ End</button>
                      </div>

                      <p className="text-[10px] text-slate-400 text-center">Animation speed: ~{epochDelay}ms per epoch ({totalEpochs} epochs total)</p>
                    </div>
                  </div>

                  {/* ── Final Model Summary (shown once animation reaches end) ── */}
                  {isFinished && (
                    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-purple-600 text-[22px]">hub</span>
                        <h3 className="text-lg font-bold text-slate-900">Final Trained Model</h3>
                        <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Converged</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg bg-white border border-purple-100 p-3 shadow-inner text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 mb-1">w₁</p>
                          <p className="font-mono text-lg font-bold text-slate-900">{results.final_weights[0].toFixed(4)}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{colNames[0]}</p>
                        </div>
                        <div className="rounded-lg bg-white border border-indigo-100 p-3 shadow-inner text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 mb-1">w₂</p>
                          <p className="font-mono text-lg font-bold text-slate-900">{results.final_weights[1].toFixed(4)}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{colNames[1]}</p>
                        </div>
                        <div className="rounded-lg bg-white border border-amber-100 p-3 shadow-inner text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Bias (b)</p>
                          <p className="font-mono text-lg font-bold text-slate-900">{results.final_bias.toFixed(4)}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">offset</p>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-3 shadow-inner text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Accuracy</p>
                          <p className="font-mono text-lg font-bold text-emerald-700">{calculateAccuracy()}%</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">on dataset</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg bg-white border border-slate-100 p-3 font-mono text-xs text-slate-700">
                        <span className="text-purple-600 font-semibold">ŷ</span> = step(<span className="text-purple-600">{results.final_weights[0].toFixed(3)}</span>·x₁ + <span className="text-indigo-600">{results.final_weights[1].toFixed(3)}</span>·x₂ + <span className="text-amber-600">{results.final_bias.toFixed(3)}</span>)
                      </div>
                    </div>
                  )}

                  {/* ── Mini loss sparkline ── */}
                  {(() => {
                    const maxL = Math.max(...lpe, 1);
                    const pts = lpe.map((l, i) => {
                      const x = (i / (lpe.length - 1 || 1)) * 100;
                      const y = 100 - (l / maxL) * 100;
                      return `${x},${y}`;
                    }).join(' ');
                    const curX = (ei / (lpe.length - 1 || 1)) * 100;
                    const curY = 100 - (lpe[ei] / maxL) * 100;
                    return (
                      <div>
                        <p className="text-xs text-slate-500 mb-2 font-medium">Loss over all epochs</p>
                        <div className="relative h-24 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <defs>
                              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <polygon points={`0,100 ${pts} 100,100`} fill="url(#lossGrad)" />
                            <polyline points={pts} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <line x1={curX} y1="0" x2={curX} y2="100" stroke="#f59e0b" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="3,2" />
                            <circle cx={curX} cy={curY} r="3" fill="#f59e0b" vectorEffect="non-scaling-stroke" />
                          </svg>
                          <div className="absolute bottom-1 right-2 text-[10px] text-slate-400">epoch {lpe.length}</div>
                          <div className="absolute top-1 left-2 text-[10px] text-slate-400">max loss: {maxL}</div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              );
            })()}
          </section>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}

function RNNView({ onNavigate }) {
  const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

  // Sample sequence
  const sampleNum = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const sampleText = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy"];

  const [mode, setMode] = useState("number"); // "number" or "text"
  const [data, setData] = useState(sampleNum);
  const [lr, setLr] = useState(0.01);
  const [epochs, setEpochs] = useState(50);
  const [hiddenUnits, setHiddenUnits] = useState(16);
  const [seqLen, setSeqLen] = useState(3);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Visualization States
  const [vizStep, setVizStep] = useState(null);
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizTimerRef = useRef(null);

  const stopVizTimer = useCallback(() => {
    if (vizTimerRef.current) {
      clearInterval(vizTimerRef.current);
      vizTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopVizTimer, [stopVizTimer]);

  const startVizPlay = useCallback((fromStep, totalSteps, delay) => {
    stopVizTimer();
    setVizPlaying(true);
    let cur = fromStep;
    vizTimerRef.current = setInterval(() => {
      cur++;
      if (cur >= totalSteps) {
        clearInterval(vizTimerRef.current);
        vizTimerRef.current = null;
        setVizPlaying(false);
        setVizStep(totalSteps - 1);
      } else {
        setVizStep(cur);
      }
    }, delay);
  }, [stopVizTimer]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "number") setData(sampleNum);
    else setData(sampleText);
    setResults(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      if (mode === "number") {
        const nums = lines.map(parseFloat).filter(n => !isNaN(n));
        if (nums.length > 5) {
          setData(nums);
          setResults(null);
        } else {
          alert("Please upload a CSV/txt with at least 5 numeric values, one per line.");
        }
      } else {
        const words = lines.join(' ').split(/\s+/).filter(w => w);
        if (words.length > 5) {
          setData(words);
          setResults(null);
        } else {
          alert("Please upload a file with enough words text.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTrain = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("http://localhost:8000/rnn/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: data,
          mode: mode,
          learning_rate: parseFloat(lr),
          epochs: parseInt(epochs),
          hidden_units: parseInt(hiddenUnits),
          sequence_length: parseInt(seqLen)
        })
      });
      const resData = await res.json();
      if (resData.error) {
        alert(resData.error);
      } else {
        setResults(resData);
        if (resData.hidden_states && resData.hidden_states.length > 0) {
          const totalSteps = resData.hidden_states.length;
          setVizStep(0);
          const delay = Math.max(800, Math.min(2000, 8000 / totalSteps));
          startVizPlay(0, totalSteps, delay);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const renderLossGraph = () => {
    if (!results || !results.loss_per_epoch || results.loss_per_epoch.length === 0) return null;
    const maxLoss = Math.max(...results.loss_per_epoch, 0.001);
    const points = results.loss_per_epoch.map((loss, idx) => {
      const x = (idx / (results.loss_per_epoch.length - 1 || 1)) * 100;
      const y = 100 - (loss / maxLoss) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="mx-4 mb-4 relative h-32 border-l-2 border-b-2 border-slate-300 bg-slate-50">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#f43f5e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Recurrent Neural Network (RNN)</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works (Theory)</h2>
            <p className="mb-4 text-sm text-slate-600">
              <strong>What is an RNN?</strong> A type of Recurrent Neural Network (RNN) designed to remember values over arbitrary time intervals. Unlike standard feed-forward networks, RNNs have "memory belts" and feedback loops.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">Key Mechanisms:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>Forget Gate:</strong> Decides what information to throw away from the block.</li>
              <li><strong>Input Gate:</strong> Decides which new values to update the memory state with.</li>
              <li><strong>Cell State:</strong> The conveyor belt carrying the "memory" across time steps.</li>
              <li><strong>Output Gate:</strong> Decides what the next hidden state should be.</li>
            </ul>
          </section>

          {/* Dataset Upload Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">2. Sequence Data</h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => handleModeChange("number")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'number' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>Numeric</button>
                <button 
                  onClick={() => handleModeChange("text")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'text' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>Text</button>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded border border-slate-200 p-3 overflow-y-auto max-h-40 flex flex-wrap gap-2 content-start">
               {data.slice(0, 50).map((d, i) => (
                 <span key={i} className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-700">
                   {d}
                 </span>
               ))}
               {data.length > 50 && <span className="inline-block px-2.5 py-1 text-sm text-slate-400">... ({data.length - 50} more)</span>}
            </div>

            <div className="mt-4">
              <label className="text-sm text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center">
                <span className="material-symbols-outlined mr-1 text-[18px]">upload_file</span>
                Upload Sequence CSV/Text
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="mt-2 text-xs text-slate-400">Upload a single column of time-series data or sentences.</p>
            </div>
          </section>

          {/* Controls Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">3. Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sequence Length</label>
                <input type="number" min="2" value={seqLen} onChange={e => setSeqLen(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hidden Units</label>
                <input type="number" min="4" value={hiddenUnits} onChange={e => setHiddenUnits(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 font-bold text-white shadow-md hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 transition">
              {loading ? 'Crunching Sequence...' : 'Train RNN Model'}
            </button>
          </section>

          {/* Training Results */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">4. Engine Output</h2>
            {results && !results.error ? (
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Epoch Loss Graph</span>
                </div>
                {renderLossGraph()}

                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm text-center flex flex-col items-center">
                  <h3 className="mb-1 text-sm font-bold text-emerald-800 uppercase tracking-widest">Next Element Prediction</h3>
                  <p className="text-slate-600 text-xs mb-3">Based on the sequence: <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-100">{data.slice(-seqLen).join(', ')}</span></p>
                  
                  <div className="text-4xl font-extrabold text-emerald-600 bg-white w-full rounded-lg py-4 border border-emerald-100 shadow-inner">
                    👉 {results.prediction}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                Train to see sequence prediction
              </div>
            )}
          </section>

          {/* Visualization Section */}
          <section className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-900">5. Internal Hidden State Tracking</h2>
            <p className="mb-6 text-sm text-slate-500">Watch the RNN's memory evolve as it digests each token of the final input sequence.</p>

            {(() => {
              if (!results || !results.hidden_states || results.hidden_states.length === 0) {
                return (
                  <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                    Train the model to visualize the memory state
                  </div>
                );
              }

              const numSteps = results.hidden_states.length;
              const stepIdx = vizStep !== null ? Math.min(vizStep, numSteps - 1) : 0;
              const inputTokens = data.slice(-seqLen);
              const delay = Math.max(800, Math.min(2000, 8000 / numSteps));
              const currentToken = inputTokens[stepIdx] || "N/A";
              const hiddenVector = results.hidden_states[stepIdx];

              return (
                <div className="space-y-6">
                  {/* Sequence Progress Diagram */}
                  <div className="flex gap-2 mb-4 justify-center items-center overflow-x-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
                    {inputTokens.map((token, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className={`px-4 py-2 rounded-lg font-mono font-bold text-sm transition-all duration-300 transform
                          ${stepIdx === idx ? 'bg-rose-500 text-white shadow-lg scale-110' : 
                            stepIdx > idx ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-slate-500 border border-slate-300'}`}>
                          {token}
                        </div>
                        {idx < inputTokens.length - 1 && (
                          <div className={`h-1 w-6 sm:w-12 transition-colors ${stepIdx > idx ? 'bg-indigo-300' : 'bg-slate-200'}`}></div>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center">
                        <div className={`h-1 w-6 sm:w-12 transition-colors ${stepIdx === numSteps - 1 ? 'bg-rose-300' : 'bg-slate-200'}`}></div>
                        <div className={`px-4 py-2 border-2 border-dashed rounded-lg font-mono font-bold text-sm transition-all duration-300
                          ${stepIdx === numSteps - 1 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-300 text-slate-400 bg-white'}`}>
                          ?
                        </div>
                    </div>
                  </div>

                  {/* Hidden State Memory Viewer */}
                  <div className="bg-slate-900 rounded-xl p-6 shadow-neutral-900/50 shadow-xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 bg-rose-600 text-xs font-bold text-white px-3 py-1 rounded-bl-lg">Time Step t={stepIdx}</div>
                     <h3 className="text-white text-sm font-semibold mb-4 opacity-80 uppercase tracking-widest">RNN Hidden State Vector [h_t]</h3>
                     
                     <div className="flex flex-wrap gap-1">
                       {hiddenVector.map((val, i) => {
                         // mapping val (-1 to 1 for tanh) to colors
                         const isPositive = val > 0;
                         const absVal = Math.abs(val);
                         // positive: pink/rose, negative: blue/indigo
                         const r = isPositive ? 244 : 99;
                         const g = isPositive ? 63 : 102;
                         const b = isPositive ? 94 : 241;
                         const alpha = Math.max(0.1, absVal);
                         const bg = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                         return (
                           <div key={i} className="group relative">
                             <div 
                               className="w-10 h-10 rounded box-border border border-white/10 transition-all duration-500 flex items-center justify-center text-[10px] text-white/50"
                               style={{ backgroundColor: bg }}
                             >
                               {absVal > 0.5 ? '★' : ''}
                             </div>
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 w-auto">
                               Node {i}: {val.toFixed(4)}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                     <div className="mt-4 flex gap-4 text-[10px] uppercase text-white/60 tracking-wider">
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded"></div> Positive Memory</span>
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Negative Memory</span>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { stopVizTimer(); setVizStep(0); startVizPlay(0, numSteps, delay); }}
                        className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-2 text-xs font-bold text-white hover:from-rose-500 transition shadow-sm"
                      >⟳ Replay Sequence</button>

                      {vizPlaying ? (
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); }}
                          className="flex-1 min-w-[80px] rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                        >⏸ Pause</button>
                      ) : (
                        <button
                          onClick={() => { if (stepIdx < numSteps - 1) startVizPlay(stepIdx, numSteps, delay); }}
                          disabled={stepIdx >= numSteps - 1}
                          className="flex-1 min-w-[80px] rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40"
                        >▶ Continue</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}




function LSTMView({ onNavigate }) {
  const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

  // Sample sequence
  const sampleNum = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const sampleText = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy"];

  const [mode, setMode] = useState("number"); // "number" or "text"
  const [data, setData] = useState(sampleNum);
  const [lr, setLr] = useState(0.01);
  const [epochs, setEpochs] = useState(50);
  const [hiddenUnits, setHiddenUnits] = useState(16);
  const [seqLen, setSeqLen] = useState(3);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Visualization States
  const [vizStep, setVizStep] = useState(null);
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizTimerRef = useRef(null);

  const stopVizTimer = useCallback(() => {
    if (vizTimerRef.current) {
      clearInterval(vizTimerRef.current);
      vizTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopVizTimer, [stopVizTimer]);

  const startVizPlay = useCallback((fromStep, totalSteps, delay) => {
    stopVizTimer();
    setVizPlaying(true);
    let cur = fromStep;
    vizTimerRef.current = setInterval(() => {
      cur++;
      if (cur >= totalSteps) {
        clearInterval(vizTimerRef.current);
        vizTimerRef.current = null;
        setVizPlaying(false);
        setVizStep(totalSteps - 1);
      } else {
        setVizStep(cur);
      }
    }, delay);
  }, [stopVizTimer]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "number") setData(sampleNum);
    else setData(sampleText);
    setResults(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      if (mode === "number") {
        const nums = lines.map(parseFloat).filter(n => !isNaN(n));
        if (nums.length > 5) {
          setData(nums);
          setResults(null);
        } else {
          alert("Please upload a CSV/txt with at least 5 numeric values, one per line.");
        }
      } else {
        const words = lines.join(' ').split(/\s+/).filter(w => w);
        if (words.length > 5) {
          setData(words);
          setResults(null);
        } else {
          alert("Please upload a file with enough words text.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTrain = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("http://localhost:8000/lstm/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: data,
          mode: mode,
          learning_rate: parseFloat(lr),
          epochs: parseInt(epochs),
          hidden_units: parseInt(hiddenUnits),
          sequence_length: parseInt(seqLen)
        })
      });
      const resData = await res.json();
      if (resData.error) {
        alert(resData.error);
      } else {
        setResults(resData);
        if (resData.hidden_states && resData.hidden_states.length > 0) {
          const totalSteps = resData.hidden_states.length;
          setVizStep(0);
          const delay = Math.max(800, Math.min(2000, 8000 / totalSteps));
          startVizPlay(0, totalSteps, delay);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const renderLossGraph = () => {
    if (!results || !results.loss_per_epoch || results.loss_per_epoch.length === 0) return null;
    const maxLoss = Math.max(...results.loss_per_epoch, 0.001);
    const points = results.loss_per_epoch.map((loss, idx) => {
      const x = (idx / (results.loss_per_epoch.length - 1 || 1)) * 100;
      const y = 100 - (loss / maxLoss) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="mx-4 mb-4 relative h-32 border-l-2 border-b-2 border-slate-300 bg-slate-50">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#f43f5e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Long Short-Term Memory (LSTM)</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works (Theory)</h2>
            <p className="mb-4 text-sm text-slate-600">
              <strong>What is an LSTM?</strong> A type of Recurrent Neural Network (RNN) designed to remember values over arbitrary time intervals. Unlike standard feed-forward networks, LSTMs have "memory belts" and feedback loops.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">Key Mechanisms:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>Forget Gate:</strong> Decides what information to throw away from the block.</li>
              <li><strong>Input Gate:</strong> Decides which new values to update the memory state with.</li>
              <li><strong>Cell State:</strong> The conveyor belt carrying the "memory" across time steps.</li>
              <li><strong>Output Gate:</strong> Decides what the next hidden state should be.</li>
            </ul>
          </section>

          {/* Dataset Upload Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">2. Sequence Data</h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => handleModeChange("number")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'number' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>Numeric</button>
                <button 
                  onClick={() => handleModeChange("text")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'text' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>Text</button>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded border border-slate-200 p-3 overflow-y-auto max-h-40 flex flex-wrap gap-2 content-start">
               {data.slice(0, 50).map((d, i) => (
                 <span key={i} className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-700">
                   {d}
                 </span>
               ))}
               {data.length > 50 && <span className="inline-block px-2.5 py-1 text-sm text-slate-400">... ({data.length - 50} more)</span>}
            </div>

            <div className="mt-4">
              <label className="text-sm text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center">
                <span className="material-symbols-outlined mr-1 text-[18px]">upload_file</span>
                Upload Sequence CSV/Text
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="mt-2 text-xs text-slate-400">Upload a single column of time-series data or sentences.</p>
            </div>
          </section>

          {/* Controls Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">3. Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sequence Length</label>
                <input type="number" min="2" value={seqLen} onChange={e => setSeqLen(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hidden Units</label>
                <input type="number" min="4" value={hiddenUnits} onChange={e => setHiddenUnits(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 font-bold text-white shadow-md hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 transition">
              {loading ? 'Crunching Sequence...' : 'Train LSTM Model'}
            </button>
          </section>

          {/* Training Results */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">4. Engine Output</h2>
            {results && !results.error ? (
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Epoch Loss Graph</span>
                </div>
                {renderLossGraph()}

                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm text-center flex flex-col items-center">
                  <h3 className="mb-1 text-sm font-bold text-emerald-800 uppercase tracking-widest">Next Element Prediction</h3>
                  <p className="text-slate-600 text-xs mb-3">Based on the sequence: <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-100">{data.slice(-seqLen).join(', ')}</span></p>
                  
                  <div className="text-4xl font-extrabold text-emerald-600 bg-white w-full rounded-lg py-4 border border-emerald-100 shadow-inner">
                    👉 {results.prediction}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                Train to see sequence prediction
              </div>
            )}
          </section>

          {/* Visualization Section */}
          <section className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-900">5. Internal Hidden State Tracking</h2>
            <p className="mb-6 text-sm text-slate-500">Watch the LSTM's memory evolve as it digests each token of the final input sequence.</p>

            {(() => {
              if (!results || !results.hidden_states || results.hidden_states.length === 0) {
                return (
                  <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                    Train the model to visualize the memory state
                  </div>
                );
              }

              const numSteps = results.hidden_states.length;
              const stepIdx = vizStep !== null ? Math.min(vizStep, numSteps - 1) : 0;
              const inputTokens = data.slice(-seqLen);
              const delay = Math.max(800, Math.min(2000, 8000 / numSteps));
              const currentToken = inputTokens[stepIdx] || "N/A";
              const hiddenVector = results.hidden_states[stepIdx];

              return (
                <div className="space-y-6">
                  {/* Sequence Progress Diagram */}
                  <div className="flex gap-2 mb-4 justify-center items-center overflow-x-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
                    {inputTokens.map((token, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className={`px-4 py-2 rounded-lg font-mono font-bold text-sm transition-all duration-300 transform
                          ${stepIdx === idx ? 'bg-rose-500 text-white shadow-lg scale-110' : 
                            stepIdx > idx ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-slate-500 border border-slate-300'}`}>
                          {token}
                        </div>
                        {idx < inputTokens.length - 1 && (
                          <div className={`h-1 w-6 sm:w-12 transition-colors ${stepIdx > idx ? 'bg-indigo-300' : 'bg-slate-200'}`}></div>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center">
                        <div className={`h-1 w-6 sm:w-12 transition-colors ${stepIdx === numSteps - 1 ? 'bg-rose-300' : 'bg-slate-200'}`}></div>
                        <div className={`px-4 py-2 border-2 border-dashed rounded-lg font-mono font-bold text-sm transition-all duration-300
                          ${stepIdx === numSteps - 1 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-300 text-slate-400 bg-white'}`}>
                          ?
                        </div>
                    </div>
                  </div>

                  {/* Hidden State Memory Viewer */}
                  <div className="bg-slate-900 rounded-xl p-6 shadow-neutral-900/50 shadow-xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 bg-rose-600 text-xs font-bold text-white px-3 py-1 rounded-bl-lg">Time Step t={stepIdx}</div>
                     <h3 className="text-white text-sm font-semibold mb-4 opacity-80 uppercase tracking-widest">LSTM Hidden State Vector [h_t]</h3>
                     
                     <div className="flex flex-wrap gap-1">
                       {hiddenVector.map((val, i) => {
                         // mapping val (-1 to 1 for tanh) to colors
                         const isPositive = val > 0;
                         const absVal = Math.abs(val);
                         // positive: pink/rose, negative: blue/indigo
                         const r = isPositive ? 244 : 99;
                         const g = isPositive ? 63 : 102;
                         const b = isPositive ? 94 : 241;
                         const alpha = Math.max(0.1, absVal);
                         const bg = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                         return (
                           <div key={i} className="group relative">
                             <div 
                               className="w-10 h-10 rounded box-border border border-white/10 transition-all duration-500 flex items-center justify-center text-[10px] text-white/50"
                               style={{ backgroundColor: bg }}
                             >
                               {absVal > 0.5 ? '★' : ''}
                             </div>
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 w-auto">
                               Node {i}: {val.toFixed(4)}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                     <div className="mt-4 flex gap-4 text-[10px] uppercase text-white/60 tracking-wider">
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded"></div> Positive Memory</span>
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Negative Memory</span>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { stopVizTimer(); setVizStep(0); startVizPlay(0, numSteps, delay); }}
                        className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-2 text-xs font-bold text-white hover:from-rose-500 transition shadow-sm"
                      >⟳ Replay Sequence</button>

                      {vizPlaying ? (
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); }}
                          className="flex-1 min-w-[80px] rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                        >⏸ Pause</button>
                      ) : (
                        <button
                          onClick={() => { if (stepIdx < numSteps - 1) startVizPlay(stepIdx, numSteps, delay); }}
                          disabled={stepIdx >= numSteps - 1}
                          className="flex-1 min-w-[80px] rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40"
                        >▶ Continue</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}


function CNNView({ onNavigate }) {
  const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };
  const [lr, setLr] = useState(0.001);
  const [epochs, setEpochs] = useState(15);
  const [filters, setFilters] = useState(16);
  const [kernelSize, setKernelSize] = useState(3);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  // Visualization States
  const [vizEpoch, setVizEpoch] = useState(null);
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizTimerRef = useRef(null);

  const stopVizTimer = useCallback(() => {
    if (vizTimerRef.current) {
      clearInterval(vizTimerRef.current);
      vizTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopVizTimer, [stopVizTimer]);

  const startVizPlay = useCallback((fromEpoch, totalEpochs, delay) => {
    stopVizTimer();
    setVizPlaying(true);
    let cur = fromEpoch;
    vizTimerRef.current = setInterval(() => {
      cur++;
      if (cur >= totalEpochs) {
        clearInterval(vizTimerRef.current);
        vizTimerRef.current = null;
        setVizPlaying(false);
        setVizEpoch(totalEpochs - 1);
      } else {
        setVizEpoch(cur);
      }
    }, delay);
  }, [stopVizTimer]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImagePreview(evt.target.result);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const pixels = [];
        for (let i = 0; i < imgData.length; i += 4) {
          pixels.push(imgData[i] / 255.0, imgData[i + 1] / 255.0, imgData[i + 2] / 255.0);
        }

        setImageBase64(JSON.stringify(pixels));
        setResults(null);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const loadSampleImage = () => {
    setImagePreview("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%2394a3b8'/%3E%3Ccircle cx='35' cy='45' r='5' fill='%23334155'/%3E%3Ccircle cx='65' cy='45' r='5' fill='%23334155'/%3E%3Cpath d='M 40 65 Q 50 75 60 65' stroke='%23334155' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    const pixels = Array(32 * 32 * 3).fill(1.0);
    for (let r = 0; r < 32; r++) {
      for (let c = 0; c < 32; c++) {
        if (Math.abs(r - 16) < 4 || Math.abs(c - 16) < 4) {
          const idx = (r * 32 + c) * 3;
          pixels[idx] = 0.2;
          pixels[idx+1] = 0.2;
          pixels[idx+2] = 0.2;
        }
      }
    }
    setImageBase64(JSON.stringify(pixels));
    setResults(null);
  };

  const handleTrain = async () => {
    if (!imageBase64) return alert("Please upload an image first.");
    setLoading(true);
    setResults(null);
    try {
      const payload = {
        image: imageBase64,
        learning_rate: parseFloat(lr),
        epochs: parseInt(epochs),
        filters: parseInt(filters),
        kernel_size: parseInt(kernelSize)
      };
      const res = await fetch("http://localhost:8000/cnn/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }
      const resData = await res.json();
      if (resData.error) {
        alert("Server Error: " + resData.error);
      } else {
        setResults(resData);
        if (resData.loss_per_epoch && resData.loss_per_epoch.length > 0) {
            const totalEpochs = resData.loss_per_epoch.length;
            setVizEpoch(0);
            const delay = Math.max(300, Math.min(1000, 5000 / totalEpochs));
            startVizPlay(0, totalEpochs, delay);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderGraph = (ei) => {
    if (!results || !results.loss_per_epoch || results.loss_per_epoch.length === 0) return null;
    const maxLoss = Math.max(...results.loss_per_epoch, ...(results.val_loss_per_epoch || []), 0.001);
    
    // Train Loss (Purple)
    const pointsTrain = results.loss_per_epoch.slice(0, ei + 1).map((loss, idx) => {
      const x = (idx / (results.loss_per_epoch.length - 1 || 1)) * 100;
      const y = 100 - (loss / maxLoss) * 100;
      return `${x},${y}`;
    }).join(' ');

    // Val Loss (Amber)
    const pointsVal = (results.val_loss_per_epoch || []).slice(0, ei + 1).map((loss, idx) => {
      const x = (idx / (results.val_loss_per_epoch.length - 1 || 1)) * 100;
      const y = 100 - (loss / maxLoss) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline points={pointsTrain} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {results.val_loss_per_epoch && (
          <polyline points={pointsVal} fill="none" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4,2" />
        )}
      </svg>
    );
  };

  const renderFeatureMaps = () => {
    if (!results || !results.feature_maps || results.feature_maps.length === 0) return null;
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-700 ease-in-out opacity-100">
        <h3 className="mb-3 text-[12px] font-bold uppercase tracking-widest text-slate-500 text-center">Learned Filters & Feature Maps</h3>
        <div className="grid grid-cols-4 gap-4">
          {results.feature_maps.map((mapArray, i) => {
            const filterArray = results.filters ? results.filters[i] : null;
            
            // Render a grid helper
            const renderGrid = (arr, size) => {
                if (!arr) return null;
                const minV = Math.min(...arr);
                const maxV = Math.max(...arr);
                const range = maxV - minV || 1;
                return (
                  <svg viewBox={`0 0 ${size*10} ${size*10}`} className="w-full aspect-square border border-slate-200 rounded">
                    {arr.map((val, j) => {
                      const row = Math.floor(j / size);
                      const col = j % size;
                      const intensity = Math.floor(((val - minV) / range) * 255);
                      return <rect key={j} x={col * 10} y={row * 10} width="10" height="10" fill={`rgb(${intensity},${intensity},${intensity})`} />
                    })}
                  </svg>
                );
            };

            return (
              <div key={i} className="flex flex-col items-center border border-slate-100 p-2 rounded bg-slate-50 relative group">
                <span className="text-[11px] font-bold text-slate-700 mb-2 whitespace-nowrap">Filter {i + 1}</span>
                
                {filterArray && (
                    <div className="w-8 aspect-square mb-2 hover:scale-150 transition-transform cursor-pointer" title="Convolutional Filter (Weights)">
                        {renderGrid(filterArray, Math.sqrt(filterArray.length))}
                    </div>
                )}
                
                <div className="w-full aspect-square" title="Resulting Feature Map (Activation)">
                    {renderGrid(mapArray, 14)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResultsPanel = (ei, totalEpochs) => {
    if (!results || !results.prediction) return null;
    
    // We only show predictions near the end or at the exact epoch if tracking accuracy
    const curTrainAcc = results.acc_per_epoch ? results.acc_per_epoch[ei] : 0;
    const curValAcc = results.val_acc_per_epoch ? results.val_acc_per_epoch[ei] : 0;
    
    const isFinished = ei === totalEpochs - 1;

    let health = "Training...";
    let healthColor = "text-slate-500";
    if (curTrainAcc > 0 && curValAcc > 0 && isFinished) {
        if (curTrainAcc - curValAcc > 0.15) {
            health = "Overfitting ⚠️ (Val Acc lagging)";
            healthColor = "text-rose-600";
        } else if (curValAcc >= 0.8) {
            health = "Good Generalization ✅";
            healthColor = "text-emerald-600";
        } else {
            health = "Underfitting 📉 (Needs more epochs)";
            healthColor = "text-amber-600";
        }
    } else {
        health = "Crunching Features...";
        healthColor = "text-indigo-600";
    }

    return (
        <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-slate-900 flex justify-between items-center">
              Prediction Results
              {!isFinished && <span className="text-[10px] uppercase font-bold text-indigo-500 animate-pulse">Running Epoch {ei + 1}</span>}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className={`bg-white p-3 rounded shadow-sm border ${isFinished ? 'border-emerald-200' : 'border-indigo-100 opacity-50'}`}>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider">Identified Class</span>
                    <span className="text-2xl font-black text-indigo-700">{isFinished ? results.prediction : '?'}</span>
                </div>
                <div className={`bg-white p-3 rounded shadow-sm border ${isFinished ? 'border-emerald-200' : 'border-indigo-100 opacity-50'}`}>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider">Confidence</span>
                    <span className="text-2xl font-black text-indigo-700">{isFinished ? results.confidence.toFixed(1) + '%' : '?'}</span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-indigo-100 col-span-2 flex justify-between items-center">
                    <div>
                        <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Model Health</span>
                        <span className={`font-bold ${healthColor}`}>{health}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Current Accuracy</span>
                        <span className="font-mono text-slate-700">Train: {(curTrainAcc*100).toFixed(1)}% | Val: {(curValAcc*100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Convolutional Neural Network (CNN)</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works</h2>
            <p className="mb-4 text-sm text-slate-600">
              A <strong>Convolutional Neural Network (CNN)</strong> acts like a digital eye, scanning images for patterns such as edges, shapes, and textures rather than blindly memorizing pixels.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">CNN Workflow:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>Input Image:</strong> Raw pixel data.</li>
              <li><strong>Convolution Layer:</strong> Detects edges using sliding square matrices (filters).</li>
              <li><strong>ReLU Activation:</strong> Enhances edges and ignores negative values.</li>
              <li><strong>Pooling Layer:</strong> Compresses the image, keeping only the strongest features.</li>
              <li><strong>Flatten & Dense:</strong> Summarizes the features to make a final prediction.</li>
            </ul>
          </section>

          {/* Dataset Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <h2 className="mb-4 text-xl font-bold text-slate-900">2. Input Image (Canvas)</h2>

            <div className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-mono overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover border-4 border-white rounded-lg shadow-lg z-10" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-4xl opacity-50">image</span>
                  <span>No image selected</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button
                onClick={loadSampleImage}
                className="text-[12px] text-amber-600 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-4 py-2 mt-2 rounded-lg transition font-medium"
              >
                Use Sample Camera Image
              </button>
              <label className="text-[12px] text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 mt-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center shadow-sm">
                <span className="material-symbols-outlined mr-2 text-[18px]">cloud_upload</span> Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="mt-3 text-[10px] text-slate-400 text-center uppercase tracking-wider block">Images are automatically resized to 32x32 color (RGB).</p>
          </section>

          {/* Controls Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">3. Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.001" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Filters (Conv Maps)</label>
                <input type="number" value={filters} onChange={e => setFilters(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Kernel Size (NxN)</label>
                <input type="number" min="2" max="7" value={kernelSize} onChange={e => setKernelSize(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading || (!imagePreview)} className="mt-6 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 font-bold text-white shadow-md hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 transition">
              {loading ? 'Processing Convolutions...' : 'Train Vision Model'}
            </button>
          </section>

          {/* Training & Output Visualizer Section */}
          <section className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">4. Live Training Timeline & Feature Engine</h2>
            
            {(() => {
                if (!results || results.loss_per_epoch === undefined) {
                    return (
                        <div className="flex flex-col h-48 items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 gap-2">
                             <span className="material-symbols-outlined text-3xl">moving</span>
                            {!imagePreview ? "Upload an image first" : "Click Train to render the Convolution Engine"}
                        </div>
                    );
                }

                const totalEpochs = results.loss_per_epoch.length;
                const ei = vizEpoch !== null ? Math.min(vizEpoch, totalEpochs - 1) : 0;
                const isFinished = ei === totalEpochs - 1;
                const epochDelay = Math.max(300, Math.min(1000, 5000 / totalEpochs));

                return (
                    <div className="space-y-6">
                        {/* Graphs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Train Loss</div>
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 border border-amber-600 rounded-sm border-dashed"></div> Val Loss</div>
                                    </div>
                                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold uppercase text-slate-600 tracking-wider">Epoch {ei + 1} / {totalEpochs}</span>
                                </div>
                                <div className="mx-4 relative h-48 border-l-2 border-b-2 border-slate-300 bg-slate-50 transition-all rounded-br rounded-tr">
                                    {renderGraph(ei)}
                                </div>
                            </div>
                            
                            <div>
                                {renderResultsPanel(ei, totalEpochs)}
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 w-full justify-center">
                                    <button
                                        onClick={() => {
                                            stopVizTimer();
                                            setVizEpoch(0);
                                            startVizPlay(0, totalEpochs, epochDelay);
                                        }}
                                        className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:from-purple-500 transition shadow-sm"
                                    >⟳ Replay Training Log</button>

                                    {vizPlaying ? (
                                        <button
                                            onClick={() => { stopVizTimer(); setVizPlaying(false); }}
                                            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                                        >⏸ Pause</button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (ei < totalEpochs - 1) startVizPlay(ei, totalEpochs, epochDelay);
                                            }}
                                            disabled={ei >= totalEpochs - 1}
                                            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40"
                                        >▶ Continue</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Feature Maps (Only show near end to simulate structure) */}
                        {isFinished && renderFeatureMaps()}
                    </div>
                );
            })()}

          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}


