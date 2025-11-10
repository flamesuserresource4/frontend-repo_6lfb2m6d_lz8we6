import { useEffect, useState } from 'react'

function App() {
  const [features, setFeatures] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${backend}/api/features`)
        if (!res.ok) throw new Error('Failed to load content')
        const data = await res.json()
        setFeatures(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatures()
  }, [backend])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const res = await fetch(`${backend}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'landing' }),
      })
      if (!res.ok) throw new Error('Submission failed')
      const data = await res.json()
      setSubmitResult({ ok: true, id: data.id })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setSubmitResult({ ok: false, error: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-blue-50 text-gray-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">F</div>
            <div>
              <p className="font-semibold text-lg">Falcon by cnear</p>
              <p className="text-xs text-gray-500">AI-Based Placement Enhancement</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#students" className="hover:text-indigo-600">Students</a>
            <a href="#admins" className="hover:text-indigo-600">Administration</a>
            <a href="#shortlisting" className="hover:text-indigo-600">Shortlisting</a>
            <a href="#contact" className="hover:text-indigo-600">Contact</a>
            <a href="/test" className="text-indigo-600 font-medium">System Check</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                India's Fastest Growing AI Platform for Placement Assistance
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Streamline university placements with intelligent shortlisting, AI-driven resumes, and real-time analytics.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#contact" className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-center">Request a Demo</a>
                <a href="#students" className="px-5 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 text-center">Explore Features</a>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                {loading && <span>Loading highlights…</span>}
                {error && <span className="text-red-600">{error}</span>}
                {features && <span>{features.tagline}</span>}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-200 to-blue-200 shadow-inner"></div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow p-4 border border-gray-100">
                <p className="text-xs text-gray-500">Live Chat Support</p>
                <p className="text-sm font-medium">Available inside the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Students */}
      <section id="students" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Built for Students</h2>
          <p className="text-gray-600 mt-2">Everything you need to prepare, apply, and succeed.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {(
              features?.sections?.find(s => s.title === 'For Students')?.items || [
                'Job Portal: Browse jobs, apply, and track application status.',
                'Resume Builder: Create and update resumes with AI assistance.',
                'Placement Policies: View eligibility criteria for job applications.',
                'Study Resources: Access AI-curated study materials.'
              ]
            ).map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
                <p className="font-medium">{item.split(':')[0]}</p>
                <p className="mt-1 text-sm text-gray-600">{item.split(':').slice(1).join(':') || ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Administration */}
      <section id="admins" className="py-16 bg-white/60 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Powerful for Administration</h2>
          <p className="text-gray-600 mt-2">Manage postings, shortlist candidates, and track outcomes with confidence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {(
              features?.sections?.find(s => s.title === 'For Placement Officers')?.items || [
                'Job Postings: Create, manage, and track job opportunities.',
                'Student Shortlisting: Use AI-driven shortlisting to identify the best candidates.',
                'Application Monitoring: Oversee student applications and their progress.',
                'Placement Analytics: Access real-time reports and insights.'
              ]
            ).map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
                <p className="font-medium">{item.split(':')[0]}</p>
                <p className="mt-1 text-sm text-gray-600">{item.split(':').slice(1).join(':') || ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shortlisting & Interviews */}
      <section id="shortlisting" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Placement Shortlisting & Interviews</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              'Placement officers can shortlist students using AI recommendations.',
              'Shortlisted students receive notifications for interview rounds.',
              'Students can check their interview schedule via the dashboard.'
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Still have a question?</h2>
              <p className="text-gray-600 mt-2">Send us a message and our team will get back to you.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we help?" />
                </div>
                <button disabled={submitting} className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60">
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
                {submitResult && (
                  <p className={`text-sm mt-2 ${submitResult.ok ? 'text-green-700' : 'text-red-600'}`}>
                    {submitResult.ok ? 'Thanks! We received your message.' : `Error: ${submitResult.error}`}
                  </p>
                )}
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="mt-4 space-y-3 text-sm">
                <p><span className="font-medium">Email:</span> support@cnear.tech</p>
                <p><span className="font-medium">Phone:</span> +91 8800727178</p>
                <p><span className="font-medium">Help Centre:</span> FAQs and troubleshooting inside the dashboard</p>
                <p><span className="font-medium">Live Chat:</span> Available within the Falcon dashboard</p>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-white border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500">Getting Started</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
                  <li>A modern browser and stable internet connection</li>
                  <li>University-provided credentials</li>
                  <li>Configure university policies and shortlisting rules</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white/70">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} cnear • Falcon – AI-Based Placement Enhancement Tool</p>
          <div className="text-sm text-gray-500">Backend: <span className="font-mono">{backend}</span></div>
        </div>
      </footer>
    </div>
  )
}

export default App
