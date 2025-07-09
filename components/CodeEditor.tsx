import React from 'react';
import { Controlled as ControlledCodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

const languageModeMap: Record<string, string> = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'javascript',
  ts: 'javascript',
  html: 'htmlmixed',
  css: 'css',
  json: 'javascript',
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language = 'javascript', readOnly = false, height = '400px' }) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', minHeight: height }}>
      <ControlledCodeMirror
        value={value}
        options={{
          mode: languageModeMap[language] || language,
          theme: 'material',
          lineNumbers: true,
          readOnly,
          tabSize: 2,
          indentUnit: 2,
          autofocus: true,
        }}
        onBeforeChange={(_editor, _data, val) => onChange(val)}
      />
    </div>
  );
}; 