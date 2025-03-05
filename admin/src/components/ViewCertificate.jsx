import React, { useState } from "react";
import { web3, contract } from "../web3Config";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificate.css";

const ViewCertificate = () => {
    const [certificateHash, setCertificateHash] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState("");

    const getCertificate = async () => {
        try {
            const cert = await contract.methods.getCertificateByHash(certificateHash).call();
            setCertificate({
                artistName: cert[0],
                artworkName: cert[1],
                artworkFeature: cert[2],
                artworkImage: cert[3],
                artworkCategory: cert[4],
                date: new Date(parseInt(cert[5]) * 1000).toLocaleString(),
                isValid: cert[6]
            });
            setError("");
        } catch (err) {
            setError("Certificate not found");
            setCertificate(null);
        }
    };

    const downloadPDF = () => {
        const certificateElement = document.getElementById("certificate");
        html2canvas(certificateElement).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape");
            pdf.addImage(imgData, "PNG", 15, 15, 260, 180);
            pdf.save("certificate.pdf");
        });
    };

    return (
        <div className="certificate-container">
            <h2>View Artwork Certificate</h2>
            <input
                type="text"
                placeholder="Enter Certificate Hash"
                onChange={(e) => setCertificateHash(e.target.value)}
            />
            <button onClick={getCertificate}>Get Certificate</button>
            {error && <p className="error">{error}</p>}

            {certificate && (
                <div id="certificate" className="certificate">
                    <h1>Artwork Certificate</h1>
                    <p>Artist Name: {certificate.artistName}</p>
                    <p>Artwork Name: {certificate.artworkName}</p>
                    <p>Features: {certificate.artworkFeature}</p>
                    <p>Category: {certificate.artworkImage}</p>
                    <p>Image :{certificate.artworkCategory}</p>
                    <p>Issued On: {certificate.date}</p>
                    <p>Status: {certificate.isValid ? "✅ Valid" : "❌ Invalid"}</p>
                    <p>Certificate Hash: {certificateHash}</p>
                    <img src={certificate.artworkImage} alt="Artwork" width="300px" />
                </div>
            )}

            {certificate && <button onClick={downloadPDF}>Download as PDF</button>}
        </div>
    );
};

export default ViewCertificate;
