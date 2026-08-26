

const input = document.getElementById('console-input');
const history = document.getElementById('console-history');

const COMMANDS = {
  help: () => `<span class="dim"> available commands </span>
<span class="dim"></span>  <span class="mg">help</span>        <span class="dim">—</span> show all commands
<span class="dim"></span>  <span class="mg">whoami</span>      <span class="dim">—</span> who is Martin?
<span class="dim"></span>  <span class="mg">ls skills/</span>  <span class="dim">—</span> technical skills
<span class="dim"></span>  <span class="mg">arch</span>        <span class="dim">—</span> what I'm building right now
<span class="dim"></span>  <span class="mg">ls hobbies/</span> <span class="dim">—</span> life outside the code
<span class="dim"></span>  <span class="mg">top</span>         <span class="dim">—</span> active processes
<span class="dim"></span>  <span class="mg">git log</span>     <span class="dim">—</span> life\'s commits
<span class="dim"></span>  <span class="mg">uptime</span>      <span class="dim">—</span> system status
<span class="dim"></span>  <span class="mg">ping martin</span> <span class="dim">—</span> contact Martin
<span class="dim"></span>  <span class="mg">sakura</span>      <span class="dim">—</span> try it!
<span class="dim"></span>`,

  whoami: () => `<span class="hl">Martin Hellström</span> — Tech Lead & Senior Full-Stack Engineer
Building large-scale systems for public sector by day.
Father and husband by night. Keeping an eye on the markets in between.
Based in <span class="bl">Lund, Sweden</span>. Certified <span class="ok">Software Architect</span> since 2025.`,

  'ls skills/': () => `<span class="bl">drwxr-xr-x</span>  backend/     <span class="dim">C# · .NET · Entity Framework · event sourcing · CQRS · SignalR · BizTalk</span>
<span class="bl">drwxr-xr-x</span>  frontend/    <span class="dim">Blazor · React · TypeScript · Preact · Vue · Mithril · GraphQL</span>
<span class="bl">drwxr-xr-x</span>  cloud/       <span class="dim">Azure · Kubernetes · Terraform · Docker · OpenTelemetry · Azure DevOps</span>
<span class="bl">drwxr-xr-x</span>  data/        <span class="dim">SQL Server · PostgreSQL · Redis · MongoDB · Firebase · XSLT</span>
<span class="bl">drwxr-xr-x</span>  security/    <span class="dim">OIDC · multi-tenancy · GDPR · OWASP · WCAG 2.1 AA</span>
<span class="bl">drwxr-xr-x</span>  leadership/  <span class="dim">Tech Lead · Architecture · Code review · Mentoring · Estimation</span>`,

  arch: () => `<span class="dim">$ cat ~/dev/current/ARCHITECTURE.md</span>

<span class="hl">Greenfield business platform</span> <span class="dim">— confidential client, Sweden</span>
<span class="dim">Tech lead. Seven bounded contexts, three web clients, one API.</span>

<span class="bl">backend</span>     <span class="dim">.NET · vertical slices · source-generated dispatch
            result types instead of exceptions for business errors</span>
<span class="bl">messaging</span>   <span class="dim">transactional outbox into pub/sub — at-least-once,
            idempotent subscribers, no dual writes</span>
<span class="bl">finance</span>     <span class="dim">event-sourced. the append-only stream is the truth,
            SQL tables are projections you can rebuild from it</span>
<span class="bl">realtime</span>    <span class="dim">SignalR, tenant-scoped groups, merge into state
            instead of reloading the page</span>
<span class="bl">frontend</span>    <span class="dim">server-rendered Blazor over websockets, plus an
            embeddable widget in Preact behind a shadow DOM</span>
<span class="bl">ops</span>         <span class="dim">Kubernetes · Terraform · OpenTelemetry · Key Vault</span>
<span class="bl">testing</span>     <span class="dim">unit · integration against real databases in containers
            regression guards that fail the build when a fixed bug
            comes back, and source-scanning guards for the rules CI
            cannot see — colour palette, hardcoded routes</span>
<span class="bl">verify</span>      <span class="dim">nothing ships until it has been clicked in a running app</span>

<span class="dim">The ledger is append-only because a balance you can overwrite is a
balance you cannot audit. It costs a rebuild step and a projection.</span>

<span class="dim">Everything above is the shape, not the client. The rest is under NDA.</span>`,

  'ls hobbies/': () => `<span class="bl">drwxr-xr-x</span>  family/      <span class="mg">HIGHEST PRIORITY — always running</span>
<span class="bl">drwxr-xr-x</span>  markets/     <span class="dim">long $TECH · buy the dip · never panic sell</span>
<span class="bl">drwxr-xr-x</span>  gaming/      <span class="dim">one more game · gg · no rage quit (mostly)</span>
<span class="bl">drwxr-xr-x</span>  sakura/      <span class="dim">details matter ·  · beauty in the small things</span>`,

  top: () => `<span class="dim">PID   PROCESS          CPU    STATUS</span>
<span class="mg">1     family           99.9%  <span class="ok">running</span></span>
<span class="dim">2     work             high   <span class="ok">running</span></span>
<span class="dim">3     markets          med    <span class="ok">monitoring</span></span>
<span class="dim">4     gaming           low    <span class="ok">standby</span></span>
<span class="dim">5     sleep            0.1%   <span class="bl">scheduled</span></span>`,

  'git log': () => `<span class="ok">a1f3c9b</span> <span class="dim">(HEAD)</span> feat: became a father — best deploy ever
<span class="ok">b2e4d8a</span> feat: got married — merged two repos into one
<span class="ok">c3f5e7b</span> feat: Certified Software Architect 2025
<span class="ok">d4a6f2c</span> feat: joined Consid — went full consultant mode
<span class="ok">e5b7g3d</span> feat: first tech lead role — no going back
<span class="ok">f6c8h4e</span> init: started YH at Teknikhighskolan 2019`,

  uptime: () => `System: <span class="hl">Martin Hellström v1.0</span>
Uptime: <span class="ok">5+ years professional</span> · <span class="mg">∞ as father & husband</span>
Load:   <span class="bl">high</span> — many parallel processes
Status: <span class="ok">stable · optimistic · caffeinated</span>
Last reboot: <span class="dim">never — dad mode has no off switch</span>`,

  'ping martin': () => `<span class="ok">PING martin.hellstrom — 1 packet transmitted</span>

<span class="hl">Hey.</span>
Glad you found this — and even more glad you stayed.
Here's my email: martver12@gmail.com
Thank you for finding this text.

<span class="mg">→ Martin Hellström</span>

<span class="dim">--- ping complete · response time: instant ---</span>`,

  sakura: () => {
    window.burstPetals?.();
    return `<span class="mg">*  *</span>
<span class="dim">initiating sakura overdrive...</span>
<span class="ok">+100 petals deployed</span>`;
  },

  jumpfish: () => {
    if (window.jumpFish?.()) {
      return `<span class="dim">casting line into the dark water...</span>
<span class="mg">* splash *</span>`;
    }
    return `<span class="dim">already mid-air. patience.</span>`;
  },

  'sudo be-junior': () => `<span class="ch-error">sudo: Permission denied.</span>
<span class="dim">Reason: Too many years of experience.
         Architecture decisions cannot be unlearned.</span>`,

  'rm -rf work': () => `<span class="ch-error">rm: cannot remove 'work'</span>
<span class="dim">Reason: Family depends on this process.
         Operation aborted by PID 1 (family).</span>`,

  dip: () => `<span class="mg">buy the dip.</span>
<span class="dim">not financial advice. definitely financial advice.</span>`,

  drone: () => `<span class="hl">observe · evaluate · execute</span>
<span class="dim">emotion is noise. process is signal.</span>`,

  champion: () => `<span class="dim">every win is just another stepping stone.</span>
stay hungry. next.`,

  markets: () => `<span class="ok">bull</span> or <span class="ch-error">bear</span> — doesn't matter.
<span class="dim">profit is a function of preparation, not direction.</span>`,

  flow: () => `<span class="hl">go with the flow.</span>
<span class="dim">resistance is wasted energy.
read the current. adjust. move.</span>`,

  mistakes: () => `<span class="dim">every mistake is curriculum.</span>
<span class="mg">character is built in the reps nobody sees.</span>`,

  pressure: () => `<span class="hl">pressure is where legends are made.</span>
<span class="dim">or where pipes burst. depends on the build quality.</span>`,

  stars: () => `<span class="mg">floating and staring at the stars.</span>
<span class="dim">no backlog. no standups. just the universe doing its thing.</span>`,

  emperor: () => `<span class="hl">the emperor protects.</span>
<span class="dim">for the imperium. obviously.</span>`,

  princess: () => `<span class="mg">my little princess is my everything.</span>
<span class="dim">full stop. no further elaboration needed.</span>`,

  'girl-dad': () => `<span class="dim">girl-dad..</span>
<span class="mg">they don't warn you how completely you'll lose.</span>`,

  'total war': () => `<span class="hl">total war is my jam.</span>
<span class="dim">300 hours. still can't manage diplomacy.
in-game or irl.</span>`,

  dyor: () => `<span class="ok">DYOR > blindly following.</span>
<span class="dim">every time. no exceptions.
the crowd is usually late.</span>`,

  clear: () => { history.innerHTML = ''; return null; },
};


function addToHistory(cmd, outputHtml, isError) {
  const echo = document.createElement('div');
  echo.className = 'ch-input-echo';
  echo.innerHTML = `<span class="arrow"></span> ${cmd}`;
  history.appendChild(echo);

  if (outputHtml !== null) {
    const out = document.createElement('div');
    out.className = isError ? 'ch-error' : 'ch-output';
    out.innerHTML = outputHtml;
    history.appendChild(out);
  }

  history.scrollTop = history.scrollHeight;
}

input.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const cmd = input.value.trim().toLowerCase();
  input.value = '';
  if (!cmd) return;

  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd]();
    addToHistory(cmd, result, false);
  } else {
    addToHistory(cmd,
      `bash: <span class="hl">${cmd}</span>: command not found<br><span class="dim">hint: type <span class="mg">help</span> to see available commands</span>`,
      true);
  }
});

document.getElementById('copyEmail').addEventListener('click', () => {
  navigator.clipboard.writeText('martver12@gmail.com').then(() => {
    const btn = document.getElementById('copyEmail');
    const val = document.getElementById('emailVal');
    const icon = document.getElementById('copyIcon');
    btn.classList.add('copied');
    val.textContent = 'copied!';
    icon.textContent = '✓';
    setTimeout(() => {
      btn.classList.remove('copied');
      val.textContent = 'martver12@gmail.com';
      icon.textContent = '⎘';
    }, 2000);
  });
});

document.getElementById('eyeBtn').addEventListener('click', () => {
  const t = document.querySelector('.container');
  const b = document.getElementById('eyeBtn');
  const hidden = t.classList.toggle('container--hidden');
  b.innerHTML = hidden ? '&#9671;' : '&#9670;';
});

document.querySelector('.terminal').addEventListener('click', () => input.focus());