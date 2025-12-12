import { useState, useEffect } from 'react'
import axios from 'axios'

// --- 1. DEFINISI IKON SVG (Sisanya tetap dipakai untuk bagian lain) ---
// Note: IconAnalyze sudah tidak dipakai di navbar, tapi dibiarkan di sini tidak apa-apa.
const IconAnalyze = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
)

const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
)

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
)

// --- 2. KOMPONEN UTAMA ---
function App() {
  const [inputText, setInputText] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:8000/api'

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await await axios.get(`${API_URL}/reviews`)
      setReviews(res.data)
    } catch (err) {
      console.error("Gagal load data", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputText) return
    setLoading(true)
    setError(null)

    try {
      await axios.post(`${API_URL}/analyze-review`, { text: inputText })
      setInputText('')
      fetchReviews()
    } catch (err) {
      setError('Gagal terhubung. Pastikan Backend sudah menyala.')
    } finally {
      setLoading(false)
    }
  }

  // Warna Status (Pastel Professional)
  const getStatusStyle = (label) => {
    if (label === 'POSITIVE') return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100'
    if (label === 'NEGATIVE') return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100'
    return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-100'
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm bg-white/90">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            {/* --- BAGIAN LOGO KUCING BARU --- */}
            <img 
              src="/favicon.png" 
              alt="Logo Kucing" 
              className="w-11 h-11 rounded-lg shadow-md shadow-indigo-200 object-cover"
            />
            {/* ------------------------------- */}

            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Review Analyzer</h1>
              <p className="text-xs text-slate-500 font-medium">AI-Powered Insights</p>
            </div>
          </div>
          {/* Identitas Kecil di Navbar */}
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-700">Muhammad Daffa Hakim Matondang</p>
            <p className="text-[10px] text-slate-400">123140002</p>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 flex-grow w-full">
        
        {/* INPUT SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Analysis</h2>
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">READY</span>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="relative group">
                <textarea
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 placeholder-slate-400 min-h-[120px] resize-y"
                  placeholder="Paste customer review here (Bahasa Indonesia/English/Slang)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-slate-400 hidden sm:block">
                  Supported models: RoBERTa Indo & Gemini 2.5
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${
                    loading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                    <>
                      <span>Analyze Review</span>
                      <IconSend />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 flex items-center gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">History & Results</h2>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {reviews.length} Records Found
            </span>
          </div>
          
          <div className="grid gap-6">
            {reviews.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <div className="text-slate-400"><IconList /></div>
                </div>
                <p className="text-slate-500 font-medium">No reviews analyzed yet.</p>
                <p className="text-xs text-slate-400">Submit your first review above.</p>
              </div>
            )}

            {reviews.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors duration-200 overflow-hidden group">
                
                {/* Review Text */}
                <div className="p-6 border-b border-slate-100 bg-white">
                  <p className="text-slate-800 leading-relaxed text-[15px] italic">"{item.product_text}"</p>
                </div>

                {/* Analysis Grid (Split View) */}
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
                  
                  {/* Left: Sentiment */}
                  <div className="p-5 md:col-span-4 flex flex-col justify-center bg-white md:bg-transparent">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-slate-400"><IconChart /></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sentiment Score</span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-bold border ring-1 ring-inset w-fit ${getStatusStyle(item.sentiment_label)}`}>
                        {item.sentiment_label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Rating: {item.sentiment_score}
                      </span>
                    </div>
                  </div>

                  {/* Right: Summary */}
                  <div className="p-5 md:col-span-8 bg-white md:bg-transparent">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-indigo-500"><IconList /></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Summary</span>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-indigo-100 ml-1 py-1">
                      {item.key_points}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER IDENTITAS */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-slate-700">Muhammad Daffa Hakim Matondang</p>
              <p className="text-xs text-slate-500">NIM: 123140002</p>
            </div>
            <p className="text-xs text-slate-400">
              &copy; 2025 Product Review Analyzer. Tugas Individu 3.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App