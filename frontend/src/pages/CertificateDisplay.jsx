import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  margin-top: 7rem; 
  text-align: center;
  font-family: "Google Sans", sans-serif;
`;

const CertificateImage = styled.img`
  width: 100%;
  max-width: 700px;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
`;

const ErrorText = styled.h2`
  color: red;
`;

const CertificateDisplay = () => {
  const { serial } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(serial);
    
    fetch(`http://localhost:5000/api/certificates/verify/${serial}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or unverified certificate.");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, [serial]);

  if (error) {
    return <Container><ErrorText>{error}</ErrorText></Container>;
  }

  if (!data) {
    return <Container><h3>Loading certificate...</h3></Container>;
  }

  return (
    <div >
<Header/>
    <Container>
      <h2>Certificate Verified ✅</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Event:</strong> {data.event}</p>
      <p><strong>Serial No:</strong> {data.serialNumber}</p>
      <CertificateImage src={data.certificateUrl} alt="Certificate" />
    </Container>
    </div>
  );
};

export default CertificateDisplay;
