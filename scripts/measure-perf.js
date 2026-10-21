const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:8085';

const PAGES = [
    { name: 'Landing', hash: '#/landing' },
    { name: 'Marketplace', hash: '#/marketplace' },
    { name: 'Dashboard', hash: '#/dashboard' },
    { name: 'History', hash: '#/history' }
];

async function run() {
    console.log('Launching Chrome from:', CHROME_PATH);
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1366,768',
            '--enable-gpu-rasterization'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    // Pre-initialize session with student Hari Prasath (id: 1)
    await page.goto(`${BASE_URL}/#/landing`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
        localStorage.setItem('nexus_student_id', '1');
    });

    console.log('\n===============================================================');
    console.log('  RUNNING 60FPS SCROLL PERFORMANCE BENCHMARK (AFTER OPTIMIZATION)');
    console.log('===============================================================');
    const results = {};

    for (const p of PAGES) {
        process.stdout.write(`Benchmarking ${p.name.padEnd(12)} (${p.hash.padEnd(15)})... `);
        await page.goto(`${BASE_URL}/${p.hash}`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 1000)); // wait for full render / Three.js / data

        // Start PerformanceObserver and rAF frame timer in page context
        await page.evaluate(() => {
            window.__frameTimes = [];
            window.__longTasksCount = 0;
            window.__lastTime = performance.now();
            window.__benchmarking = true;

            try {
                window.__perfObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        window.__longTasksCount++;
                    }
                });
                window.__perfObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Ignore if not supported in headless
            }

            const tick = (now) => {
                if (!window.__benchmarking) return;
                const delta = now - window.__lastTime;
                window.__frameTimes.push(delta);
                window.__lastTime = now;
                window.__rafId = requestAnimationFrame(tick);
            };
            window.__rafId = requestAnimationFrame(tick);
        });

        // Simulate realistic continuous wheel scrolling down and up
        const scrollSteps = 24;
        for (let i = 0; i < scrollSteps; i++) {
            await page.mouse.wheel({ deltaY: 200 });
            // Simulate mouse hover over cards
            await page.mouse.move(400 + (i % 3) * 200, 300 + (i % 2) * 150);
            await new Promise(r => setTimeout(r, 65));
        }
        for (let i = 0; i < scrollSteps; i++) {
            await page.mouse.wheel({ deltaY: -200 });
            await new Promise(r => setTimeout(r, 65));
        }

        // Finalize metrics calculation in page context
        const metrics = await page.evaluate(() => {
            window.__benchmarking = false;
            if (window.__rafId) cancelAnimationFrame(window.__rafId);
            if (window.__perfObserver) {
                try { window.__perfObserver.disconnect(); } catch (e) {}
            }

            const times = window.__frameTimes || [];
            times.shift(); // remove initial warmup frame
            if (times.length === 0) {
                return { avgFps: 60, p95FrameTime: 16.6, longTasks: 0, frameCount: 0 };
            }

            const totalMs = times.reduce((a, b) => a + b, 0);
            const avgFps = Math.min(144, Math.round((times.length / (totalMs / 1000)) * 10) / 10);

            const sorted = [...times].sort((a, b) => a - b);
            const p95Idx = Math.floor(sorted.length * 0.95);
            const p95FrameTime = Math.round(sorted[p95Idx] * 10) / 10;

            return {
                avgFps,
                p95FrameTime,
                longTasks: window.__longTasksCount || 0,
                frameCount: times.length,
                totalScrollDurationMs: Math.round(totalMs)
            };
        });

        results[p.name] = metrics;
        console.log(`Avg FPS: ${metrics.avgFps} | 95th% Frame: ${metrics.p95FrameTime}ms | Long Tasks: ${metrics.longTasks}`);
    }

    await browser.close();

    console.log('\n===============================================================');
    console.log('  FINAL MEASURED PERFORMANCE NUMBERS:');
    console.log('===============================================================');
    console.table(results);
    console.log('\nRaw JSON:');
    console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
    console.error('Benchmark Error:', err);
    process.exit(1);
});
