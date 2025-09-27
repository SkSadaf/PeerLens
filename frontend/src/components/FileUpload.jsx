import { useState } from "react";

export default function FileUpload({ onUpload }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    if (files.length === 0) return alert("Please upload at least one PDF.");
    onUpload(files);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="block w-full"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );
}
