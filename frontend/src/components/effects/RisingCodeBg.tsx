import React, { useEffect, useRef } from 'react';

// ─── Symbol pool ──────────────────────────────────────────────
const SYMBOLS = [
    // 代码关键字
    'const', 'let', 'async', 'await', '=>', 'import', 'export',
    'class', 'fn', 'pub', 'impl', 'return', 'if', 'else', 'for',
    'try', 'null', 'true', 'false', 'void', 'type', 'interface',
    // 符号片段
    '()', '{}', '[]', '&&', '||', '===', '!==', '</>', '#!',
    '/*', '*/', '//', '...', '??', '?.', '::', '->',
    // 进制 / 数字
    '0x1A', '0xFF', '0b101', '0x00', '1024', '404', '200', '1337',
    // AI / ML
    'LLM', 'GPT', 'CNN', 'RNN', 'BERT', 'loss', 'grad', 'epoch',
    'batch', 'Adam', 'ReLU', 'attn', 'token', 'embed', 'logit',
    // 数学符号
    '∇', '∑', 'σ', 'λ', 'θ', '∂', 'π', 'Δ', '∞', '∈', '∝',
    // 终端 / 系统
    '$', '~', '#!/', 'git', 'npm', 'ssh', 'curl', 'grep',
    'EOF', 'NaN', 'null', 'SIGINT', '127.0.0.1', 'localhost',
];

const COLORS = [
    '#00f5ff', '#00f5ff', '#00f5ff', // cyan ×3（主色调）
    '#a855f7', '#a855f7',             // purple ×2
    '#39ff14',                        // green ×1
    '#ff2d78',                        // pink ×1（稀有）
];

// ─── Particle ─────────────────────────────────────────────────
interface Particle {
    x: number;
    y: number;
    speed: number;
    text: string;
    maxOpacity: number;
    fontSize: number;
    color: string;
}

function spawnParticle(w: number, h: number, atBottom = true): Particle {
    return {
        x:          Math.random() * w,
        y:          atBottom ? h + Math.random() * h * 0.4 : Math.random() * h,
        speed:      0.25 + Math.random() * 1.1,
        text:       SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        maxOpacity: 0.18 + Math.random() * 0.22,
        fontSize:   11 + Math.floor(Math.random() * 5),
        color:      COLORS[Math.floor(Math.random() * COLORS.length)],
    };
}

// ─── Component ────────────────────────────────────────────────
export const RisingCodeBg: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const PARTICLE_COUNT = 55;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-seed so particles spread across the new size
            particles = Array.from(
                { length: PARTICLE_COUNT },
                () => spawnParticle(canvas.width, canvas.height, false),
            );
        };

        resize();
        window.addEventListener('resize', resize);

        let rafId: number;
        let paused = false;

        const handleVisibility = () => { paused = document.hidden; };
        document.addEventListener('visibilitychange', handleVisibility);

        const draw = () => {
            rafId = requestAnimationFrame(draw);
            if (paused) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.textBaseline = 'top';

            const fadeZone = canvas.height * 0.18;

            for (const p of particles) {
                p.y -= p.speed;

                if (p.y < -40) {
                    Object.assign(p, spawnParticle(canvas.width, canvas.height));
                    continue;
                }

                // Fade-in at bottom, fade-out at top
                let alpha = p.maxOpacity;
                if (p.y > canvas.height - fadeZone) {
                    alpha *= Math.max(0, (canvas.height - p.y) / fadeZone);
                } else if (p.y < fadeZone) {
                    alpha *= Math.max(0, p.y / fadeZone);
                }

                if (alpha < 0.005) continue;

                ctx.font         = `${p.fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
                ctx.fillStyle    = p.color;
                ctx.globalAlpha  = alpha;
                ctx.fillText(p.text, p.x, p.y);
            }

            ctx.globalAlpha = 1;
        };

        rafId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:      'fixed',
                inset:         0,
                pointerEvents: 'none',
                zIndex:        0,
            }}
        />
    );
};
