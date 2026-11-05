import * as vscode from 'vscode';
import { formatJungle, formatMonkeyC, type FormatOptions } from './format-monkeyc';
import { runtimePreview } from './runtime-preview';

function fullRange(document: vscode.TextDocument): vscode.Range {
  const last = document.lineAt(Math.max(0, document.lineCount - 1));
  return new vscode.Range(0, 0, last.range.end.line, last.range.end.character);
}

function makeEdit(document: vscode.TextDocument, formatted: string): vscode.TextEdit[] {
  if (formatted === document.getText()) return [];
  return [vscode.TextEdit.replace(fullRange(document), formatted)];
}

function formattingOptions(
  options: vscode.FormattingOptions,
  document: vscode.TextDocument,
): FormatOptions {
  return {
    insertSpaces: options.insertSpaces,
    tabSize: options.tabSize,
    eol: document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n',
  };
}

export function activate(context: vscode.ExtensionContext): void {
  const monkeyc = vscode.languages.registerDocumentFormattingEditProvider(
    { language: 'monkeyc', scheme: 'file' },
    {
      provideDocumentFormattingEdits(document, options) {
        const formatted = formatMonkeyC(document.getText(), formattingOptions(options, document));
        return makeEdit(document, formatted);
      },
    },
  );

  const jungle = vscode.languages.registerDocumentFormattingEditProvider(
    { language: 'jungle', scheme: 'file' },
    {
      provideDocumentFormattingEdits(document, options) {
        const formatted = formatJungle(document.getText(), formattingOptions(options, document));
        return makeEdit(document, formatted);
      },
    },
  );

  const formatCommand = vscode.commands.registerCommand('monkeyc.formatDocument', async () => {
    await vscode.commands.executeCommand('editor.action.formatDocument');
  });
  const previewCommand = vscode.commands.registerCommand('monkeyc.runtimePreview', async () => {
    await runtimePreview(context);
  });

  context.subscriptions.push(monkeyc, jungle, formatCommand, previewCommand);
}

export function deactivate(): void {}
