import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ArrowUpRight, Play, Star, Sparkles, CheckCircle2, Linkedin, Twitter, Mail, Phone } from 'lucide-react'

function GlowButton({ children, href, variant = 'primary' }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 will-change-transform'
  const styles = variant === 'primary'
    ? 'text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]'
    : 'text-indigo-300 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  )
}

function Stat({ value, label }) {
  return (
    <div className="px-6 py-4 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur text-center">
      <p className="text-3xl font-extrabold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-indigo-200">{label}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, role }) {
  return (
    <motion.div
      className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur text-indigo-100"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex items-center gap-2 text-amber-300">
        {[0,1,2,3,4].map(i => <Star key={i} size={16} fill="currentColor" />)}
      </div>
      <p className="mt-3 text-indigo-50 leading-relaxed">“{quote}”</p>
      <p className="mt-4 font-semibold text-white">{name}</p>
      <p className="text-xs text-indigo-300">{role}</p>
    </motion.div>
  )
}

// Apple-like sticky parallax hero
function ParallaxHero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })

  // Depth-based motions
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]) // far background
  const midY = useTransform(scrollYProgress, [0, 1], [0, -400]) // mid layer
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -650]) // foreground product

  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -40, -120])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const subOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const fgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  // Mouse tilt for foreground card - use MotionValues (required by useTransform)
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mvX.set(x)
    mvY.set(y)
  }
  const onMouseLeave = () => { mvX.set(0); mvY.set(0) }

  const tiltX = useSpring(useTransform(mvY, (y) => y * -8), { stiffness: 120, damping: 12 })
  const tiltY = useSpring(useTransform(mvX, (x) => x * 10), { stiffness: 120, damping: 12 })

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background aura grid */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize:'40px 40px'}} />
          <div className="absolute -left-40 top-1/3 w-[800px] h-[800px] rounded-full blur-3xl bg-gradient-to-tr from-fuchsia-600/30 via-indigo-700/30 to-sky-500/20" />
          <div className="absolute -right-40 bottom-0 w-[700px] h-[700px] rounded-full blur-3xl bg-gradient-to-br from-indigo-700/30 via-violet-600/30 to-fuchsia-500/20" />
        </motion.div>

        {/* Mid layer particles */}
        <motion.div style={{ y: midY }} className="absolute inset-0 -z-0">
          <div className="absolute left-16 top-28 w-2 h-2 rounded-full bg-white/60 blur-[1px]" />
          <div className="absolute right-24 top-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-300/70" />
          <div className="absolute left-1/3 bottom-24 w-2 h-2 rounded-full bg-sky-300/70" />
        </motion.div>

        {/* Content */}
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <motion.h1 style={{ y: titleY, opacity: titleOpacity }} className="text-5xl md:text-7xl font-black tracking-tight text-white">
                Falcon — Future of Placements
              </motion.h1>
              <motion.p style={{ opacity: subOpacity }} className="mt-6 text-lg md:text-xl text-indigo-200 max-w-xl">
                A cinematic, scroll‑driven experience. Precision control. Beautifully fast.
              </motion.p>
              <motion.div style={{ opacity: subOpacity }} className="mt-8 flex flex-wrap gap-3">
                <GlowButton href="#contact">Book a Demo <ArrowUpRight size={16} /></GlowButton>
                <GlowButton variant="secondary" href="#showcase">See How It Works <Play size={16} /></GlowButton>
              </motion.div>
              <motion.div style={{ opacity: subOpacity }} className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                <Stat value="1000+" label="Students Placed" />
                <Stat value="300+" label="Recruiters" />
                <Stat value="50%" label="Faster Cycles" />
              </motion.div>
            </div>

            {/* Foreground product card with tilt + scroll scale */}
            <motion.div style={{ y: fgY, scale: fgScale, rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }} className="relative">
              <div className="aspect-[10/7] rounded-[28px] bg-white/5 ring-1 ring-white/10 backdrop-blur-lg overflow-hidden shadow-[0_40px_120px_-20px_rgba(88,28,135,0.45)]">
                <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(transparent, rgba(7,9,24,0.25)), url(https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI2OTY2NDJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80)', backgroundSize:'cover', backgroundPosition:'center'}} />
                {/* gloss */}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.14),transparent_35%)] mix-blend-overlay" />
                <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-black/40 text-xs text-indigo-200 ring-1 ring-white/10">Realtime Analytics</div>
              </div>

              {/* floating chips */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute -bottom-5 -left-4 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs text-indigo-300">AI Suggestions</p>
                <p className="text-sm font-medium text-white">Resume • Shortlisting</p>
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur text-sm text-indigo-200">
                <Sparkles className="inline mr-2 text-amber-300" size={16}/> Live Metrics
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [features, setFeatures] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [navSolid, setNavSolid] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 20)
    onScroll();
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  // Scroll-to-top button visibility
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#070918] text-indigo-100 selection:bg-indigo-600/40 selection:text-white">
      {/* Navbar */}
      <header className={`sticky top-0 z-40 transition-colors ${navSolid ? 'backdrop-blur bg-[#0b0f2a]/75 ring-1 ring-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white font-extrabold">F</div>
            <div>
              <p className="font-semibold text-white">Falcon</p>
              <p className="text-[10px] uppercase tracking-wider text-indigo-300">AI Placement</p>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-white text-indigo-300">About</a>
            <a href="#features" className="hover:text-white text-indigo-300">Features</a>
            <a href="#modules" className="hover:text-white text-indigo-300">Modules</a>
            <a href="#showcase" className="hover:text-white text-indigo-300">Showcase</a>
            <a href="#testimonials" className="hover:text-white text-indigo-300">Stories</a>
            <a href="#contact" className="hover:text-white text-indigo-300">Contact</a>
            <a href="/test" className="text-white/90 hover:text-white">System Check</a>
          </nav>
          <GlowButton href="#contact">Get Started <ArrowUpRight size={16} /></GlowButton>
        </div>
      </header>

      {/* Apple-like Hero (sticky with multi-depth parallax) */}
      <ParallaxHero />

      {/* About */}
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">An AI-powered placement ecosystem</h2>
              <p className="mt-4 text-indigo-200 leading-relaxed">Built for Students, Recruiters & Universities. Falcon unifies resume intelligence, job discovery, shortlisting, interview orchestration and analytics into one sleek platform.</p>
              <ul className="mt-6 space-y-3 text-indigo-200">
                {['Resume Builder','Job Portal','Placement Analytics'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" size={18} /> <span>{t}</span></li>
                ))}
              </ul>
              <div className="mt-6 text-sm text-indigo-300">
                {loading && <span>Loading highlights…</span>}
                {error && <span className="text-rose-300">{error}</span>}
                {features && <span>{features.tagline}</span>}
              </div>
            </motion.div>
            <motion.div className="grid sm:grid-cols-2 gap-6" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              {['Resume Builder','Job Portal','Placement Analytics','AI Shortlisting'].map((card, i) => (
                <motion.div key={i} whileHover={{ rotateX: 6, rotateY: -6, y: -6 }} className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur min-h-[140px]">
                  <p className="text-sm uppercase tracking-wider text-indigo-300">Module</p>
                  <p className="mt-2 text-white font-semibold text-lg">{card}</p>
                  <p className="mt-1 text-sm text-indigo-300">Glowing cards with subtle parallax illustrate core parts of Falcon.</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">What Makes Falcon Different</h2>
            <p className="mt-3 text-indigo-200">Smart features designed for speed, precision and clarity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[
              { title: 'AI Resume Builder', desc: 'Real-time guidance, quantified impact lines, ATS-friendly templates.' },
              { title: 'Job Tracking & Notifications', desc: 'Never miss a deadline, application status in one place.' },
              { title: 'AI Shortlisting', desc: 'Model-driven candidate matching with transparent metrics.' },
              { title: 'Placement Analytics Dashboard', desc: 'Cohort insights, recruiter conversion, time-to-offer.' },
              { title: 'University Management', desc: 'Policies, eligibility, and program rules centralized.' },
              { title: 'Secure & Compliant', desc: 'Granular access, audit trails, privacy-first.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity" style={{background:'radial-gradient(600px 160px at 10% 10%, rgba(99,102,241,0.15), transparent)'}} />
                <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider"><Sparkles size={16}/> Premium</div>
                <p className="mt-2 text-lg font-semibold text-white">{f.title}</p>
                <p className="mt-1 text-sm text-indigo-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Product Modules</h2>
            <p className="mt-3 text-indigo-200">A unified platform tailored for every stakeholder.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { title: 'Students', items: ['AI Resume Builder', 'Smart Job Search', 'Interview Prep'] },
              { title: 'Placement Officers', items: ['Job Posting', 'AI Shortlisting', 'Workflow & Comms'] },
              { title: 'Administrators', items: ['Policies & Rules', 'Access Control', 'Analytics & Reports'] },
            ].map((m, idx) => (
              <motion.div key={idx} whileHover={{ y: -8 }} className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-white font-semibold text-lg">{m.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-indigo-300">
                  {m.items.map((it) => <li key={it} className="list-disc list-inside">{it}</li>)}
                </ul>
                <a href="#showcase" className="mt-4 inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">See demo <ArrowUpRight size={14} /></a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Experience the Dashboard</h2>
              <p className="mt-3 text-indigo-200">A fast, elegant workspace. From AI-generated bullet points to recruiter pipelines — everything flows.</p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {['AI Resume Builder','Smart Job Search','Placement Analytics'].map((k) => (
                  <div key={k} className="px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-indigo-200 text-sm">{k}</div>
                ))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="aspect-video rounded-3xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                <video className="w-full h-full object-cover" autoPlay loop muted playsInline poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop">
                  <source src="" type="video/mp4" />
                </video>
              </div>
              <div className="absolute -bottom-5 -left-4 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs text-indigo-300">Demo Preview</p>
                <p className="text-sm font-medium text-white">Placement Analytics</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Success Stories</h2>
            <p className="mt-3 text-indigo-200">A few words from the people using Falcon.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              { quote: 'Falcon gave us real-time visibility across all placements — our cycle is smoother than ever.', name: 'Ritika Sharma', role: 'Training & Placement Officer' },
              { quote: 'The AI resume suggestions are shockingly good. It helped me land 3 interviews in a week.', name: 'Aman Gupta', role: 'Final-year Student' },
              { quote: 'Shortlisting with analytics cut our screening time by 60%.', name: 'Kunal Mehra', role: 'Recruiter, TechCorp' },
              { quote: 'Clean, fast, and powerful. Exactly what our university needed.', name: 'Priya Nair', role: 'Dean, ABC University' },
            ].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative p-10 rounded-3xl bg-gradient-to-r from-indigo-700/40 via-violet-700/30 to-fuchsia-600/30 ring-1 ring-white/10 overflow-hidden">
            <div className="absolute -inset-1 opacity-30" style={{background:'radial-gradient(800px 200px at 0% 0%, rgba(255,255,255,0.15), transparent)'}} />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Ready to Revolutionize Your Placement Process?</h3>
            <p className="mt-2 text-indigo-100">Let us tailor Falcon to your university. See how fast your cycles can get.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <GlowButton href="#contact">Book a Demo <ArrowUpRight size={16} /></GlowButton>
              <GlowButton variant="secondary" href="#contact">Contact Us</GlowButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Let’s talk</h2>
              <p className="text-indigo-200 mt-2">Send us a message and our team will get back to you.</p>

              <form onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const data = {
                  name: form.name.value,
                  email: form.email.value,
                  message: form.message.value,
                  source: 'landing'
                }
                try {
                  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  })
                  if (!res.ok) throw new Error('Submission failed')
                  form.reset()
                  alert('Thanks! We received your message.')
                } catch (err) {
                  alert(err.message)
                }
              }} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-200">Name</label>
                  <input name="name" required className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-200">Email Address</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-200">Message</label>
                  <textarea name="message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we help?" />
                </div>
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                  Submit
                </button>
              </form>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <div className="mt-4 space-y-3 text-sm text-indigo-200">
                <p className="flex items-center gap-2"><Mail size={16} className="text-indigo-300"/> <span>support@falcon.ai</span></p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-indigo-300"/> <span>+91 8800727178</span></p>
                <p><span className="font-medium text-white">Help Centre:</span> FAQs and troubleshooting inside the dashboard</p>
                <p><span className="font-medium text-white">Live Chat:</span> Available within the Falcon dashboard</p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-wide text-indigo-300">Getting Started</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-indigo-200 space-y-1">
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
      <footer className="py-10 border-t border-white/10 bg-[#070918]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-indigo-300">© {new Date().getFullYear()} Falcon — AI-Powered Placement Enhancement Tool</p>
          <div className="flex items-center gap-4 text-indigo-300">
            <a href="#" className="hover:text-white flex items-center gap-2"><Linkedin size={16}/> LinkedIn</a>
            <a href="#" className="hover:text-white flex items-center gap-2"><Twitter size={16}/> Twitter</a>
            <span className="text-xs text-indigo-400">Backend: <span className="font-mono">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</span></span>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/10 ring-1 ring-white/20 text-white transition-all ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUpRight className="rotate-[-45deg]" />
      </button>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-8px) }
        }
      `}</style>
    </div>
  )
}
