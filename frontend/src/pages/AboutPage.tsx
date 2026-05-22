import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RisingCodeBg } from '../components/effects/RisingCodeBg';

// ─── Types ────────────────────────────────────────────────────
interface ScriptLine {
    key: number;
    type: 'cmd' | 'out' | 'blank';
    text?: string;
    node?: React.ReactNode;
    delay: number;
    bright?: boolean;
}

interface ExtraLine {
    id: number;
    type: 'cmd-echo' | 'out' | 'blank' | 'err';
    text?: string;
    node?: React.ReactNode;
}

// ─── Script builder ───────────────────────────────────────────
const CHAR_MS = 28;
const AFTER_CMD = 130;

function buildScript(): ScriptLine[] {
    const script: ScriptLine[] = [];
    let t = 500;
    let key = 0;

    const cmd = (text: string) => {
        script.push({ key: key++, type: 'cmd', text, delay: t });
        t += text.length * CHAR_MS + AFTER_CMD;
    };

    const out = (text: string, node?: React.ReactNode, gap = 80, bright = false) => {
        script.push({ key: key++, type: 'out', text, node, delay: t, bright });
        t += gap;
    };

    const blank = (gap = 200) => {
        script.push({ key: key++, type: 'blank', delay: t });
        t += gap;
    };

    cmd('load --file character.dat');
    out('Accessing personnel file...  ██████████  100%', undefined, 350, true);
    blank(150);

    cmd('whoami');
    out('╔══════════════════════════════════════╗', undefined, 55);
    out('║  CHARACTER   NANLU · QINGSHI         ║', undefined, 55);
    out('║  CLASS       Full-Stack Engineer     ║', undefined, 55);
    out('║  GUILD       USTC                    ║', undefined, 55);
    out('╚══════════════════════════════════════╝', undefined, 350);
    blank();

    cmd('cat stats.dat');
    out('STR  ████████░░  Backend',       undefined, 100);
    out('INT  ███████░░░  Algorithm',     undefined, 100);
    out('DEX  ██████░░░░  Frontend',      undefined, 100);
    out('WIS  █████░░░░░  System Design', undefined, 350);
    blank();

    cmd('ls equipment/');
    out('Spring Boot  ·  React  ·  TypeScript  ·  MySQL  ·  Docker  ·  Git', undefined, 350);
    blank();

    cmd('cat contact.txt');
    out(
        'github  →  github.com/NanluQingshi',
        <>
            {'github  →  '}
            <a href="https://github.com/NanluQingshi" target="_blank" rel="noreferrer" className="terminal-link">
                github.com/NanluQingshi
            </a>
        </>,
        90,
    );
    out(
        'email   →  nlqs@mail.ustc.edu.cn',
        <>
            {'email   →  '}
            <a href="mailto:nlqs@mail.ustc.edu.cn" className="terminal-link">
                nlqs@mail.ustc.edu.cn
            </a>
        </>,
        350,
    );
    blank();

    cmd('cat quests.txt');
    out(
        '[ACTIVE]  →  Roadmap',
        <>
            {'[ACTIVE]  →  '}
            <Link to="/roadmap" className="terminal-link terminal-quest">Roadmap ↗</Link>
        </>,
        100,
    );
    out(
        '[ACTIVE]  →  修炼手册',
        <>
            {'[ACTIVE]  →  '}
            <Link to="/practice" className="terminal-link terminal-quest">修炼手册 ↗</Link>
        </>,
        100,
    );
    blank(100);

    return script;
}

const SCRIPT = buildScript();

// ─── Command response builder ─────────────────────────────────
function getResponse(cmd: string, idRef: React.MutableRefObject<number>): ExtraLine[] {
    const id = () => ++idRef.current;
    const o = (text: string, node?: React.ReactNode): ExtraLine => ({ id: id(), type: 'out', text, node });
    const e = (text: string): ExtraLine => ({ id: id(), type: 'err', text });
    const b = (): ExtraLine => ({ id: id(), type: 'blank' });

    const lower = cmd.toLowerCase().trim();

    if (lower === '') return [];

    if (lower === 'help') return [
        o('Available commands:'),
        o('  help         show this message'),
        o('  whoami       display character info'),
        o('  skills       list technical skills'),
        o('  ls           list directory contents'),
        o('  contact      show contact info'),
        o('  clear        clear the terminal'),
        o('  exit         ...'),
    ];

    if (lower === 'whoami') return [
        o('╔══════════════════════════════════════╗'),
        o('║  CHARACTER   NANLU · QINGSHI         ║'),
        o('║  CLASS       Full-Stack Engineer     ║'),
        o('║  GUILD       USTC                    ║'),
        o('╚══════════════════════════════════════╝'),
    ];

    if (lower === 'skills') return [
        o('── Backend ──────────────────────────────────────────'),
        o('   Spring Boot  ·  Java 17  ·  MyBatis-Plus  ·  MySQL'),
        o('   Spring Security  ·  JWT  ·  MapStruct  ·  Lombok'),
        b(),
        o('── Frontend ─────────────────────────────────────────'),
        o('   React 18  ·  TypeScript  ·  Vite  ·  Zustand'),
        o('   Axios  ·  react-markdown  ·  Recharts  ·  Radix UI'),
        b(),
        o('── DevOps ───────────────────────────────────────────'),
        o('   Docker  ·  Docker Compose  ·  Git  ·  Linux'),
    ];

    if (lower === 'ls') return [
        o('character.dat   stats.dat   equipment/   contact.txt   quests.txt'),
    ];

    if (lower === 'contact') return [
        o(
            'github  →  github.com/NanluQingshi',
            <>
                {'github  →  '}
                <a href="https://github.com/NanluQingshi" target="_blank" rel="noreferrer" className="terminal-link">
                    github.com/NanluQingshi
                </a>
            </>,
        ),
        o(
            'email   →  nlqs@mail.ustc.edu.cn',
            <>
                {'email   →  '}
                <a href="mailto:nlqs@mail.ustc.edu.cn" className="terminal-link">
                    nlqs@mail.ustc.edu.cn
                </a>
            </>,
        ),
    ];

    if (lower === 'exit')    return [e('There is no escape.')];
    if (lower === 'pwd')     return [o('/home/nanlu/about')];
    if (lower === 'date')    return [o(new Date().toString())];
    if (lower === 'clear')   return []; // handled before calling getResponse

    if (lower.startsWith('sudo')) return [
        o('Checking permissions...'),
        e('Permission denied. Nice try. 😈'),
    ];

    if (lower === 'vim' || lower === 'vi' || lower === 'nano') return [
        e(`${cmd}: no editor available in this environment`),
        o('(This is not that kind of terminal.)'),
    ];

    if (lower === 'ls -la' || lower === 'ls -l') return [
        o('total 48'),
        o('-rw-r--r--  1 nanlu  staff   2.1K  character.dat'),
        o('-rw-r--r--  1 nanlu  staff    512  stats.dat'),
        o('drwxr-xr-x  1 nanlu  staff    128  equipment/'),
        o('-rw-r--r--  1 nanlu  staff    256  contact.txt'),
        o('-rw-r--r--  1 nanlu  staff    128  quests.txt'),
    ];

    return [e(`bash: ${cmd}: command not found`)];
}

// ─── Component ────────────────────────────────────────────────
const AboutPage: React.FC = () => {
    const [runKey,       setRunKey]       = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [interactive,  setInteractive]  = useState(false);
    const [input,        setInput]        = useState('');
    const [extraLines,   setExtraLines]   = useState<ExtraLine[]>([]);

    const bodyRef    = useRef<HTMLDivElement>(null);
    const extraIdRef = useRef(0);

    // Script animation — reruns when clear is called (runKey increments)
    useEffect(() => {
        setVisibleCount(0);
        setInteractive(false);
        const timers: ReturnType<typeof setTimeout>[] = [];
        SCRIPT.forEach((line, idx) => {
            timers.push(
                setTimeout(() => {
                    setVisibleCount(idx + 1);
                    if (idx === SCRIPT.length - 1) {
                        setTimeout(() => setInteractive(true), 400);
                    }
                }, line.delay),
            );
        });
        return () => timers.forEach(clearTimeout);
    }, [runKey]);

    // Auto-scroll to bottom on any new content
    useLayoutEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [visibleCount, extraLines, input]);

    // Execute a typed command
    const executeCommand = useCallback((cmd: string) => {
        if (cmd.toLowerCase().trim() === 'clear') {
            setExtraLines([]);
            setInput('');
            setInteractive(false);
            setRunKey(k => k + 1);
            return;
        }
        const response = getResponse(cmd, extraIdRef);
        setExtraLines(prev => [
            ...prev,
            { id: ++extraIdRef.current, type: 'cmd-echo' as const, text: cmd },
            ...response,
        ]);
    }, []);

    // Keyboard handler — active only when script has finished
    useEffect(() => {
        if (!interactive) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === 'Enter') {
                executeCommand(input.trim());
                setInput('');
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                setInput(prev => prev.slice(0, -1));
            } else if (e.key.length === 1) {
                setInput(prev => prev + e.key);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [interactive, input, executeCommand]);

    return (
        <div className="about-page">
            <RisingCodeBg />
            <div className="terminal-window">
                {/* ── Title bar ── */}
                <div className="terminal-titlebar">
                    <div className="terminal-dots">
                        <span className="dot dot-red" />
                        <span className="dot dot-yellow" />
                        <span className="dot dot-green" />
                    </div>
                    <span className="terminal-title">about.sh — bash</span>
                    {interactive && (
                        <span className="terminal-hint">type "help" for commands</span>
                    )}
                </div>

                {/* ── Body ── */}
                <div className="terminal-body" ref={bodyRef}>
                    {/* Script playback lines */}
                    {SCRIPT.slice(0, visibleCount).map((line) => {
                        if (line.type === 'blank') {
                            return <div key={line.key} className="terminal-blank" />;
                        }
                        if (line.type === 'cmd') {
                            return (
                                <div key={line.key} className="terminal-line terminal-cmd">
                                    <span className="terminal-prompt">$&nbsp;</span>
                                    <span
                                        className="terminal-typing"
                                        style={{
                                            animation: `term-type ${line.text!.length * 28}ms steps(${line.text!.length}) forwards`,
                                            '--final-w': `${line.text!.length}ch`,
                                        } as React.CSSProperties}
                                    >
                                        {line.text}
                                    </span>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={line.key}
                                className={`terminal-line terminal-out${line.bright ? ' terminal-bright' : ''}`}
                            >
                                {line.node ?? line.text}
                            </div>
                        );
                    })}

                    {/* User-typed command history */}
                    {extraLines.map((line) => {
                        if (line.type === 'blank') {
                            return <div key={line.id} className="terminal-blank" />;
                        }
                        if (line.type === 'cmd-echo') {
                            return (
                                <div key={line.id} className="terminal-line terminal-cmd">
                                    <span className="terminal-prompt">$&nbsp;</span>
                                    <span>{line.text}</span>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={line.id}
                                className={`terminal-line terminal-out${line.type === 'err' ? ' terminal-err' : ''}`}
                            >
                                {line.node ?? line.text}
                            </div>
                        );
                    })}

                    {/* Live input line */}
                    {interactive && (
                        <div className="terminal-line terminal-cmd">
                            <span className="terminal-prompt">$&nbsp;</span>
                            <span className="terminal-input-text">{input}</span>
                            <span className="terminal-cursor-blink">█</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
