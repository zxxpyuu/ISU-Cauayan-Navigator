import { useEffect, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Map as MapIcon,
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
  Download,
  MessageSquareWarning } from
'lucide-react';
import { Header } from '../components/Header';
import { ISU_INFO } from '../data/isuMetadata';
export function Dashboard() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => setScrolled(el.scrollTop > 24);
    el.addEventListener('scroll', handle);
    return () => el.removeEventListener('scroll', handle);
  }, []);

  const submitMapIssueReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const issueType = String(formData.get('issue-type') ?? '').trim();
    const location = String(formData.get('location') ?? '').trim();
    const details = String(formData.get('details') ?? '').trim();
    const subject = encodeURIComponent(`Campus map issue: ${issueType}`);
    const body = encodeURIComponent(
      `Issue type: ${issueType}\nLocation or building: ${location || 'Not specified'}\n\nDetails:\n${details}`
    );

    window.location.href = `mailto:zyannepasiola714@gmail.com?subject=${subject}&body=${body}`;
  };

  const menuItems = [
  {
    title: 'Interactive Map (Live View)',
    icon: MapIcon,
    path: '/map',
    primary: true,
    description: 'Explore the live campus GeoJSON'
  },
  // Removed redundant "Buildings" button; use the Search button instead

  {
    title: 'Student Manual',
    icon: Info,
    path: '/student-manual',
    primary: false
  },
  {
    title: 'Emergency Hotlines',
    icon: ShieldAlert,
    path: '/emergency-hotlines',
    primary: false,
    accent: 'text-red-500',
    bgAccent: 'bg-red-50 dark:bg-red-500/10'
  },
  {
    title: 'Credits',
    icon: Info,
    path: '/credit',
    primary: false
  },
];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-isu-charcoal">
      <Header scrolled={scrolled} />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        
        {/* Smart-Green Welcome Banner */}
        <div className="rounded-2xl p-4 bg-isu-green dark:bg-isu-charcoal-light dark:border dark:border-isu-mint/25 text-white dark:text-isu-mint relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-isu-gold dark:text-isu-mint" />
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-90">
              Smart-Green University
            </p>
          </div>
          <h2 className="text-base font-semibold leading-snug">
            Welcome to{' '}
            <span className="text-isu-gold dark:text-isu-mint">
              {ISU_INFO.campus}
            </span>
          </h2>
          <p className="text-xs opacity-80 mt-1">
            Find your way to any building or room on campus.
          </p>
        </div>

        {/* Search Bar Placeholder */}
        <div
          onClick={() => navigate('/search')}
          className="bg-white/70 dark:bg-isu-charcoal-light/80 backdrop-blur-xl border border-white/40 dark:border-isu-mint/20 shadow-glass rounded-2xl p-4 flex items-center space-x-3 cursor-text transition-transform active:scale-[0.98]">
          
          <Search className="w-5 h-5 text-isu-green dark:text-isu-mint" />
          <span className="text-gray-400 dark:text-gray-500 text-sm font-medium truncate">
            Search Building (e.g., CCSICT, CBM) or Room...
          </span>
        </div>

        {/* Quick access QR code */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-isu-charcoal-light">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Quick access
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Scan this QR code to open the campus navigator on your phone.
              </p>
              <a
                href="/Qr.png"
                download="ISU-Cauayan-Navigator-QR.png"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-isu-green px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-isu-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isu-green dark:bg-isu-mint dark:text-isu-charcoal dark:hover:bg-isu-mint/90"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download QR
              </a>
            </div>
            <a
              href="/Qr.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View QR code in a new tab"
              className="shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isu-green"
            >
              <img
                src="/Qr.png"
                alt="QR code for the ISU Cauayan campus navigator"
                className="h-28 w-28 rounded-xl border border-gray-100 object-contain dark:border-white/10"
              />
            </a>
          </div>
        </section>

        {/* Navigation Cards */}
        <div className="space-y-3">
            <div className="space-y-3 pb-6">
              {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] shadow-sm ${item.primary ? 'bg-isu-green dark:bg-isu-charcoal-light dark:border dark:border-isu-mint/40 text-white dark:text-isu-mint shadow-md min-h-[80px]' : `bg-white dark:bg-isu-charcoal-light text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 min-h-[64px] ${item.bgAccent || ''}`}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      item.primary
                        ? 'bg-white/15 text-white dark:text-isu-mint'
                        : `bg-gray-50 dark:bg-white/5 ${item.accent || 'text-isu-green dark:text-isu-mint'}`
                    }`}
                  >
                    <item.icon className="w-6 h-6" strokeWidth={2} />
                  </div>

                  <div>
                    <h3 className={`font-semibold ${item.primary ? 'text-base' : 'text-sm'}`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/80 dark:text-isu-mint/70 text-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight
                  className={`w-5 h-5 ${
                    item.primary ? 'text-white/70 dark:text-isu-mint/70' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-isu-charcoal-light">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-isu-green/10 p-2.5 text-isu-green dark:bg-isu-mint/10 dark:text-isu-mint">
              <MessageSquareWarning className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Report a map issue
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tell us about an incorrect building, label, or map location.
              </p>
              <button
                type="button"
                onClick={() => setIsReportOpen((open) => !open)}
                aria-expanded={isReportOpen}
                className="mt-3 rounded-xl bg-isu-green px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-isu-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isu-green dark:bg-isu-mint dark:text-isu-charcoal dark:hover:bg-isu-mint/90"
              >
                {isReportOpen ? 'Close report form' : 'Report an issue'}
              </button>
            </div>
          </div>

          {isReportOpen && (
            <form onSubmit={submitMapIssueReport} className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Issue type
                <select
                  name="issue-type"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-isu-green dark:border-white/10 dark:bg-isu-charcoal dark:text-white"
                >
                  <option value="">Choose an issue</option>
                  <option value="Incorrect building location">Incorrect building location</option>
                  <option value="Incorrect building name or details">Incorrect building name or details</option>
                  <option value="Missing building or place">Missing building or place</option>
                  <option value="Other map issue">Other map issue</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Building or location (optional)
                <input
                  name="location"
                  type="text"
                  maxLength={120}
                  placeholder="e.g., Library entrance"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-isu-green dark:border-white/10 dark:bg-isu-charcoal dark:text-white"
                />
              </label>

              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                What is wrong?
                <textarea
                  name="details"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  placeholder="Describe the issue so we can find and fix it."
                  className="mt-1 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-isu-green dark:border-white/10 dark:bg-isu-charcoal dark:text-white"
                />
              </label>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                This opens a pre-filled email. Review it and send it from your email app.
              </p>
              <button
                type="submit"
                className="w-full rounded-xl bg-isu-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-isu-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-isu-green dark:bg-isu-mint dark:text-isu-charcoal dark:hover:bg-isu-mint/90"
              >
                Continue to email
              </button>
            </form>
          )}
        </section>
      </div>
    </div>);

}