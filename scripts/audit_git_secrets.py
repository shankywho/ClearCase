import subprocess
import re
import sys
import os

patterns = {
    'AWS Access Key ID': re.compile(r'(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'),
    'AWS Secret Access Key': re.compile(r'(?i)aws_secret_access_key\s*[:=]\s*[\'"][A-Za-z0-9/+=]{40}[\'"]'),
    'Groq API Key': re.compile(r'gsk_[a-zA-Z0-9]{20,}'),
    'Generic Private Key': re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    'OpenAI API Key': re.compile(r'sk-(?:live|test|proj)?[a-zA-Z0-9]{32,}'),
    'GitHub Token': re.compile(r'gh[pousr]_[A-Za-z0-9_]{36,}'),
    'Slack Token': re.compile(r'xox[baprs]-[0-9a-zA-Z]{10,48}'),
    'Raw 64-char Hex Private Key': re.compile(r'(?i)private[_-]?key\s*[:=]\s*[\'"][a-f0-9]{64}[\'"]')
}

def run_audit():
    print("=" * 70)
    print("        CLEARCASE HARD GIT REPOSITORY SECURITY AUDIT")
    print("=" * 70)

    # 1. Audit all tracked files in current git commit (HEAD)
    tracked_files = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()
    print(f"[*] Scanning {len(tracked_files)} tracked files in git HEAD...")
    violations = []

    for f in tracked_files:
        if f.endswith('.pdf') or f.endswith('.png') or f.endswith('.jpg') or f.endswith('.ico'):
            continue
        if not os.path.exists(f):
            continue
        try:
            with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                for i, line in enumerate(fp, 1):
                    for name, pat in patterns.items():
                        matches = pat.findall(line)
                        if matches:
                            is_dummy = any(d in line.lower() for d in [
                                'mock', 'dummy', 'placeholder', 'gsk_test', 'example', 
                                'your_key', 'akia...', 'your-key', 'gsk_...', 'mock-key'
                            ])
                            if not is_dummy:
                                violations.append((f, i, name, line.strip()))
        except Exception as err:
            print(f"[!] Error reading {f}: {err}")

    # 2. Audit all commits across full Git history
    print("[*] Scanning full git commit history diffs (git log -p --all)...")
    history = subprocess.check_output(['git', 'log', '-p', '--all'], text=True, errors='ignore')
    for line in history.splitlines():
        if line.startswith('+') and not line.startswith('+++'):
            for name, pat in patterns.items():
                matches = pat.findall(line)
                if matches:
                    is_dummy = any(d in line.lower() for d in [
                        'mock', 'dummy', 'placeholder', 'gsk_test', 'example', 
                        'your_key', 'akia...', 'your-key', 'gsk_...', 'mock-key'
                    ])
                    if not is_dummy:
                        violations.append(('GIT_COMMIT_HISTORY', 0, name, line.strip()))

    # 3. Check for .env file tracking
    env_in_git = subprocess.check_output(['git', 'log', '--all', '--full-history', '--name-only', '--', '.env'], text=True)
    if '.env' in env_in_git.split():
        violations.append(('.env', 0, 'Committed .env File', '.env file was found in git commit history!'))

    print("-" * 70)
    if violations:
        print(f"[FAIL] CRITICAL: Found {len(violations)} secret candidates!")
        for v in violations:
            print(f"  -> File: {v[0]}:{v[1]} | Type: {v[2]} | Line: {v[3][:80]}")
        sys.exit(1)
    else:
        print("[PASS] HARD AUDIT PASSED: ZERO secrets, ZERO API keys, ZERO private keys")
        print("       found in any tracked file or commit in git history.")
        print("=" * 70)

if __name__ == '__main__':
    run_audit()
