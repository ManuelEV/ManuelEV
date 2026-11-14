// Genera los SVG del README de perfil. Uso: node scripts/gen-assets.mjs assets
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2]
mkdirSync(out, { recursive: true })

const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`

const themes = {
  dark: { fg: '#f4f4f2', muted: '#9b9b9b', subtle: '#6e6e6e', line: '#313131', chip: '#181818', accent: '#f2b544', accentText: '#f2b544' },
  light: { fg: '#1f2328', muted: '#59636e', subtle: '#818b98', line: '#d1d9e0', chip: '#f6f8fa', accent: '#d4a72c', accentText: '#9a6700' },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const save = (name, svg) => writeFileSync(join(out, name), svg.trim() + '\n')

/* ---------- Hero (siempre oscuro, como la landing) ---------- */
function hero() {
  const W = 880, H = 320
  const node = (x, y, w, label, accent = false) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="36" rx="8" fill="#181818" stroke="${accent ? '#f2b544' : '#313131'}"/>
      <text x="${x + w / 2}" y="${y + 23}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${accent ? '#f2b544' : '#f4f4f2'}">${label}</text>
    </g>`
  // evento -> kafka -> tres consumidores
  const trunk = 'M 614 160 L 640 160'
  const branches = [
    'M 720 160 C 744 160, 740 84, 764 84',
    'M 720 160 L 764 160',
    'M 720 160 C 744 160, 740 236, 764 236',
  ]
  const dot = (path, begin, dur) => `
    <circle r="3.5" fill="#f2b544" class="mv" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
      <animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/>
    </circle>`
  const full = (b) => `M 614 160 L 640 160 L 720 160 ${b.replace(/^M 720 160 /, '')}`
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">Manuel Espinoza · Ingeniero de software senior</title>
  <desc id="d">Backends que sostienen la operación y agentes que entienden el código. Temuco, Chile.</desc>
  <defs>
    <linearGradient id="name" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9b9b9b"/>
    </linearGradient>
    <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1" fill="#242424"/>
    </pattern>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="1"/>
      <stop offset="0.55" stop-color="#000" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="card"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <style>
    .rise { animation: rise .9s cubic-bezier(.16,1,.3,1) both }
    .d1 { animation-delay: .08s } .d2 { animation-delay: .18s } .d3 { animation-delay: .3s } .d4 { animation-delay: .45s }
    @keyframes rise { from { opacity: 0; transform: translateY(14px) } }
    .blink { animation: blink 2.4s ease-in-out infinite }
    @keyframes blink { 50% { opacity: .25 } }
    @media (prefers-reduced-motion: reduce) { .rise, .blink { animation: none } .mv { display: none } }
  </style>
  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="#000"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="#272727"/>

  <g class="rise d1">
    <rect x="48" y="80" width="8" height="8" rx="2" fill="#f2b544" class="blink"/>
    <text x="66" y="89" font-family="${MONO}" font-size="12.5" letter-spacing="1.4" fill="#9b9b9b">INGENIERO DE SOFTWARE SENIOR · TEMUCO, CHILE</text>
  </g>
  <text class="rise d2" x="46" y="158" font-family="${SANS}" font-size="56" font-weight="700" letter-spacing="-1.5" fill="url(#name)">Manuel Espinoza</text>
  <g class="rise d3" font-family="${SANS}" font-size="18" fill="#9b9b9b">
    <text x="48" y="202">Backends que sostienen la operación</text>
    <text x="48" y="228">y agentes que entienden el código.</text>
  </g>
  <text class="rise d4" x="48" y="276" font-family="${MONO}" font-size="12.5" fill="#f2b544">alguien.dev</text>

  <g class="rise d4">
    <g fill="none" stroke="#313131" stroke-width="1.5">
      <path d="${trunk}"/>
      ${branches.map((b) => `<path d="${b}"/>`).join('\n      ')}
    </g>
    ${node(530, 142, 84, 'evento')}
    ${node(640, 142, 80, 'kafka', true)}
    ${node(764, 66, 88, 'servicio')}
    ${node(764, 142, 88, 'agente')}
    ${node(764, 218, 88, 'erp')}
    ${dot(full(branches[0]), 0, 2.7)}
    ${dot(full(branches[1]), 0.9, 2.7)}
    ${dot(full(branches[2]), 1.8, 2.7)}
  </g>
</svg>`
}

/* ---------- Stack ---------- */
const stack = [
  ['Backend', ['*Spring Boot', 'Java', 'Go', 'Python', 'Delphi']],
  ['IA generativa', ['*Multiagente', 'Google ADK', 'AWS Bedrock', 'LiteLLM', 'Neo4j', 'Claude Code']],
  ['Eventos', ['Apache Kafka', 'RabbitMQ', 'SNS y SQS']],
  ['Datos', ['PostgreSQL', 'MongoDB', 'Redis']],
  ['Cloud', ['Kubernetes', 'Docker', 'AWS Lambda', 'API Gateway']],
  ['ERP e integraciones', ['Oracle Fusion', 'Oracle EBS', 'VTEX', 'Shopify']],
  ['Frontend', ['React', 'Next.js', 'Vue.js', 'Tailwind CSS']],
  ['Calidad', ['GitLab', 'Jenkins', 'SonarQube', 'JUnit']],
]

function stackSvg(t) {
  const W = 880, X0 = 190, CH = 30, GAP = 8, ROW = 46, FS = 13, CW = 8.1, PAD = 13
  let y = 4, body = '', i = 0
  for (const [group, items] of stack) {
    let x = X0
    body += `<text x="0" y="${y + 20}" font-family="${MONO}" font-size="11.5" letter-spacing="1.2" fill="${t.muted}">${esc(group.toUpperCase())}</text>\n`
    for (const raw of items) {
      const core = raw.startsWith('*')
      const label = core ? raw.slice(1) : raw
      const w = Math.round(label.length * CW + PAD * 2)
      if (x + w > W) { x = X0; y += CH + GAP }
      body += `<g class="c" style="animation-delay:${(i++ * 0.025).toFixed(3)}s">` +
        `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w}" height="${CH}" rx="15" fill="${t.chip}" stroke="${core ? t.accent : t.line}"/>` +
        `<text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" font-family="${MONO}" font-size="${FS}" fill="${core ? t.accentText : t.fg}">${esc(label)}</text></g>\n`
      x += w + GAP
    }
    y += ROW
  }
  const H = y - (ROW - CH) + 4
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stack: ${esc(stack.map(([g, it]) => `${g}: ${it.map((s) => s.replace('*', '')).join(', ')}`).join('. '))}">
  <style>
    .c { animation: in .6s cubic-bezier(.22,1,.36,1) both }
    @keyframes in { from { opacity: 0; transform: translateY(6px) } }
    @media (prefers-reduced-motion: reduce) { .c { animation: none } }
  </style>
  ${body}</svg>`
}

/* ---------- Trayectoria ---------- */
const stops = [
  ['Investigación', '2019 – 2020', 'U. de La Frontera', 'Ayudante de investigación'],
  ['Smart City', '2020', 'Smart Araucanía', 'Ingeniero de software'],
  ['Frontend', '2020 – 2021', 'CreaLab', 'Desarrollador frontend'],
  ['Datos y analítica', '2021 – 2022', 'Equifax', 'Ingeniero de software'],
  ['Retail e IA', '2022 – hoy', 'Forus', 'Ingeniero de software senior'],
]

function trajectorySvg(t) {
  const W = 880, H = 150, STEP = 176, X0 = 88, LY = 46
  const xs = stops.map((_, i) => X0 + i * STEP)
  const last = xs[xs.length - 1]
  let body = ''
  stops.forEach(([kicker, years, company, role], i) => {
    const x = xs[i], now = i === stops.length - 1
    body += `
    <g class="s" style="animation-delay:${(i * 0.09).toFixed(2)}s">
      <text x="${x}" y="18" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="1.1" fill="${now ? t.accentText : t.subtle}">${esc(kicker.toUpperCase())}</text>
      ${now ? `<circle cx="${x}" cy="${LY}" r="6" fill="none" stroke="${t.accent}" class="pulse"/>` : ''}
      <circle cx="${x}" cy="${LY}" r="${now ? 6 : 4.5}" fill="${now ? t.accent : t.chip}" stroke="${now ? t.accent : t.muted}" stroke-width="1.5"/>
      <text x="${x}" y="${LY + 34}" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="${t.muted}">${years}</text>
      <text x="${x}" y="${LY + 58}" text-anchor="middle" font-family="${SANS}" font-size="15" font-weight="600" fill="${t.fg}">${esc(company)}</text>
      <text x="${x}" y="${LY + 78}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="${t.muted}">${esc(role)}</text>
    </g>`
  })
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Trayectoria: ${esc(stops.map((s) => `${s[2]}, ${s[3]} (${s[1]})`).join('; '))}">
  <defs>
    <linearGradient id="l" gradientUnits="userSpaceOnUse" x1="${xs[0]}" x2="${last}" y1="0" y2="0">
      <stop offset="0" stop-color="${t.line}"/><stop offset=".7" stop-color="${t.line}"/><stop offset="1" stop-color="${t.accent}"/>
    </linearGradient>
  </defs>
  <style>
    .s { animation: in .7s cubic-bezier(.22,1,.36,1) both }
    @keyframes in { from { opacity: 0; transform: translateY(8px) } }
    .pulse { transform-box: fill-box; transform-origin: center; animation: pulse 2.4s ease-out infinite }
    @keyframes pulse { from { transform: scale(1); opacity: .9 } to { transform: scale(2.8); opacity: 0 } }
    @media (prefers-reduced-motion: reduce) { .s, .pulse { animation: none } .pulse { display: none } }
  </style>
  <line x1="${xs[0]}" x2="${last}" y1="${LY}" y2="${LY}" stroke="url(#l)" stroke-width="1.5"/>
  ${body}
</svg>`
}

/* ---------- Botones de contacto (sirven en ambos temas) ---------- */
function button(label, primary) {
  const H = 38, w = Math.round(label.length * 8.4 + 52)
  const bg = primary ? '#f2b544' : '#181818', fg = primary ? '#000000' : '#f4f4f2', st = primary ? '#f2b544' : '#313131'
  const ax = w - 21
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" role="img" aria-label="${esc(label)}">
  <rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" rx="18.5" fill="${bg}" stroke="${st}"/>
  <text x="18" y="24" font-family="${MONO}" font-size="13.5" font-weight="600" fill="${fg}">${esc(label)}</text>
  <path d="M ${ax - 4} 23 L ${ax + 4} 15 M ${ax - 2} 15 H ${ax + 4} V 21" fill="none" stroke="${fg}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

save('hero.svg', hero())
for (const [name, t] of Object.entries(themes)) {
  save(`stack-${name}.svg`, stackSvg(t))
  save(`trajectory-${name}.svg`, trajectorySvg(t))
}
save('btn-web.svg', button('alguien.dev', true))
save('btn-linkedin.svg', button('LinkedIn', false))
save('btn-email.svg', button('Correo', false))
console.log('ok')
