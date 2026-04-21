function MLPView({ onNavigate }) {
  const [lr, setLr] = useState(0.01);
  const [epochs, setEpochs] = useState(100);
  const [hiddenLayers, setHiddenLayers] = useState("16, 8");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Dynamic column names — updated when CSV is uploaded
  const [colNames, setColNames] = useState(['Study Hours', 'Attendance', 'Pass?']);

  const [testHours, setTestHours] = useState('');
  const [testAttendance, setTestAttendance] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

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

  const initialData = [
    [2, 50, 0],
    [3, 60, 0],
    [5, 70, 1],
    [7, 80, 1],
    [1, 40, 0],
    [8, 90, 1],
  ];

  const [data, setData] = useState(initialData);

  const handleManualPredict = async () => {
    if (!testHours || !testAttendance) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("http://localhost:8000/mlp/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours: parseFloat(testHours),
          attendance: parseFloat(testAttendance)
        })
      });
      const resData = await res.json();
      if (resData.error) {
        alert(resData.error);
      } else {
        setTestResult(resData);
      }
    } catch (err) {
      console.error(err);
      alert("Error predicting");
    } finally {
      setTestLoading(false);
    }
  };

  const handleTrain = async () => {
    setLoading(true);
    try {
      const parsedHidden = hiddenLayers.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const res = await fetch("http://localhost:8000/mlp/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data,
          learning_rate: parseFloat(lr),
          epochs: parseInt(epochs),
          hidden_layers: parsedHidden.length ? parsedHidden : [16, 8]
        })
      });
      const resData = await res.json();
      if (resData.error) {
        alert(resData.error);
      } else {
        setResults(resData);
        // Kick off visualization – auto-play with justified delay
        setVizEpoch(0);
        const totalEps = resData.loss_per_epoch?.length ?? 1;
        const delay = Math.max(300, Math.min(1200, Math.round(8000 / totalEps)));
        startVizPlay(0, totalEps, delay);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," + colNames.join(',') + "\n" + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mlp_data.csv");
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
        setTestHours('');
        setTestAttendance('');
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

  const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Multi-Layer Perceptron (MLP) Learning Module</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works (Theory)</h2>
            <p className="mb-4 text-sm text-slate-600">
              <strong>What is an MLP?</strong> A neural network with multiple layers (Input, Hidden, Output). Unlike a simple perceptron, it learns complex, non-linear patterns.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">Workflow:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>1. Input Layer:</strong> Takes data ({colNames[0]}, {colNames[1]}).</li>
              <li><strong>2. Hidden Layers:</strong> Neurons that discover hidden patterns.</li>
              <li><strong>3. Activation:</strong> Adds non-linearity to learn complex rules.</li>
              <li><strong>4. Output Layer:</strong> Gives prediction ({colNames[2]}).</li>
              <li><strong>5. Loss & Backprop:</strong> Computes error and updates weights to improve.</li>
            </ul>
             <p className="text-sm text-slate-600 mt-4">
              Upload any CSV with 2 numeric feature columns + 1 binary label column (0/1) to train on your own data!
            </p>
          </section>

          {/* Dataset Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">2. Sample Dataset</h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                {data.length} row{data.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="overflow-y-auto max-h-48 rounded border border-slate-200 flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-400 w-8">#</th>
                    <th className="px-4 py-2 font-semibold">{colNames[0]}</th>
                    <th className="px-4 py-2 font-semibold">{colNames[1]}</th>
                    <th className="px-4 py-2 font-semibold">{colNames[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 15).map((row, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-xs text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-4 py-2">{row[0]}</td>
                      <td className="px-4 py-2">{row[1]}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${row[2] ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {row[2] ? '1' : '0'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.length > 15 && (
                    <tr className="border-t border-dashed border-slate-200 bg-slate-50">
                      <td colSpan={4} className="px-4 py-2 text-center text-xs text-slate-400 tracking-widest font-medium">
                        · · · {data.length - 15} more row{data.length - 15 !== 1 ? 's' : ''} hidden · · ·
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
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Hidden Layers (comma separated neurons)</label>
                <input type="text" value={hiddenLayers} onChange={e => setHiddenLayers(e.target.value)} placeholder="e.g. 16, 8" className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
              {loading ? 'Training...' : 'Train MLP Model'}
            </button>
          </section>

          {/* Graph & Results Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">4. Live Epoch Graph & Output</h2>
            {results && !results.error ? (
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Epoch Loss</span>
                  <span className="font-mono text-xs">{results.loss_per_epoch[results.loss_per_epoch.length - 1]?.toFixed(4)} final</span>
                </div>
                <div className="mx-4 mb-4 relative h-48 border-l-2 border-b-2 border-slate-300 bg-slate-50">
                  {renderGraph()}
                  <div className="absolute top-0 -left-10 text-xs text-slate-400">{Math.max(...results.loss_per_epoch).toFixed(2)}</div>
                  <div className="absolute bottom-0 -left-6 text-xs text-slate-400">0</div>
                </div>

                {/* Result Section */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">Model Output</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100 text-center shadow-inner">
                      <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1">Train Accuracy</p>
                      <p className="text-2xl font-bold text-purple-900">{results.train_accuracy.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100 text-center shadow-inner">
                      <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">Test Accuracy</p>
                      <p className="text-2xl font-bold text-indigo-900">{results.test_accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 shadow-inner">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Predictions (First few)</p>
                    <p className="font-mono text-slate-900 break-all text-xs">
                      [{results.predictions.slice(0, 10).join(', ')}{results.predictions.length > 10 ? ', ...' : ''}]
                    </p>
                  </div>
                </div>

                {/* Test Your Input Section */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">Test Your Input</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{colNames[0]}</label>
                      <input type="number" step="0.1" value={testHours} onChange={e => setTestHours(e.target.value)} placeholder={`Enter ${colNames[0]}`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{colNames[1]}</label>
                      <input type="number" step="0.1" value={testAttendance} onChange={e => setTestAttendance(e.target.value)} placeholder={`Enter ${colNames[1]}`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                  </div>
                  <button onClick={handleManualPredict} disabled={testLoading} className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
                    {testLoading ? 'Predicting...' : 'Predict Result'}
                  </button>
                  {testResult && !testResult.error && (
                    <div className={`mt-4 rounded-lg p-3 text-center border font-bold flex justify-between items-center ${testResult.prediction === 'Pass' || testResult.prediction === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      <span className="text-sm">Result: {colNames[2]} = {testResult.prediction === 'Pass' || testResult.prediction === 1 ? '1 ✅' : '0 ❌'}</span>
                      <span className="text-xs uppercase tracking-wide opacity-80">Confidence: {(testResult.confidence * 100).toFixed(1)}%</span>
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
            <p className="mb-6 text-sm text-slate-500">Watch the MLP network dynamically update. Due to high density, nodes are visually capped per layer.</p>

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
              const totalEpochs = lpe.length;
              const ei = vizEpoch !== null ? Math.min(vizEpoch, totalEpochs - 1) : 0;
              const isFinished = ei === totalEpochs - 1;
              const loss = lpe[ei];
              const maxLoss = Math.max(...lpe, 1);
              const pct = Math.max(0, 100 - (loss / maxLoss) * 100);
              const epochDelay = Math.max(300, Math.min(1200, Math.round(8000 / totalEpochs)));

              // Architectural definitions
              const inputNodes = 2;
              const outputNodes = 1;
              const parsedHidden = hiddenLayers.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
              const arch = [inputNodes, ...(parsedHidden.length ? parsedHidden : [16, 8]), outputNodes];
              
              const MAX_DRAWN = 6;
              const layersToDraw = arch.map(n => Math.min(n, MAX_DRAWN));

              return (
                <div className="space-y-6">
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
                    <svg viewBox="0 0 600 300" className="w-full" style={{ minHeight: 280, maxHeight: 400 }}>
                      <defs>
                        <filter id="glowMLP">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      {(() => {
                        // Compute node coordinates
                        const nodes = [];
                        const colWidth = 600 / (layersToDraw.length + 1);
                        layersToDraw.forEach((numNodes, li) => {
                          const x = colWidth * (li + 1) - 30; // shift slightly left
                          const ys = [];
                          const spacing = 45;
                          const startY = 150 - ((numNodes - 1) * spacing) / 2;
                          for(let i=0; i<numNodes; i++) {
                            ys.push(startY + i * spacing);
                            nodes.push({layer: li, index: i, x, y: startY + i * spacing, total: arch[li]});
                          }
                        });

                        // Draw edges
                        const edges = [];
                        for(let li=0; li<layersToDraw.length-1; li++) {
                          const currNodes = nodes.filter(n => n.layer === li);
                          const nextNodes = nodes.filter(n => n.layer === li + 1);

                          // Attempt to extract weights if wpe length matches layers 
                          // Keras normally returns [W1, b1, W2, b2, ...Wn, bn]
                          // The number of W matrices is layersToDraw.length - 1
                          let W = null;
                          if (wpe[ei] && wpe[ei].length > (li * 2)) {
                            W = wpe[ei][li * 2]; // Extract weight matrix for this transition
                          }

                          currNodes.forEach(cn => {
                            nextNodes.forEach(nn => {
                              // Get weight value if safely accessible
                              let weightVal = 0.5; // fallback neutral
                              if (W && W[cn.index] && W[cn.index][nn.index] !== undefined) {
                                  weightVal = W[cn.index][nn.index];
                              }
                              
                              const isPositive = weightVal > 0;
                              const thick = Math.max(0.5, Math.min(3, Math.abs(weightVal) * 1.5));
                              const color = isPositive ? '#8b5cf6' : '#f43f5e';
                              const opac = Math.max(0.1, Math.min(0.8, Math.abs(weightVal)));

                              edges.push(
                                <line key={`e-${li}-${cn.index}-${nn.index}`} x1={cn.x} y1={cn.y} x2={nn.x} y2={nn.y} stroke={color} strokeWidth={thick} strokeOpacity={opac} />
                              );
                            });
                          });
                        }

                        // Draw nodes
                        const drawnNodes = nodes.map(n => {
                          const isInput = n.layer === 0;
                          const isOutput = n.layer === layersToDraw.length - 1;
                          const color = isInput ? '#6366f1' : isOutput ? '#10b981' : '#a855f7';
                          
                          return (
                            <g key={`n-${n.layer}-${n.index}`}>
                                <circle cx={n.x} cy={n.y} r={10} fill="#fff" stroke={color} strokeWidth="3" filter="url(#glowMLP)" />
                                {n.index === MAX_DRAWN - 1 && n.total > MAX_DRAWN && (
                                   <text x={n.x} y={n.y + 25} textAnchor="middle" fontSize="12" fill="#94a3b8">⋮</text>
                                )}
                            </g>
                          )
                        });

                        return (
                           <g>
                             {edges}
                             {drawnNodes}
                             {/* Stats Badge */}
                             <rect x="420" y="20" width="160" height="52" rx="6" fill="white" fillOpacity="0.9" stroke="#e2e8f0" strokeWidth="1" />
                             <text x="500" y="40" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">EPOCH {ei + 1} STATS</text>
                             <text x="500" y="55" textAnchor="middle" fontSize="10" fill="#7c3aed">Loss: {loss?.toFixed(4)}</text>
                             <text x="500" y="68" textAnchor="middle" fontSize="9" fill={loss < 0.1 ? '#059669' : '#d97706'}>
                                {loss < 0.1 ? '✓ Low Error' : '⚡ Updating…'}
                             </text>

                             {/* Helper text */}
                             <text x={nodes.find(n => n.layer === 0)?.x} y="280" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">INPUTS</text>
                             <text x={nodes.find(n => n.layer === layersToDraw.length - 1)?.x} y="280" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">OUTPUT</text>
                           </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Playback Controls (same as perceptron) */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4">
                      {/* ── Progress bars ── */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                            <span>Accuracy Trend (Approx)</span>
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
                        <button
                          onClick={() => {
                            stopVizTimer();
                            setVizEpoch(0);
                            startVizPlay(0, totalEpochs, epochDelay);
                          }}
                          className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition shadow-sm"
                        >⟳ Replay</button>

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
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizEpoch(e => Math.max(0, (e ?? 0) - 1)); }}
                          disabled={ei === 0}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                        >← Prev</button>
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizEpoch(e => Math.min(totalEpochs - 1, (e ?? 0) + 1)); }}
                          disabled={ei >= totalEpochs - 1}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                        >Next →</button>
                      </div>
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


