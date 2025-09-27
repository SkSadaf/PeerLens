import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

export default function UploadPage() {
  const navigate = useNavigate();

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // Call backend API
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    // Save extracted text in localStorage or global state
    localStorage.setItem("papersText", JSON.stringify(data.papersText));

    navigate("/ideas");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Upload Your Research Papers</h1>
      <FileUpload onUpload={handleUpload} />
    </div>
  );
}
