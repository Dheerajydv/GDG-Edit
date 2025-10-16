import React, { useState, useCallback } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAuth } from "../src/contexts/useAuth";

const Container = styled.div`
  background-color: #f7f7f7;
  padding: 2rem;
`;

const DropArea = styled.div`
  border: 2px dashed ${(props) => (props.isDragging ? "#3b82f6" : "#d1d5db")};
  background-color: ${(props) => (props.isDragging ? "#eff6ff" : "#ffffff")};
  border-radius: 0.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
`;

const DropText = styled.div`
  margin-top: 0.5rem;
  font-size: ${(props) => (props.large ? "1.25rem" : "0.875rem")};
  color: ${(props) => (props.large ? "#111827" : "#6b7280")};
`;

const FileList = styled.ul`
  margin-top: 1.5rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  list-style: none;
  padding: 0;
  border-top: 1px solid #e5e7eb;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const RemoveButton = styled.button`
  padding: 0.25rem;
  border-radius: 50%;
  background: transparent;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const UploadButton = styled.button`
  position: relative;
  background: #3aa56f;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  margin-top: 2rem;

  &:hover {
    background: #2d855f;
  }
`;

export default function Uploadbox({setUpload}) {
  const API_BASE_URL = "https://gdg-website-2025-oghz.vercel.app/";
  const {url,fileUrl}=useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const user = {
    name: "Avanish",
    email: "avanishupadhyay633@gmail.com",
  };
  const [isDragging, setIsDragging] = useState(false);

  const [uploadData, setData] = useState({
    name: user?.name,
    tags: "material",
    email: user?.email || "",
    content: null,
  });

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      setFiles([file]);
      setData({
        ...uploadData,
        name: file.name,
        content: file,
      });
    }
  }, [uploadData]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setFiles([file]);
      setData({
        ...uploadData,
        name: file.name,
        content: file,
      });
    }
  }, [uploadData]);

  const removeFile = useCallback(() => {
    setFiles([]);
    setData({
      ...uploadData,
      name: "",
      content: null,
    });
  }, [uploadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.content) {
      toast.warn("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("name", uploadData.name);
    formData.append("tags", uploadData.tags);
    formData.append("email", uploadData.email);
    formData.append("content", uploadData.content);

    try {
      setLoading(true);
      const endpoint =
        name === "IMAGE"
          ? "imageUpload"
          : name === "VIDEO"
          ? "videoUpload"
          : "generalUpload";
      const response=await axios.post(`${API_BASE_URL}api/auth/upload/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Response",response);
      url(response.data.fileUrl);
      setLoading(false);
      toast.success("File Uploaded Successfully");
      setUpload(false)
      console.log("fileUrl",fileUrl)

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <DropArea
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400" />
        <DropText large>Drop your files here</DropText>
        <DropText>or click to browse from your computer</DropText>
        <input
          type="file"
          onChange={handleFileSelect}
          style={{
            position: "absolute",
            inset: "0",
            opacity: "0",
            cursor: "pointer",
          }}
        />
      </DropArea>

      {files.length > 0 && (
        <FileList>
          {files.map((file, index) => (
            <FileItem key={index}>
              <div>
                <FileIcon className="w-5 h-5 text-gray-400" />
                <span>{file.name}</span>
              </div>
              <RemoveButton onClick={removeFile}>
                <X className="w-5 h-5 text-gray-500" />
              </RemoveButton>
            </FileItem>
          ))}
        </FileList>
      )}

      <UploadButton onClick={handleSubmit}>Upload</UploadButton>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </Container>
  );
}
