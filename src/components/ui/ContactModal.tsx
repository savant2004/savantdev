import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const PHONE = '9647760552004';

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I'm ${name} (${email}).%0A%0A${message}`;
    window.open(`https://wa.me/${PHONE}?text=${text}`, '_blank');
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-md rounded-3xl border border-white/5 bg-void p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-text">Message sent!</p>
                <p className="mt-1 font-body text-sm text-muted">Opening WhatsApp…</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-text">Let's connect</h3>
                    <p className="mt-1 font-body text-sm text-muted">Send a message straight to WhatsApp</p>
                  </div>
                  <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-muted transition-colors hover:text-text">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-medium text-muted mb-1.5">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-crimson-500/50 placeholder:text-muted/40"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-medium text-muted mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-crimson-500/50 placeholder:text-muted/40"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-medium text-muted mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Tell me about your project…"
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-crimson-500/50 placeholder:text-muted/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-crimson-500 to-ember py-3 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Send via WhatsApp
                  </button>
                </form>

                <p className="mt-4 text-center font-body text-[11px] text-muted/50">
                  You'll be redirected to WhatsApp to send the message
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
