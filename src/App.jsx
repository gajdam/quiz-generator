import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import Quiz from './Quiz';

const App = () => {
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async () => {
        const response = { data: new Blob([reader.result]) };
        const text = await mammoth.extractRawText({ arrayBuffer: await response.data.arrayBuffer() });
        const lines = text.value.split('\n');
        const jsonData = lines.reduce((acc, line) => {
          if (line.startsWith('Zad')) {
            acc.push({ question: line, options: [] });
          } else if (line.startsWith('a.') || line.startsWith('b.') || line.startsWith('c.') || line.startsWith('d.') || line.startsWith('e.')) {
            const isCorrect = line.startsWith('+');
            const option = isCorrect ? line.slice(3).trim() : line.slice(2).trim();
            acc[acc.length - 1].options.push({ option, isCorrect });
          }
          return acc;
        }, []);
        setData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {data.length === 0 ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        </div>
      ) : (
        <Quiz data={data} />
      )}
    </div>
  );
};

export default App;