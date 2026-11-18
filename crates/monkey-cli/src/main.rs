//! `monkey` — Monkey C toolchain CLI.
//!
//! Commands:
//!   monkey format [--check|--write] [--stdin] [--indent-spaces N|--indent-tabs] [paths...]
//!   monkey lint   [paths...]
//!   monkey check  [paths...]
//!   monkey tokens <file>
//!
//! Paths may be files or directories; directories are searched recursively
//! for `*.mc` and `*.jungle` files.

use std::env;
use std::fs;
use std::io::{self, Read};
use std::path::PathBuf;
use std::process::ExitCode;

use monkey_formatter::{FormatOptions, LineEnding, format_source};
use monkey_linter::{Diagnostic, Severity, lint_monkeyc, lint_text};

const USAGE: &str = "\
monkey — Monkey C toolchain

USAGE:
    monkey <command> [options] [paths...]

COMMANDS:
    format    Format Monkey C (.mc) and Jungle (.jungle) files
    lint      Check Monkey C files for issues
    check     Format-check + lint
    tokens    Dump the token stream for a file (debug)

FORMAT OPTIONS:
    --check            Report which files would change (default for files)
    --write            Write formatted output in place
    --stdin            Read source from stdin, write result to stdout
    --indent-spaces N  Spaces per indent level (default: 2)
    --indent-tabs      Indent with tabs

LINT/CHECK:
    Diagnostics are printed as `path:line:col: severity: message [rule]`.
    Exits non-zero when any diagnostic or format diff is found.
";

fn main() -> ExitCode {
    let args: Vec<String> = env::args().skip(1).collect();
    let Some(cmd) = args.first() else {
        eprint!("{}", USAGE);
        return ExitCode::from(2);
    };
    match cmd.as_str() {
        "format" => cmd_format(&args[1..]),
        "lint" => cmd_lint(&args[1..], false),
        "check" => cmd_lint(&args[1..], true),
        "tokens" => cmd_tokens(&args[1..]),
        "-h" | "--help" | "help" => {
            print!("{}", USAGE);
            ExitCode::SUCCESS
        }
        other => {
            eprintln!("monkey: unknown command '{}'\n", other);
            eprint!("{}", USAGE);
            ExitCode::from(2)
        }
    }
}

// ---------- shared helpers ----------

fn collect_files(paths: &[String], extensions: &[&str]) -> Vec<PathBuf> {
    let mut out = Vec::new();
    let mut stack: Vec<PathBuf> = paths.iter().map(PathBuf::from).collect();
    if stack.is_empty() {
        stack.push(PathBuf::from("."));
    }
    while let Some(p) = stack.pop() {
        if p.is_dir() {
            if let Ok(entries) = fs::read_dir(&p) {
                for e in entries.flatten() {
                    let path = e.path();
                    if path.is_dir() {
                        if !path.components().any(|c| {
                            c.as_os_str() == "node_modules"
                                || c.as_os_str() == "target"
                                || c.as_os_str() == ".git"
                        }) {
                            stack.push(path);
                        }
                    } else if path
                        .extension()
                        .and_then(|e| e.to_str())
                        .is_some_and(|e| extensions.contains(&e))
                    {
                        out.push(path);
                    }
                }
            }
        } else if p.is_file() {
            out.push(p);
        } else {
            eprintln!("monkey: no such file or directory: {}", p.display());
        }
    }
    out.sort();
    out
}

fn read_stdin() -> String {
    let mut buf = String::new();
    let _ = io::stdin().read_to_string(&mut buf);
    buf
}

fn print_diagnostics(path: &str, diags: &[Diagnostic]) {
    for d in diags {
        let sev = match d.severity {
            Severity::Warning => "warning",
            Severity::Error => "error",
        };
        println!(
            "{}:{}:{}: {}: {} [{}]",
            path, d.line, d.column, sev, d.message, d.rule
        );
    }
}

fn format_options(args: &[String]) -> FormatOptions {
    let mut opts = FormatOptions::default();
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "--indent-tabs" => opts.indent_width = None,
            "--indent-spaces" => {
                if let Some(v) = args.get(i + 1).and_then(|s| s.parse::<usize>().ok()) {
                    opts.indent_width = Some(v);
                    i += 1;
                }
            }
            "--crlf" => opts.line_ending = LineEnding::Crlf,
            _ => {}
        }
        i += 1;
    }
    opts
}

fn positional(args: &[String]) -> Vec<String> {
    args.iter()
        .filter(|a| !a.starts_with("--"))
        .cloned()
        .collect()
}

// ---------- commands ----------

fn cmd_format(args: &[String]) -> ExitCode {
    let opts = format_options(args);
    let write = args.iter().any(|a| a == "--write");
    let check = args.iter().any(|a| a == "--check");
    let use_stdin = args.iter().any(|a| a == "--stdin");

    if use_stdin {
        let src = read_stdin();
        print!("{}", format_source(&src, "stdin.mc", &opts));
        return ExitCode::SUCCESS;
    }

    let files = collect_files(&positional(args), &["mc", "jungle"]);
    if files.is_empty() {
        eprintln!("monkey: no .mc or .jungle files found");
        return ExitCode::from(2);
    }

    let mut changed = 0usize;
    let mut errors = 0usize;
    for path in &files {
        let Ok(src) = fs::read_to_string(path) else {
            eprintln!("monkey: cannot read {}", path.display());
            errors += 1;
            continue;
        };
        let formatted = format_source(&src, &path.to_string_lossy(), &opts);
        if formatted == src {
            continue;
        }
        changed += 1;
        if write {
            if fs::write(path, &formatted).is_err() {
                eprintln!("monkey: cannot write {}", path.display());
                errors += 1;
            }
        } else if check {
            println!("would reformat: {}", path.display());
        } else {
            // Default: print formatted source to stdout.
            if files.len() > 1 {
                println!("===== {} =====", path.display());
            }
            print!("{}", formatted);
        }
    }
    if check && changed > 0 {
        eprintln!("monkey: {} file(s) need formatting", changed);
    }
    let failed = if check { changed > 0 } else { errors > 0 };
    ExitCode::from(if failed { 1 } else { 0 })
}

fn cmd_lint(args: &[String], with_format_check: bool) -> ExitCode {
    let opts = format_options(args);
    let check_fmt = with_format_check || args.iter().any(|a| a == "--check");
    let files = collect_files(&positional(args), &["mc", "jungle"]);
    if files.is_empty() {
        eprintln!("monkey: no .mc or .jungle files found");
        return ExitCode::from(2);
    }

    let mut findings = 0usize;
    for path in &files {
        let Ok(src) = fs::read_to_string(path) else {
            eprintln!("monkey: cannot read {}", path.display());
            findings += 1;
            continue;
        };
        let pstr = path.to_string_lossy().to_string();
        let mut diags: Vec<Diagnostic> = Vec::new();
        lint_text(&src, &mut diags);
        if pstr.ends_with(".mc") || pstr.ends_with(".mb") || pstr.ends_with(".mcgen") {
            diags.extend(lint_monkeyc(&src, &pstr));
        }
        diags.sort_by_key(|d| (d.line, d.column));
        print_diagnostics(&pstr, &diags);
        findings += diags.len();

        if check_fmt {
            let formatted = format_source(&src, &pstr, &opts);
            if formatted != src {
                println!("{}: would reformat", pstr);
                findings += 1;
            }
        }
    }
    if findings > 0 {
        eprintln!("monkey: {} finding(s)", findings);
        ExitCode::from(1)
    } else {
        ExitCode::SUCCESS
    }
}

fn cmd_tokens(args: &[String]) -> ExitCode {
    let path = match args.iter().find(|a| !a.starts_with("--")) {
        Some(p) => p.clone(),
        None => {
            eprintln!("monkey: tokens requires a file path");
            return ExitCode::from(2);
        }
    };
    let src = match fs::read_to_string(&path) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("monkey: cannot read {}", path);
            return ExitCode::from(2);
        }
    };
    for t in monkey_syntax::lex(&src) {
        let kind = format!("{:?}", t.kind);
        println!(
            "{:>4}:{:<4} {:<12} {:?}",
            t.line(&src),
            t.column(&src),
            kind,
            t.text
        );
    }
    ExitCode::SUCCESS
}
