import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LineType = 'system' | 'output' | 'error' | 'info';

interface Line {
  type: LineType;
  text: string;
}

interface TerminalProps {
  /** Optional trigger label. Defaults to "terminal — click to open" */
  label?: string;
}

const BOOT_LINES = [
  '> thanks for visiting',
  '> building products that matter',
  "> let's create the future",
];

const ASCII_ART = `
  ███████  █████  ██    ██  █████  ███    ██ ████████
  ██      ██   ██ ██    ██ ██   ██ ████   ██    ██
  ███████ ███████ ██    ██ ███████ ██ ██  ██    ██
       ██ ██   ██  ██  ██  ██   ██ ██  ██ ██    ██
  ███████ ██   ██   ████   ██   ██ ██   ████    ██
`;

function runCommand(raw: string): Line[] {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];

  const [base, ...args] = cmd.split(/\s+/);

  switch (base) {
    case 'help':
      return [
        { type: 'info', text: 'Available commands:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  General' },
        { type: 'output', text: '    help        — show this message' },
        { type: 'output', text: '    clear       — clear the terminal' },
        { type: 'output', text: '    whoami      — about savant' },
        { type: 'output', text: '    date        — current date & time' },
        { type: 'output', text: '    uptime      — how long since boot' },
        { type: 'output', text: '    neofetch    — system info' },
        { type: 'output', text: '    echo [msg]  — repeat a message' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Projects' },
        { type: 'output', text: '    projects    — list all projects' },
        { type: 'output', text: '    metrokent   — about the ecosystem' },
        { type: 'output', text: '    savant      — about savant learning' },
        { type: 'output', text: '    dentalyzer  — about dentalyzer' },
        { type: 'output', text: '' },
        { type: 'output', text: '  System' },
        { type: 'output', text: '    ls          — list directories' },
        { type: 'output', text: '    pwd         — print working directory' },
        { type: 'output', text: '    cd [dir]    — change directory' },
        { type: 'output', text: '    cat [file]  — read a file' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Fun' },
        { type: 'output', text: '    sudo        — try it' },
        { type: 'output', text: '    matrix      — follow the white rabbit' },
        { type: 'output', text: '    joke        — hear a joke' },
        { type: 'output', text: '    quote       — inspirational quote' },
        { type: 'output', text: '    ping [host] — ping a server' },
        { type: 'output', text: '    curl [url]  — make a request' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Social' },
        { type: 'output', text: '    contact     — scroll to contact' },
        { type: 'output', text: '    github      — github profile' },
        { type: 'output', text: '    linkedin    — linkedin profile' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Easter Eggs' },
        { type: 'output', text: '    exit        — try to leave' },
        { type: 'output', text: '    sudo rm -rf — dare you?' },
      ];

    case 'whoami': {
      return [
        { type: 'output', text: 'SAVANT — Product Engineering Studio' },
        { type: 'output', text: 'Architects of digital ecosystems.' },
        { type: 'output', text: 'From first pixel to frontier.' },
      ];
    }

    case 'date':
      return [{ type: 'output', text: new Date().toLocaleString() }];

    case 'uptime':
      return [{ type: 'output', text: 'System booted 2,847 hours ago. All systems operational.' }];

    case 'neofetch':
      return [
        { type: 'output', text: 'OS:       SAVANT OS v3.1.4' },
        { type: 'output', text: 'Kernel:   Crimson Reactor 6.9' },
        { type: 'output', text: 'Uptime:   118 days, 15 hours' },
        { type: 'output', text: 'Shell:    savant-shell 2.0' },
        { type: 'output', text: 'CPU:      M3 Ultra (16+4 cores)' },
        { type: 'output', text: 'Memory:   4812 / 65536 MB' },
        { type: 'output', text: 'Theme:    Dark Crimson [GTK4]' },
      ];

    case 'echo':
      return [{ type: 'output', text: args.join(' ') || '…' }];

    case 'projects':
      return [
        { type: 'info', text: 'Projects:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Savant Learning  — AI-powered quiz platform' },
        { type: 'output', text: '  MetroKent Eco    — Cross-platform logistics ecosystem' },
        { type: 'output', text: '  Dentalyzer       — AI-assisted dental diagnostics' },
      ];

    case 'metrokent':
      return [
        { type: 'info', text: 'MetroKent Ecosystem' },
        { type: 'output', text: 'A cross-platform logistics ecosystem.' },
        { type: 'output', text: 'Apps: customer · driver · picker · dispatcher · admin · pos' },
        { type: 'output', text: 'Stack: Next.js 16 · React Native · Expo · TypeScript' },
      ];

    case 'savant':
      return [
        { type: 'info', text: 'Savant Learning' },
        { type: 'output', text: 'AI-powered quiz platform with adaptive difficulty.' },
        { type: 'output', text: 'Stack: Prisma · Framer Motion · GSAP · LLM API' },
      ];

    case 'dentalyzer':
      return [
        { type: 'info', text: 'Dentalyzer' },
        { type: 'output', text: 'AI-assisted dental diagnostics platform.' },
        { type: 'output', text: 'Stack: TensorFlow.js · TypeScript · Redis · Docker' },
        { type: 'error', text: 'This project is private.' },
      ];

    case 'ls':
      return [{ type: 'output', text: 'ecosystem/  system/  work/  journey/  contact/' }];

    case 'pwd':
      return [{ type: 'output', text: '/home/savant/studio' }];

    case 'cd': {
      const dir = args[0] || '~';
      const dirs: Record<string, string> = {
        '~': '/home/savant',
        '/': '/',
        ecosystem: '/home/savant/ecosystem',
        system: '/home/savant/system',
        work: '/home/savant/work',
        journey: '/home/savant/journey',
        projects: '/home/savant/projects',
        desktop: '/home/savant/desktop',
        downloads: '/home/savant/downloads',
        '..': '/home/savant',
        '.': '/home/savant/studio',
      };
      const path = dirs[dir];
      if (path) return [{ type: 'output', text: `📂 ${path}` }];
      if (dir.startsWith('/')) return [{ type: 'output', text: `📂 ${dir}` }];
      return [{ type: 'error', text: `cd: no such directory: ${dir}` }];
    }

    case 'cat': {
      const file = args[0];
      const files: Record<string, string> = {
        'about.txt': ASCII_ART + '\nSAVANT — Product Engineering Studio\nBuilding the future, one pixel at a time.',
        'readme.md': '# SAVANT\n\nA product-engineering studio.\n\n## Stack\nReact 19, TypeScript, Tailwind CSS v3, Framer Motion, GSAP',
        'contact.txt': 'Email: hello@savant.website\nGitHub: @savant-studio',
        'skills.txt': 'Full-Stack Engineering · System Architecture · AI/ML · Mobile · Cloud Infrastructure',
      };
      const content = files[file];
      if (content) return content.split('\n').map((line) => ({ type: 'output' as const, text: line }));
      return [{ type: 'error', text: `cat: ${file || ''}: No such file` }];
    }

    case 'sudo': {
      const sub = args.join(' ');
      if (!sub) return [{ type: 'error', text: 'usage: sudo [command]' }];
      if (sub === 'rm -rf' || sub === 'rm -rf /') {
        return [
          { type: 'error', text: '🚨 ACCESS DENIED' },
          { type: 'error', text: 'Nice try. System integrity intact.' },
        ];
      }
      if (sub === 'apt update' || sub === 'apt upgrade') {
        return [
          { type: 'output', text: '[sudo] password for savant:' },
          { type: 'output', text: '✓ All packages up to date.' },
        ];
      }
      if (sub === 'systemctl status') {
        return [
          { type: 'output', text: '● savant.service — SAVANT Ecosystem' },
          { type: 'output', text: '   Loaded: loaded' },
          { type: 'output', text: '   Active: active (running)' },
        ];
      }
      return [
        { type: 'error', text: `nice try 😏 — you are not in the sudoers file.` },
      ];
    }

    case 'matrix':
      return [
        { type: 'output', text: 'Wake up, Neo…' },
        { type: 'output', text: 'The Matrix has you.' },
        { type: 'output', text: 'Follow the white rabbit.' },
        { type: 'output', text: '🕳️ 🐇' },
      ];

    case 'joke': {
      const jokes = [
        'Why do programmers prefer dark mode?\nBecause light attracts bugs.',
        'A SQL query walks into a bar…\n…and asks two tables if it can join them.',
        'How many programmers does it take to change a light bulb?\nNone. That\'s a hardware problem.',
        'Why did the developer go broke?\nBecause he used up all his cache.',
        'There are 10 types of people in the world:\nThose who understand binary, and those who don\'t.',
      ];
      return jokes[Math.floor(Math.random() * jokes.length)].split('\n').map((line) => ({ type: 'output' as const, text: line }));
    }

    case 'quote': {
      const quotes = [
        '"The best way to predict the future is to invent it." — Alan Kay',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Make it work, make it right, make it fast." — Kent Beck',
        '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
        '"Simplicity is the ultimate sophistication." — Leonardo da Vinci',
      ];
      return [{ type: 'output', text: quotes[Math.floor(Math.random() * quotes.length)] }];
    }

    case 'ping': {
      const host = args[0] || 'localhost';
      const delay = Math.floor(Math.random() * 20 + 5);
      return [
        { type: 'output', text: `PING ${host} (127.0.0.1): 56 data bytes` },
        { type: 'output', text: `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=${delay}ms` },
        { type: 'output', text: `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=${delay + 1}ms` },
        { type: 'output', text: `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=${delay - 1}ms` },
        { type: 'output', text: `--- ${host} ping statistics ---` },
        { type: 'output', text: '3 packets transmitted, 3 received, 0% packet loss' },
      ];
    }

    case 'curl': {
      const url = args[0] || '';
      if (!url) return [{ type: 'error', text: 'curl: no URL provided' }];
      return [
        { type: 'output', text: `  % Total    % Received % Xferd  Avg Speed` },
        { type: 'output', text: `100  ✓   —  →  SAVANT Studio` },
        { type: 'output', text: `Response: 200 OK` },
        { type: 'output', text: `✨ Connection established.` },
      ];
    }

    case 'contact':
      return [{ type: 'output', text: '📬 hello@savant.website — drop a message.' }];

    case 'github':
      return [{ type: 'output', text: '🐙 github.com/savant-studio' }];

    case 'linkedin':
      return [{ type: 'output', text: '💼 linkedin.com/company/savant' }];

    case 'exit':
      return [{ type: 'output', text: "you can't leave. the future is here." }];

    case 'clear':
      return [];

    case '':
      return [];

    default:
      return [
        { type: 'error', text: `command not found: ${base} — type "help"` },
      ];
  }
}

export function Terminal({ label = 'terminal — click to open' }: TerminalProps) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === 'clear') {
      setLines([]);
      setInput('');
      return;
    }
    const out = runCommand(input);
    setLines((prev) => [...prev, { type: 'system', text: `> ${input}` }, ...out]);
    setInput('');
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group w-full text-left"
        aria-expanded={open}
      >
        <div className="mb-3 flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-crimson-500" />
          terminal
          <span className="text-muted/60">
            {open ? '— close' : `— ${label}`}
          </span>
        </div>
        <div className="glass-strong w-full overflow-hidden rounded-xl font-mono text-xs sm:rounded-2xl sm:text-sm">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-primary/10 px-4 py-3 sm:px-5">
            <span className="h-2 w-2 rounded-full bg-crimson-700/60" />
            <span className="h-2 w-2 rounded-full bg-crimson-500/60" />
            <span className="h-2 w-2 rounded-full bg-crimson-400/60" />
            <span className="ml-3 text-[10px] text-muted sm:text-xs">
              savant@studio:~$
            </span>
          </div>

          {/* Boot lines */}
          <div className="space-y-1 p-4 sm:p-5">
            {BOOT_LINES.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.3 }}
                className="text-crimson-500"
              >
                {line}
              </motion.div>
            ))}
          </div>

          {/* Interactive terminal */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-primary/10"
              >
                <div
                  ref={scrollRef}
                  className="h-[200px] overflow-y-auto p-4 sm:h-[260px] sm:p-5"
                >
                  {lines.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.type === 'error'
                          ? 'text-crimson-400'
                          : line.type === 'info'
                            ? 'text-crimson-500/80'
                            : line.type === 'output'
                              ? 'text-muted'
                              : 'text-crimson-500'
                      }
                    >
                      {line.text}
                    </div>
                  ))}
                  <form onSubmit={submit} className="mt-1 flex items-center">
                    <span className="text-crimson-500">{'>'}</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      spellCheck={false}
                      autoComplete="off"
                      placeholder="type 'help'"
                      className="ml-2 flex-1 bg-transparent font-mono text-xs text-text outline-none placeholder:text-muted/50"
                    />
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}
