import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const links = [
  { href: '/', label: 'Home' },
  { href: '/#events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/members', label: 'Members' },
  { href: '/contact', label: 'Contact us' },
  { href: '/privacy', label: 'Privacy' },
];

export default function Navbar({ variant = 'dark' }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const listRef = useRef(null);

  const handleNav = async (href) => {
    setOpen(false);

    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];
      if (router.pathname === '/') {
        const el = document.getElementById(targetId);
        if (el) {
          window.history.replaceState(null, '', href);
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
          return;
        }
      }
      await router.push(href);
      return;
    }

    await router.push(href);
  };

  const mobileLinks = [
    { href: '/', label: 'HOME', icon: 'home' },
    { href: '/#events', label: 'EVENTS', icon: 'calendar' },
    { href: '/about', label: 'ABOUT', icon: 'info' },
    { href: '/members', label: 'MEMBERS', icon: 'users' },
    { href: '/contact', label: 'CONTACT US', icon: 'mail' },
    { href: '/privacy', label: 'PRIVACY', icon: 'shield' },
  ];

  useEffect(() => {
    const handleRoute = () => setOpen(false);
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    router.events.on('routeChangeComplete', handleRoute);
    window.addEventListener('resize', handleResize);
    return () => {
      router.events.off('routeChangeComplete', handleRoute);
      window.removeEventListener('resize', handleResize);
    };
  }, [router.events]);

  return (
    <header className="w-full">
      <nav className={`navbar ${variant === 'light' ? 'navbar-light' : 'navbar-dark'}`}>
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center justify-start">
            <Image src="/indexbg/KIIT_pixel.png" alt="logo" width={32} height={32} className="img h-8 w-auto" />
          </Link>
          <button aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="flex items-center justify-end">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-[1200] flex items-start justify-center pt-16 px-2 bg-[#171717]/85 backdrop-blur-sm">
            <div
              className="sm:w-100 w-[90vw] rounded-3xl shadow-2xl border-4 p-3"
              style={{ backgroundImage: 'linear-gradient(180deg, #FFEF12 0%, #FF3300 100%)', borderColor: '#7A3BFF' }}
            >
              <div
                className="rounded-2xl p-3 mb-3 shadow-inner"
                style={{ backgroundImage: 'linear-gradient(180deg, #FF3300 0%, #171717 100%)' }}
              >
                <div className="rounded-lg p-4 h-80 relative overflow-hidden" style={{ backgroundColor: '#171717' }}>
                  <div className="absolute top-2 left-2 right-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="font-bold text-lg" style={{ color: '#3CFFF3' }}>KIIT FEST 9.0</div>
                      <div className="flex-1 h-px" style={{ backgroundColor: '#FFEF12', opacity: 0.3 }} />
                    </div>
                    <div
                      ref={listRef}
                      className="space-y-1 max-h-64 overflow-y-auto pr-2"
                      style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFEF12 #171717' }}
                    >
                      {mobileLinks.map((item, idx) => (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => handleNav(item.href)}
                          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${
                            idx === 0
                              ? 'shadow-lg transform scale-105'
                              : 'hover:bg-[#171717]'
                          }`}
                          style={
                            idx === 0
                              ? { backgroundColor: '#FFEF12', color: '#171717' }
                              : { color: '#FFEF12', opacity: 0.9 }
                          }
                        >
                          {item.icon === 'home' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house">
                              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                          )}
                          {item.icon === 'calendar' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                          )}
                          {item.icon === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" x2="12" y1="16" y2="12" />
                              <line x1="12" x2="12.01" y1="8" y2="8" />
                            </svg>
                          )}
                          {item.icon === 'users' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          )}
                          {item.icon === 'mail' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                              <rect x="3" y="5" width="18" height="14" rx="2" />
                              <polyline points="3 7 12 13 21 7" />
                            </svg>
                          )}
                          {item.icon === 'shield' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            </svg>
                          )}
                          <span className="font-medium text-sm">{item.label}</span>
                          {idx === 0 && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right ml-auto">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-2 rounded-full mb-3 shadow-inner" style={{ backgroundColor: '#7A3BFF' }} />

              <div
                className="rounded-2xl p-6 shadow-inner"
                style={{ backgroundImage: 'linear-gradient(180deg, #FF2E88 0%, #7A3BFF 100%)' }}
              >
                <div className="flex justify-between items-center">
                  <div className="relative w-24 h-24 md:scale-150">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-20 h-20">
                        <button
                          onClick={() => {
                            if (!listRef.current) return;
                            listRef.current.scrollBy({ top: -120, behavior: 'smooth' });
                          }}
                          className="hover:cursor-pointer absolute top-0 left-1/2 -translate-x-1/2 w-7 h-9 rounded-t border-2 shadow-md transition-transform hover:brightness-110"
                          style={{ backgroundColor: '#FF3300', borderColor: '#171717', color: '#FFEF12' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up mx-auto text-gray-400" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (!listRef.current) return;
                            listRef.current.scrollBy({ top: 120, behavior: 'smooth' });
                          }}
                          className="hover:cursor-pointer absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-9 rounded-b border-2 shadow-md transition-transform hover:brightness-110"
                          style={{ backgroundColor: '#FF3300', borderColor: '#171717', color: '#FFEF12' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down mx-auto text-gray-400" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (!listRef.current) return;
                            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hover:cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 w-9 h-7 rounded-l border-2 shadow-md transition-transform hover:brightness-110"
                          style={{ backgroundColor: '#FF3300', borderColor: '#171717', color: '#FFEF12' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left mx-auto text-gray-400" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (!listRef.current) return;
                            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
                          }}
                          className="hover:cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 w-9 h-7 rounded-r border-2 shadow-md transition-transform hover:brightness-110"
                          style={{ backgroundColor: '#FF3300', borderColor: '#171717', color: '#FFEF12' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right mx-auto text-gray-400" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7" style={{ backgroundColor: '#171717', border: '2px solid #7A3BFF' }} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="grid grid-cols-3 gap-1 p-2 rounded-md shadow-inner hover:brightness-110 transition"
                    style={{ backgroundColor: '#171717', border: '2px solid #7A3BFF' }}
                    aria-label="Close menu"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FFEF12' }} />
                    ))}
                  </button>

                  <div className="relative w-24 h-24 md:scale-110">
                    <button className="hover:cursor-pointer absolute top-2 right-2 w-11 h-11 rounded-full border-[3px] shadow-lg flex items-center justify-center font-bold text-lg transition-transform hover:brightness-110" style={{ backgroundColor: '#3CFFF3', borderColor: '#7A3BFF', color: '#171717' }}>A</button>
                    <button className="hover:cursor-pointer absolute bottom-2 left-2 w-11 h-11 rounded-full border-[3px] shadow-lg flex items-center justify-center font-bold text-lg hover:brightness-110 transition-transform" style={{ backgroundColor: '#FF2E88', borderColor: '#7A3BFF', color: '#171717' }}>B</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
