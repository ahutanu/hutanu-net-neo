import { useCallback, useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'bootstrap/dist/css/bootstrap.min.css';

GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.1/pdf.worker.min.js";

interface OutputEntry {
  id: number;
  text: string;
}

const COMMANDS = [
  'help',
  'about',
  'career',
  'contact',
  'clear',
  'dark',
  'ls',
  'cat',
  'cd',
  'pwd',
  'whoami',
  'date',
  'mv',
  'rm',
  'rmdir',
  'touch',
  'sudo',
  'reboot',
  'mail',
  'mail.app'
];

const HELP_TEXT = `Hi there and welcome to my website!
My name is Alexandru Hutanu, I'm an experienced Manager, Architect & Software Developer.
Currently I am an Engineering Manager at Pentalog, working as part of Pentalog's Technology Leadership in the Technology Office, being responsible of improving the overall processes and good practices in the company.
I am located in Bucharest, Romania.
Now in order to get started on using this website, feel free to either execute the 'help' command or use the more user-friendly colored sidenav at your left.
In order to skip text rolling (the "typewriter" effect), double click/touch anywhere.
guest@hutanu.net:~$ help
Below there's a list of commands that you can use.
You can use autofill by pressing the TAB key, autocompleting if there's only 1 possibility, or showing you a list of possibilities.
Commands: ${COMMANDS.join(', ')}`;

interface Content {
  about: string;
  contact: string;
}

export default function Terminal() {
  const [history, setHistory] = useState<OutputEntry[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [idx, setIdx] = useState(-1);
  const [content, setContent] = useState<Content | null>(null);
  const [fsRoot, setFsRoot] = useState<Record<string, any>>({});
  const [cwd, setCwd] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  /* istanbul ignore next */
  useEffect(() => {
    fetch('/content.json').then(r => r.json()).then(setContent);
    fetch('/fs.json').then(r => r.json()).then(setFsRoot);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

        /* istanbul ignore next */
  /* istanbul ignore next */
  const isDir = (n: any): n is Record<string, any> => typeof n === 'object';
  const getNode = (path: string[]): any => {
    return path.reduce<any>((acc, cur) => (isDir(acc) ? acc[cur] : undefined), fsRoot);
  };
  const resolve = (p: string): string[] => {
    const base = p.startsWith('/') ? [] : [...cwd];
    p.split('/').forEach(part => {
      if (!part || part === '.') return;
      if (part === '..') base.pop();
      else base.push(part);
    });
    return base;
  };

  const runCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const add = (text: string) => setHistory(h => [...h, { id: Date.now(), text }]);
    setCmdHistory(h => [...h, trimmed]);

    const [command, ...args] = trimmed.split(' ');

    switch (command) {
      case 'help':
        HELP_TEXT.split('\n').forEach(line => add(line));
        break;
      case 'about':
        if (content) add(content.about);
        break;
      case 'career': {
        try {
          const loading = { id: Date.now(), text: 'Loading career info...' };
          setHistory(h => [...h, loading]);
          /* istanbul ignore next */
          const pdf = await getDocument('/Profile.pdf').promise;
          const page = await pdf.getPage(1);
          const textContent = await page.getTextContent();
          const text = textContent.items.map(i => (i as any).str).join(' ');
          setHistory(h => h.filter(e => e !== loading));
          add(text.substring(0, 500) + '...');
        } catch {
          add('Failed to load career data');
        }
        break; }
      case 'contact':
        if (content) add(content.contact);
        break;
      case 'dark':
        document.body.classList.toggle('light-mode');
        add('Toggled theme');
        break;
      case 'ls': {
        const target = args[0] ? getNode(resolve(args[0])) : getNode(cwd);
        if (target && isDir(target)) add(Object.keys(target).join(' '));
        else add('Not a directory');
        break;
      }
      case 'cat': {
        const node = getNode(resolve(args[0] || ''));
        if (typeof node === 'string') add(node);
        else add('No such file');
        break;
      }
      case 'cd': {
        const newPath = resolve(args[0] || '/');
        const node = getNode(newPath);
        if (node && isDir(node)) setCwd(newPath);
        else add('No such directory');
        break;
      }
      case 'pwd':
        add('/' + cwd.join('/'));
        break;
      case 'whoami':
        add('guest');
        break;
      case 'date':
        add(new Date().toString());
        break;
      case 'touch': {
        const name = args[0];
        if (!name) { add('touch: missing file'); break; }
        setFsRoot(fs => {
          const clone = JSON.parse(JSON.stringify(fs));
          const resolveClone = (path: string[]) =>
            path.reduce<any>((acc, cur) => (typeof acc === 'object' ? acc[cur] : undefined), clone);
          const dir = resolveClone(cwd);
          if (dir && typeof dir === 'object') dir[name] = '';
          return clone;
        });
        break;
      }
      case 'rm': {
        const name = args[0];
        if (!name) { add('rm: missing file'); break; }
        setFsRoot(fs => {
          const clone = JSON.parse(JSON.stringify(fs));
          const resolveClone = (path: string[]) =>
            path.reduce<any>((acc, cur) => (typeof acc === 'object' ? acc[cur] : undefined), clone);
          const dir = resolveClone(cwd);
          if (dir && typeof dir === 'object') delete dir[name];
          return clone;
        });
        break;
      }
      case 'rmdir': {
        const name = args[0];
        if (!name) { add('rmdir: missing dir'); break; }
        setFsRoot(fs => {
          const clone = JSON.parse(JSON.stringify(fs));
          const resolveClone = (path: string[]) =>
            path.reduce<any>((acc, cur) => (typeof acc === 'object' ? acc[cur] : undefined), clone);
          const dir = resolveClone(cwd);
          const target = dir && typeof dir === 'object' ? dir[name] : undefined;
          if (target && typeof target === 'object' && Object.keys(target).length === 0) delete dir[name];
          else add('Directory not empty');
          return clone;
        });
        break;
      }
      case 'mv': {
        if (args.length < 2) { add('mv: missing operand'); break; }
        const srcPath = resolve(args[0]);
        const dstPath = resolve(args[1]);
        const srcName = srcPath.pop();
        const dstName = dstPath.pop();
        const srcDir = getNode(srcPath);
        const dstDir = getNode(dstPath);
        if (srcName && dstDir && srcDir && isDir(srcDir) && isDir(dstDir)) {
          const node = srcDir[srcName];
          if (node) {
            setFsRoot(fs => {
              const clone = JSON.parse(JSON.stringify(fs));
              const resolveClone = (path: string[]) =>
                path.reduce<any>((acc, cur) => (typeof acc === 'object' ? acc[cur] : undefined), clone);
              const sDir = resolveClone(srcPath);
              const dDir = resolveClone(dstPath);
              if (sDir && dDir && typeof sDir === 'object' && typeof dDir === 'object') {
                delete sDir[srcName];
                dDir[dstName ?? srcName] = node;
              }
              return clone;
            });
          }
        }
        break;
      }
      case 'sudo':
        add('Unable to sudo using a web client.');
        break;
      case 'reboot':
        add('Rebooting...');
        break;
      case 'mail': {
        const from = args.find(a => a.startsWith('--from='))?.slice(7) || 'unknown';
        const subject = args.find(a => a.startsWith('--subject='))?.slice(10) || '';
        const body = args.find(a => a.startsWith('--body='))?.slice(7) || '';
        add(`Mail sent from ${from} with subject '${subject}' and body '${body}'`);
        break;
      }
      case 'mail.app':
        add('Opening mail client...');
        break;
      case 'clear':
        setHistory([]);
        break;
      default:
        /* istanbul ignore next */
        add(`Unknown command: ${trimmed}`);
    }
  }, [content, fsRoot, cwd]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
      setIdx(-1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = COMMANDS.filter(c => c.startsWith(input));
      if (matches.length === 1) setInput(matches[0]);
    /* istanbul ignore next */
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx(i => Math.min(cmdHistory.length - 1, i + 1));
      const cmd = cmdHistory[cmdHistory.length - 1 - Math.min(cmdHistory.length - 1, idx + 1)];
      if (cmd) setInput(cmd);
    /* istanbul ignore next */
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx(i => Math.max(-1, i - 1));
      if (idx - 1 < 0) setInput('');
      else {
        const cmd = cmdHistory[cmdHistory.length - 1 - (idx - 1)];
        if (cmd) setInput(cmd);
      }
    }
  };

  return (
    <div className="p-3 font-monospace" onClick={() => inputRef.current?.focus()}>
      {history.map(entry => (
        <div key={entry.id} aria-live="polite">$ {entry.text}</div>
      ))}
      <div className="d-flex">
        <span>$</span>
        <input
          ref={inputRef}
          className="bg-dark border-0 text-light flex-grow-1 ms-2 blink"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          aria-label="command line"
        />
      </div>
    </div>
  );
}
