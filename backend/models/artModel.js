import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema({
    artwork_id: { type: String },
    artist_id: { type: String },
    name: { type: String, required: true },
    features: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    certificateHash: { type: String }, 
});

const artModel = mongoose.models.Art_data || mongoose.model("Art_data", ArtSchema);
export default artModel;
