import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import Quiz from './Quiz';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async () => {
        const startsWithArray = ['a.', 'b.', 'c.', 'd.', 'e.', 'a)', 'b)', 'c)', 'd)', 'e)'];  
        const response = { data: new Blob([reader.result]) };
        const text = await mammoth.extractRawText({ arrayBuffer: await response.data.arrayBuffer() });
        const lines = text.value.split('\n');
        const jsonData = lines.reduce((acc, line) => {
          const lowerCaseLine = line.toLowerCase();
          if (lowerCaseLine.startsWith('zad') || (line.charCodeAt(0) >= 48 && line.charCodeAt(0) <= 57)) {
            acc.push({ question: line, options: [] });
          } else if (startsWithArray.some((start) => lowerCaseLine.startsWith(start))) {
            const isCorrect = line.endsWith('+');
            const option = isCorrect ? line.slice(3, -1).trim() : line.slice(2).trim();
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
  
  const handleNewFile = () => {
    setData([]);
  };

  return (
    <div>
      {data.length === 0 ? (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        </div>
      ) : (
        <Quiz data={data} onNewFile={handleNewFile} />
      )}
    </div>
  );
};

export default App;