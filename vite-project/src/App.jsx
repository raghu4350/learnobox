import { useState, useRef, useEffect, useCallback } from 'react'

const models = [
  {
    name: 'Perceptron',
    description:
      'The simplest neural unit: weighted inputs, bias, and a step or activation output.',
    difficulty: 'Beginner',
    difficultyClass:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80',
    icon: 'blur_on',
  },
  {
    name: 'Multi-Layer Perceptron (MLP)',
    description:
      'Stacked layers of neurons that learn non-linear decision boundaries.',
    difficulty: 'Beginner',
    difficultyClass:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80',
    icon: 'account_tree',
  },
  {
    name: 'Convolutional Neural Network (CNN)',
    description:
      'Spatial filters and pooling for images, video, and grid-like data.',
    difficulty: 'Intermediate',
    difficultyClass:
      'bg-amber-50 text-amber-800 ring-1 ring-amber-200/80',
    icon: 'grid_view',
  },
  {
    name: 'Recurrent Neural Network (RNN)',
    description:
      'Hidden state over sequences—ideal for time series and ordered inputs.',
    difficulty: 'Intermediate',
    difficultyClass:
      'bg-amber-50 text-amber-800 ring-1 ring-amber-200/80',
    icon: 'repeat',
  },
  {
    name: 'Long Short-Term Memory (LSTM)',
    description:
      'Gated memory cells that capture long-range dependencies in sequences.',
    difficulty: 'Advanced',
    difficultyClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80',
    icon: 'memory',
  },
  {
    name: 'Hopfield Network',
    description:
      'Associative memory via energy minimization and recurrent symmetric weights.',
    difficulty: 'Advanced',
    difficultyClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80',
    icon: 'hub',
  },
]

const pathSteps = [
  { step: 1, title: 'Basics', detail: 'Neurons, weights, and activations' },
  {
    step: 2,
    title: 'Forward Propagation',
    detail: 'How signals flow layer to layer',
  },
  {
    step: 3,
    title: 'Backpropagation',
    detail: 'Gradients and learning from error',
  },
  { step: 4, title: 'Advanced Models', detail: 'CNNs, RNNs, and beyond' },
]

const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }

function MainNav({ active, onNavigate, searchPlaceholder }) {
  const tabClass = (view) =>
    active === view
      ? 'border-b-2 border-purple-600 pb-0.5 text-slate-700'
      : 'transition-colors hover:text-slate-700'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-200/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-3.5 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="shrink-0 text-left text-xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Learno</span>
            <span className="text-purple-600">box</span>
          </button>

          <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500 md:order-none md:flex-1 md:justify-center lg:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={tabClass('home')}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className={tabClass('learn')}
            >
              Learn
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <label className="relative hidden lg:block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </span>
              <input
                type="search"
                placeholder={searchPlaceholder}
                className="w-56 rounded-full border border-slate-200/90 bg-slate-100/80 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-inner shadow-white/50 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20"
              />
            </label>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined text-[22px]">
                person
              </span>
            </button>
          </div>
        </div>

        <label className="relative mt-3 lg:hidden">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-slate-200/90 bg-slate-100/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-inner outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
      </div>
    </header>
  )
}

function AppFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-bold text-slate-900">Learnobox</p>
          <p className="mt-1 text-xs leading-relaxed">
            © 2024 Learnobox Archive. Designed for intellectual breathing room.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <a href="#" className="hover:text-slate-700">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-700">
            Terms
          </a>
          <a href="#" className="hover:text-slate-700">
            Support
          </a>
          <a href="#" className="hover:text-slate-700">
            Documentation
          </a>
        </nav>
      </div>
    </footer>
  )
}

function HomeView({ onNavigate }) {
  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased"
      style={fontStyle}
    >
      <MainNav
        active="home"
        onNavigate={onNavigate}
        searchPlaceholder="Search..."
      />

      <main className="mx-auto max-w-6xl flex-1 px-6 pb-16 pt-12 lg:px-8 lg:pt-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600"
            aria-hidden
          />
          <span>NEW: VISUALIZING TRANSFORMERS</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          Learnobox
        </h1>
        <p className="mb-12 max-w-2xl text-lg text-slate-600 md:text-xl">
          Learn and Visualize AI Models Interactively
        </p>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <article className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 ring-1 ring-slate-100">
            <span
              className="material-symbols-outlined pointer-events-none absolute -right-2 -top-2 text-[140px] leading-none text-slate-100"
              aria-hidden
            >
              bookmark
            </span>
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-purple-600">
                <span className="material-symbols-outlined text-[26px]">
                  menu_book
                </span>
              </div>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                Learn Neural Networks
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-slate-600">
                Deep dive into activation functions and architectures. Master the
                mathematics behind backpropagation through interactive
                visualizations.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-600/25 transition-opacity hover:opacity-95"
              >
                Get Started
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 ring-1 ring-slate-100">
            <span
              className="material-symbols-outlined pointer-events-none absolute -right-2 -top-2 text-[140px] leading-none text-slate-100"
              aria-hidden
            >
              terminal
            </span>
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-purple-600">
                <span className="material-symbols-outlined text-[26px]">
                  hub
                </span>
              </div>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                Explore architectures
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-slate-600">
                Browse perceptrons, CNNs, RNNs, and more—structured lessons and
                visual highlights in one place.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-600/25 transition-opacity hover:opacity-95"
              >
                View topics
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-5 rounded-2xl bg-slate-100/90 p-6 ring-1 ring-slate-200/60 sm:flex-row sm:items-stretch md:p-7">
            <div
              className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 sm:h-auto sm:w-44"
              aria-hidden
            >
              <div className="absolute inset-0 opacity-80">
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl" />
                <div className="absolute bottom-2 right-2 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.35),transparent_50%)]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                Real-time Inference
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">
                Our engine uses WebGL to render million-parameter models directly
                in your browser at 60fps.
              </p>
              <a
                href="#"
                className="w-fit text-sm font-medium text-purple-600 underline decoration-purple-600 underline-offset-2 hover:text-purple-700"
              >
                Read Technical Specs
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-100/90 px-6 py-10 ring-1 ring-slate-200/60 md:py-12">
            <p className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              5+
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              PRE-TRAINED MODELS
            </p>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

function LearnView({ onNavigate }) {
  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased"
      style={fontStyle}
    >
      <MainNav
        active="learn"
        onNavigate={onNavigate}
        searchPlaceholder="Search concept..."
      />

      <main className="mx-auto max-w-6xl flex-1 px-6 pb-20 pt-10 lg:px-8 lg:pt-14">
        <header className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-purple-700 shadow-sm">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600"
              aria-hidden
            />
            Beginner Friendly
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            Learn Neural Networks
          </h1>
          <p className="text-lg text-slate-600 md:text-xl">
            Understand models visually and interactively
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="models-heading">
              <h2 id="models-heading" className="sr-only">
                Model topics
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {models.map((m) => (
                  <article
                    key={m.name}
                    className="group flex flex-col rounded-xl border border-slate-100/90 bg-white p-6 shadow-md shadow-slate-200/40 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-purple-600 transition group-hover:bg-purple-50">
                        <span className="material-symbols-outlined text-[24px]">
                          {m.icon}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${m.difficultyClass}`}
                      >
                        {m.difficulty}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">
                      {m.name}
                    </h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                      {m.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (m.name === 'Perceptron') onNavigate('perceptron');
                        if (m.name === 'Recurrent Neural Network (RNN)') onNavigate('rnn');
                        if (m.name === 'Long Short-Term Memory (LSTM)') onNavigate('lstm');
                        if (m.name === 'Convolutional Neural Network (CNN)') onNavigate('cnn');
                        if (m.name === 'Multi-Layer Perceptron (MLP)') onNavigate('mlp');
                        if (m.name === 'Hopfield Network') onNavigate('hopfield');
                      }}
                      className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      Start Learning
                      <span className="material-symbols-outlined text-[18px]">
                        school
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="visual-heading"
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 md:p-10"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <h2
                    id="visual-heading"
                    className="mb-3 text-xl font-bold text-slate-900 md:text-2xl"
                  >
                    See how data flows through neurons in real-time
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
                    Open the visualizer to watch activations, weights, and
                    gradients update as you step through a network—no install
                    required.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40"
                  >
                    Launch Visualizer
                    <span className="material-symbols-outlined text-[20px]">
                      play_circle
                    </span>
                  </button>
                </div>
                <div
                  className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 shadow-inner lg:h-56 lg:w-[320px]"
                  aria-hidden
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(129,140,248,0.45),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.35),transparent_45%)]" />
                  <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-5xl text-purple-200/90">
                      hub
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40 ring-1 ring-slate-100">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-purple-600">
                Learning path
              </p>
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Your roadmap
              </h3>
              <ol className="space-y-0">
                {pathSteps.map((s, i) => (
                  <li key={s.step} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < pathSteps.length - 1 ? (
                      <div
                        className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-purple-200 to-slate-200"
                        aria-hidden
                      />
                    ) : null}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md shadow-purple-500/30">
                      {s.step}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-semibold text-slate-900">{s.title}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/perceptron/train`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/rnn/train`, {
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
          <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
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
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'number' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>Numeric</button>
                <button 
                  onClick={() => handleModeChange("text")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'text' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>Text</button>
              </div>
            </div>

                                    <div className="flex-1 bg-slate-50 rounded border border-slate-200 p-3 overflow-y-auto max-h-40 flex flex-wrap gap-2 content-start">
               {data.slice(0, 50).map((d, i) => (
                 <span key={i} className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-700">
                   {d}
                 </span>
               ))}
               {data.length > 50 && (
                 <span className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-400">
                   +{data.length - 50} more
                 </span>
               )}
             </div>
            <div className="mt-4">
              <label className="text-sm text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center">
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
                <input type="number" min="2" value={seqLen} onChange={e => setSeqLen(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hidden Units</label>
                <input type="number" min="4" value={hiddenUnits} onChange={e => setHiddenUnits(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
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
                          ${stepIdx === idx ? 'bg-purple-500 text-white shadow-lg scale-110' : 
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
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded"></div> Positive Memory</span>
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Negative Memory</span>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { stopVizTimer(); setVizStep(0); startVizPlay(0, numSteps, delay); }}
                        className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white hover:from-rose-500 transition shadow-sm"
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/lstm/train`, {
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
          <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
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
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'number' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>Numeric</button>
                <button 
                  onClick={() => handleModeChange("text")}
                  className={`px-3 py-1 rounded text-xs font-semibold ${mode === 'text' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>Text</button>
              </div>
            </div>

                                    <div className="flex-1 bg-slate-50 rounded border border-slate-200 p-3 overflow-y-auto max-h-40 flex flex-wrap gap-2 content-start">
               {data.slice(0, 50).map((d, i) => (
                 <span key={i} className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-700">
                   {d}
                 </span>
               ))}
               {data.length > 50 && (
                 <span className="inline-block bg-white border border-slate-200 px-2.5 py-1 text-sm rounded shadow-sm text-slate-400">
                   +{data.length - 50} more
                 </span>
               )}
             </div>
            <div className="mt-4">
              <label className="text-sm text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition font-medium cursor-pointer inline-flex items-center">
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
                <input type="number" min="2" value={seqLen} onChange={e => setSeqLen(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hidden Units</label>
                <input type="number" min="4" value={hiddenUnits} onChange={e => setHiddenUnits(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" value={lr} onChange={e => setLr(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Epochs</label>
                <input type="number" value={epochs} onChange={e => setEpochs(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition shadow-sm hover:border-purple-300" />
              </div>
            </div>
            <button onClick={handleTrain} disabled={loading} className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
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
                          ${stepIdx === idx ? 'bg-purple-500 text-white shadow-lg scale-110' : 
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
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded"></div> Positive Memory</span>
                       <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Negative Memory</span>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { stopVizTimer(); setVizStep(0); startVizPlay(0, numSteps, delay); }}
                        className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white hover:from-rose-500 transition shadow-sm"
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/cnn/train`, {
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
            healthColor = "text-purple-600";
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
            <button onClick={handleTrain} disabled={loading || (!imagePreview)} className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
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


function MLPView({ onNavigate }) {
  const [lr, setLr] = useState(0.01);
  const [epochs, setEpochs] = useState(10);
  const [hiddenLayers, setHiddenLayers] = useState("16, 8");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Dynamic column names — updated when CSV is uploaded
  

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


  const [colNames, setColNames] = useState(['Study Hours', 'Attendance', 'Pass?']);

  const handleDownload = () => {
    const header = colNames.join(',');
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + data.map(e => e.join(",")).join("\n");
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
      const lines = text.trim().split('\n');
      if (lines.length < 2) return;
      
      const newColNames = lines[0].split(',').map(s => s.trim());
      if (newColNames.length !== 3) {
        alert("MLP Dataset must have exactly 3 columns (e.g. Feature1, Feature2, Class)");
        return;
      }
      setColNames(newColNames);

      const parsedData = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        if (cols.length === 3) {
          const numCols = cols.map(c => parseFloat(c));
          if (!numCols.some(isNaN)) {
            parsedData.push(numCols);
          }
        }
      }
      
      if (parsedData.length > 0) {
        setData(parsedData);
      }
    };
    reader.readAsText(file);
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

  const handleManualPredict = async () => {
    if (!testHours || !testAttendance) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/mlp/predict`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/mlp/train`, {
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
              <strong>What is an MLP?</strong> A Multi-Layer Perceptron uses stacked layers of neurons to learn complex non-linear patterns from data — going beyond simple linear separation.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">Workflow:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>1. Input Layer:</strong> Receives features (Study Hours, Attendance %).</li>
              <li><strong>2. Hidden Layers:</strong> Dense layers with ReLU activation learn non-linear patterns.</li>
              <li><strong>3. Backpropagation:</strong> Computes gradients and updates weights to minimize loss.</li>
              <li><strong>4. Output Layer:</strong> Sigmoid activation outputs pass/fail probability.</li>
              <li><strong>5. Loss &amp; Accuracy:</strong> Binary cross-entropy tracks training progress.</li>
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
                    <th className="px-4 py-2 font-semibold">Study Hours</th>
                    <th className="px-4 py-2 font-semibold">Attendance %</th>
                    <th className="px-4 py-2 font-semibold">Pass? (1/0)</th>
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
                      <label className="mb-1 block text-sm font-medium text-slate-700">Pixel Width</label>
                      <input type="number" step="0.1" value={testHours} onChange={e => setTestHours(e.target.value)} placeholder={`Enter $Pixel Width`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Pixel Height</label>
                      <input type="number" step="0.1" value={testAttendance} onChange={e => setTestAttendance(e.target.value)} placeholder={`Enter $Pixel Height`} className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                    </div>
                  </div>
                  <button onClick={handleManualPredict} disabled={testLoading} className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition">
                    {testLoading ? 'Predicting...' : 'Predict Result'}
                  </button>
                  {testResult && !testResult.error && (
                    <div className={`mt-4 rounded-lg p-3 text-center border font-bold flex justify-between items-center ${testResult.prediction === 'Pass' || testResult.prediction === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      <span className="text-sm">Result: Class = {testResult.prediction === 'Pass' || testResult.prediction === 1 ? '1 ✅' : '0 ❌'}</span>
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

                              const animDur = (1.5 + ((cn.index + nn.index) % 5) * 0.2) + "s";
                              edges.push(
                                <g key={`e-${li}-${cn.index}-${nn.index}`}>
                                  <line x1={cn.x} y1={cn.y} x2={nn.x} y2={nn.y} stroke={color} strokeWidth={thick} strokeOpacity={opac} />
                                  <circle r={thick * 0.8 + 1} fill={color} opacity={Math.max(0.3, opac)}>
                                    <animate attributeName="cx" values={`${cn.x};${nn.x}`} dur={animDur} repeatCount="indefinite" />
                                    <animate attributeName="cy" values={`${cn.y};${nn.y}`} dur={animDur} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values={`0;${Math.max(0.3, opac)};0`} dur={animDur} repeatCount="indefinite" />
                                  </circle>
                                </g>
                              );
                            });
                          });
                        }

                        // Draw nodes
                        const drawnNodes = nodes.map(n => {
                          const isInput = n.layer === 0;
                          const isOutput = n.layer === layersToDraw.length - 1;
                          const color = isInput ? '#6366f1' : isOutput ? '#10b981' : '#a855f7';
                          
                          const pulseDur = (2 + (n.index % 3) * 0.5) + "s";
                          return (
                            <g key={`n-${n.layer}-${n.index}`}>
                                <circle cx={n.x} cy={n.y} r={10} fill="#fff" stroke={color} strokeWidth="3" filter="url(#glowMLP)">
                                   <animate attributeName="r" values="10;12.5;10" dur={pulseDur} repeatCount="indefinite" />
                                   <animate attributeName="stroke-width" values="3;4;3" dur={pulseDur} repeatCount="indefinite" />
                                </circle>
                                {n.index === MAX_DRAWN - 1 && n.total > MAX_DRAWN && (
                                   <text x={n.x} y={n.y + 25} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#94a3b8">⋮</text>
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


function HopfieldView({ onNavigate }) {
  const GRID_SIZE = 10;
  const fontStyle = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill(0));
  const [recalledGrid, setRecalledGrid] = useState(null);
  
  // Model Training variables
  const [loading, setLoading] = useState(false);
  const [storedPatternsCount, setStoredPatternsCount] = useState(0);

  // Visualization variables
  const [vizStates, setVizStates] = useState(null);
  const [vizEnergies, setVizEnergies] = useState(null);
  const [vizIter, setVizIter] = useState(null);
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizTimerRef = useRef(null);

  const stopVizTimer = useCallback(() => {
    if (vizTimerRef.current) {
      clearInterval(vizTimerRef.current);
      vizTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopVizTimer, [stopVizTimer]);

  const startVizPlay = useCallback((fromIter, totalIters, delay) => {
    stopVizTimer();
    setVizPlaying(true);
    let cur = fromIter;
    vizTimerRef.current = setInterval(() => {
      cur++;
      if (cur >= totalIters) {
        clearInterval(vizTimerRef.current);
        vizTimerRef.current = null;
        setVizPlaying(false);
        setVizIter(totalIters - 1);
      } else {
        setVizIter(cur);
      }
    }, delay);
  }, [stopVizTimer]);

  const toggleCell = (i) => {
    const newGrid = [...grid];
    newGrid[i] = newGrid[i] === 0 ? 1 : 0;
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(0));
    setRecalledGrid(null);
    setVizStates(null);
    setVizEnergies(null);
    setVizIter(0);
    stopVizTimer();
    setVizPlaying(false);
  };

  const addNoise = () => {
    const noiseLevel = 0.15;
    const newGrid = grid.map((val) =>
      Math.random() < noiseLevel ? (val === 0 ? 1 : 0) : val
    );
    setGrid(newGrid);
  };

  const drawSmiley = () => {
    const s = Array(GRID_SIZE * GRID_SIZE).fill(0);
    const setPx = (r, c) => { s[r * 10 + c] = 1; };
    setPx(2, 2); setPx(2, 3); setPx(2, 6); setPx(2, 7); // Eyes
    setPx(3, 2); setPx(3, 3); setPx(3, 6); setPx(3, 7); // Eyes
    setPx(7, 2); setPx(8, 3); setPx(8, 4); setPx(8, 5); setPx(8, 6); setPx(7, 7); // Smile
    setGrid(s);
  };

  const storePatterns = async () => {
    setLoading(true);
    const userPattern = [...Array(10)].map((_, i) =>
      grid.slice(i * 10, (i + 1) * 10)
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/hopfield/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patterns: [userPattern],
        }),
      });

      const data = await res.json();
      if (!data.error) {
        setStoredPatternsCount(count => count + 1);
        alert(data.message || "Pattern Stored!");
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Error storing pattern");
    } finally {
      setLoading(false);
    }
  };

  const recallPattern = async () => {
    setLoading(true);
    const inputPattern = [...Array(10)].map((_, i) =>
      grid.slice(i * 10, (i + 1) * 10)
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/hopfield/recall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_pattern: inputPattern }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setRecalledGrid(data.recalled_pattern.flat());
      setVizStates(data.states_per_iteration);
      setVizEnergies(data.energy);
      
      const totalIters = data.states_per_iteration.length;
      setVizIter(0);
      const delay = Math.max(300, Math.min(1000, 5000 / totalIters));
      startVizPlay(0, totalIters, delay);
      
    } catch (err) {
      console.error(err);
      alert("Error recalling pattern");
    } finally {
      setLoading(false);
    }
  };

  const renderGrid = (g, onClickFn) => (
    <div
      className="grid gap-px border border-slate-300 w-fit p-px bg-slate-200 rounded mx-auto"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
      }}
    >
      {g.map((cell, i) => (
        <div
          key={i}
          onClick={onClickFn ? () => onClickFn(i) : undefined}
          className={`aspect-square w-6 sm:w-7 
          ${cell === 1 ? "bg-slate-800" : "bg-white"} 
          ${onClickFn ? "cursor-pointer hover:bg-slate-300" : ""}`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased" style={fontStyle}>
      <MainNav active="learn" onNavigate={onNavigate} searchPlaceholder="Search..." />
      <main className="mx-auto max-w-5xl flex-1 px-6 pb-20 pt-10 lg:px-8">
        <button onClick={() => onNavigate('learn')} className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Back to Models
        </button>
        <h1 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Hopfield Network Learning Module</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Theory Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">1. How it Works (Theory)</h2>
            <p className="mb-4 text-sm text-slate-600">
              <strong>What is a Hopfield Network?</strong> It acts as a biologically-inspired associative memory. Instead of outputting a simple 'yes/no' classification, it memorizes global patterns and can perfectly reconstruct them even if half the image is destroyed.
            </p>
            <h3 className="mb-2 font-semibold text-slate-800">Workflow:</h3>
            <ul className="mb-4 list-inside list-disc text-sm text-slate-600 space-y-1">
              <li><strong>1. Storage Phase:</strong> You draw a binary pattern. The network adjusts its internal weights to turn your drawing into an "energy minimum".</li>
              <li><strong>2. Destruction:</strong> We artificially corrupt your drawing with noise.</li>
              <li><strong>3. Recall Phase:</strong> The network "relaxes" asynchronously, flipping pixels one by one down the energy gradient until your original memory is perfectly recovered!</li>
            </ul>
             <p className="text-sm text-slate-500 mt-4 font-mono bg-slate-50 p-2 rounded">
              Current Memory Capacity: {storedPatternsCount} patterns stored.
            </p>
          </section>

          {/* Interactive Pattern Grid */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
             <div className="w-full mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">2. Draw Database</h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                10x10 Grid
              </span>
            </div>

            <div className="mb-4">
              {renderGrid(grid, toggleCell)}
            </div>

            <div className="flex flex-wrap gap-2 justify-center w-full">
              <button 
                onClick={drawSmiley} 
                className="text-[11px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded transition">
                Smiley Stamp
              </button>
              <button 
                onClick={clearCanvas} 
                className="text-[11px] font-bold uppercase tracking-wider text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded transition">
                Clear
              </button>
            </div>

             <div className="mt-6 flex flex-col gap-3 w-full">
               <button 
                onClick={storePatterns} 
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-bold text-white shadow hover:bg-indigo-500 disabled:opacity-50 transition">
                [1] Store Memory
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={addNoise} 
                  className="flex-1 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 font-bold text-amber-700 shadow-sm hover:bg-amber-100 transition">
                  [2] Add Noise
                </button>
                <button 
                  onClick={recallPattern} 
                  disabled={loading}
                  className="flex-1 rounded-lg bg-violet-600 px-4 py-2 font-bold text-white shadow hover:bg-violet-500 disabled:opacity-50 transition">
                  [3] Async Recall
                </button>
              </div>
            </div>
          </section>

          {/* Visualization Engine */}
          <section className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-900">3. Energy Minimization Visualization</h2>
            <p className="mb-6 text-sm text-slate-500">Watch the network asynchronously update its neurons down the energy gradient until stability is reached.</p>

            {(() => {
              if (!vizStates || !vizEnergies) {
                return (
                  <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    <span className="material-symbols-outlined mr-2 text-[20px]">hub</span>
                    Run "[3] Async Recall" to see the Hopfield convergence!
                  </div>
                );
              }

              const totalIters = vizStates.length;
              const ei = vizIter !== null ? Math.min(vizIter, totalIters - 1) : 0;
              const isFinished = ei === totalIters - 1;
              const currentGrid = vizStates[ei].flat();
              const energy = vizEnergies[ei];
              const minEnergy = Math.min(...vizEnergies);
              const maxEnergy = Math.max(...vizEnergies, 0);
              const epochDelay = Math.max(300, Math.min(1000, 5000 / totalIters));
              
              // Map energy to a 0-100% progress for the timeline
              const eRange = (maxEnergy - minEnergy) || 1;
              const fillPct = 100 - ((energy - minEnergy) / eRange) * 100;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-xl border border-slate-200 p-6">
                    {/* Visualizer Grid */}
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex justify-between w-full max-w-[280px]">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">State (Iter {ei})</span>
                        {isFinished && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">Stable</span>}
                      </div>
                      {renderGrid(currentGrid)}
                    </div>
                    
                    {/* Energy Chart / Info */}
                    <div className="flex flex-col h-full justify-center">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Thermodynamics</h3>
                       <div className="text-4xl font-bold font-mono text-indigo-900 mb-2">
                         {energy.toFixed(2)}
                       </div>
                       <p className="text-xs text-slate-500 mb-6 font-medium">As pixels flip to match internal weights, global energy inevitably drops.</p>

                       <div className="w-full bg-slate-200 rounded-full h-3 mb-1 overflow-hidden">
                          <div className="bg-gradient-to-r from-rose-400 to-indigo-600 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.max(5, fillPct)}%` }}></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                         <span>High Energy (Unstable)</span>
                         <span>Low Energy (Pattern Recovered)</span>
                       </div>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4">
                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Convergence Timeline</span>
                          <span>{ei} / {totalIters - 1}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                            style={{ width: totalIters > 1 ? `${(ei / (totalIters - 1)) * 100}%` : '100%' }} />
                        </div>
                      </div>

                      {/* Button row */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            stopVizTimer();
                            setVizIter(0);
                            startVizPlay(0, totalIters, epochDelay);
                          }}
                          className="flex-1 min-w-[80px] rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white hover:from-purple-500 transition shadow-sm"
                        >⟳ Replay</button>

                        {vizPlaying ? (
                          <button
                            onClick={() => { stopVizTimer(); setVizPlaying(false); }}
                            className="flex-1 min-w-[80px] rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                          >⏸ Pause</button>
                        ) : (
                          <button
                            onClick={() => {
                              if (ei < totalIters - 1) startVizPlay(ei, totalIters, epochDelay);
                            }}
                            disabled={ei >= totalIters - 1}
                            className="flex-1 min-w-[80px] rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40"
                          >▶ Continue</button>
                        )}
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizIter(e => Math.max(0, (e ?? 0) - 1)); }}
                          disabled={ei === 0}
                          className="flex-1 min-w-[60px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                        >← Prev</button>
                        <button
                          onClick={() => { stopVizTimer(); setVizPlaying(false); setVizIter(e => Math.min(totalIters - 1, (e ?? 0) + 1)); }}
                          disabled={ei >= totalIters - 1}
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

function App() {
  const [appView, setAppView] = useState('home')

  if (appView === 'learn') {
    return <LearnView onNavigate={setAppView} />
  }
  if (appView === 'perceptron') {
    return <PerceptronView onNavigate={setAppView} />
  }
  if (appView === 'lstm') {
    return <LSTMView onNavigate={setAppView} />
  }
  if (appView === 'rnn') {
    return <RNNView onNavigate={setAppView} />
  }
  if (appView === 'cnn') {
    return <CNNView onNavigate={setAppView} />
  }
  if (appView === 'mlp') {
    return <MLPView onNavigate={setAppView} />
  }
  if (appView === 'hopfield') {
    return <HopfieldView onNavigate={setAppView} />
  }

  return <HomeView onNavigate={setAppView} />
}

export default App
