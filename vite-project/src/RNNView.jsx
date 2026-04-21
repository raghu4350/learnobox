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


