import { useRef } from 'react';
import Button from '../ui/Button';

export default function FileUploader({ onUpload, isUploading }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div>
      <input ref={inputRef} type="file" onChange={handleChange} className="hidden" />
      <Button
        type="button"
        variant="secondary"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? 'Enviando...' : 'Anexar arquivo'}
      </Button>
    </div>
  );
}
