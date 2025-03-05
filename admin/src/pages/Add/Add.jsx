import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { web3, contract } from "../../web3Config"; 
const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [certificateHash, setCertificateHash] = useState("");
  const [artistName, setArtistName] = useState("");
  const [data, setData] = useState({
    id: "",
    name: "",
    features: "",
    category: "Sketch",
    price: "",
  });

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistId = localStorage.getItem("artistId");
        if (!artistId) {
          toast.error("Artist ID not found.");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/artist/info/${artistId}`
        );

        if (response.data) {
          setArtistName(response.data.name);
        } else {
          toast.error("Failed to fetch artist details.");
        }
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
    };

    fetchArtist();
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const issueCertificate = async (artworkName, artworkFeature, artworkCategory, artworkImage) => {
    try {
      if (!artistName || !artworkName || !artworkFeature || !artworkCategory) {
        console.error("Missing required fields for certificate issuance.");
        toast.error("All fields are required to issue a certificate.");
        return null;
      }
  
      const accounts = await web3.eth.getAccounts();
      const artworkImageURL = artworkImage ? URL.createObjectURL(artworkImage) : "";
  
      console.log("Issuing Certificate with:", {
        artistName,
        artworkName,
        artworkFeature,
        artworkCategory,
        artworkImageURL,
      });
  
      const result = await contract.methods
        .issueCertificate(
          artistName,
          artworkName,
          artworkFeature,
          artworkCategory,
          artworkImageURL
        )
        .send({ from: accounts[0], gas: 5000000 });
  
      const hash = result.events.CertificateIssued.returnValues.certificateHash;
      setCertificateHash(hash);
      toast.success("Certificate issued successfully!");
  
      return hash; // Return the certificate hash
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Error issuing certificate.");
      return null;
    }
  };
  

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      const artist = localStorage.getItem("artistId");
      if (!artist) {
        toast.error("Artist ID is missing.");
        return;
      }
  
      if (!image) {
        toast.error("Please upload an image.");
        return;
      }
  
      const formData = new FormData();
      formData.append("id", artist);
      formData.append("name", data.name);
      formData.append("features", data.features);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);
  
      console.log("Submitting Artwork:", {
        id: artist,
        name: data.name,
        features: data.features,
        price: data.price,
        category: data.category,
        image: image.name,
      });
  
      // Step 1: Upload artwork
      const response = await axios.post(
        "http://localhost:4000/api/Art_data/add",
        formData
      );
  
      if (response.data?.success) {
        // Reset form state
        setData({
          id: artist,
          name: "",
          features: "",
          category: "Sketch",
          price: "",
        });
        setImage(null);
        toast.success(response.data.message);
  
        // Step 2: Issue Certificate
        const hash = await issueCertificate(data.name, data.features, data.category, image);
        
        if (hash) {
          // Step 3: Store Certificate Hash in Database
          const updateResponse = await axios.put(
            `http://localhost:4000/api/Art_data/updateCertificateHash/${response.data.artworkId}`,
            { certificateHash: hash }
          );
  
          if (updateResponse.data.success) {
            toast.success("Certificate Hash stored successfully!");
          } else {
            toast.error("Failed to store Certificate Hash.");
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex col">
          <p>Product Description</p>
          <textarea
            name="features"
            onChange={onChangeHandler}
            value={data.features}
            rows="6"
            placeholder="Write Content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Sketch">Sketch</option>
              <option value="ColorPencil">Color Pencil</option>
              <option value="CanvasPaintings">Canvas Paintings</option>
              <option value="WaterColor">Water Color</option>
              <option value="DigitalArtwork">Digital Artwork</option>
              <option value="GlassPainting">Glass Painting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>

      {certificateHash && (
        <div className="certificate-section">
          <h3>Certificate Issued</h3>
          <p><strong>Certificate Hash:</strong> {certificateHash}</p>
        </div>
      )}
    </div>
  );
};

export default Add;
