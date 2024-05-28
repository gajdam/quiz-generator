import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import Quiz from './Quiz'; 

const ProcessData = () => {
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async () => {
        console.log('File loaded:', file.name);
        const response = { data: new Blob([reader.result]) };
        const text = await mammoth.extractRawText({ arrayBuffer: await response.data.arrayBuffer() });
        console.log('Text extracted:', text.value);
        const lines = text.value.split('\n');
        const jsonData = lines.reduce((acc, line) => {
          if (line.startsWith('Zad')) {
            acc.push({ question: line, options: [] });
          } else if (line.startsWith('a.') || line.startsWith('b.') || line.startsWith('c.') || line.startsWith('d.') || line.startsWith('+ e.')) {
            const isCorrect = line.startsWith('+');
            const option = isCorrect ? line.slice(3).trim() : line.slice(2).trim();
            acc[acc.length - 1].options.push({ option, isCorrect });
          }
          return acc;
        }, []);
        console.log('Data parsed:', jsonData);
        setData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      {/* Render your data here */}
      {data.length > 0 && <Quiz data={data} />}
    </div>
  );
};

export default ProcessData;