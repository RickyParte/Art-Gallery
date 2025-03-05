import exp from "constants";
import artModel from "../models/artModel.js";
import fs from'fs'

//add Art Item


const addArtItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    let image_filename = req.file.filename;
    console.log(req.body);

    // Generate a unique artwork ID

    const art = new artModel({
      artist_id: req.body.id,
      name: req.body.name,
      features: req.body.features,
      price: req.body.price,
      image: image_filename,
      category: req.body.category,
      certificateHash: "", // Initially empty, will be updated later
    });

    const savedArt = await art.save();

    res.json({
      success: true,
      message: "Art Added",
      artworkId: savedArt._id, // Return the MongoDB ID of the artwork
    });

  } catch (error) {
    console.error("Error adding artwork:", error);
    res.status(500).json({ success: false, message: "Error adding artwork" });
  }
};

const updateCertificateHash = async (req, res) => {
    try {
        const { id } = req.params;
        const { certificateHash } = req.body;

        const updatedArt = await artModel.findByIdAndUpdate(id, { certificateHash }, { new: true });

        if (!updatedArt) {
            return res.status(404).json({ success: false, message: "Artwork not found" });
        }

        res.json({ success: true, message: "Certificate Hash Updated", data: updatedArt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



// All Art Item

const artlist=async(req,res)=>{
    const id=req.params.id;
        console.log(req.params);

    try{
        const arts=await artModel.find({artist_id:id});
        res.json({success:true,data:arts})

    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})

    }

}

const artfetchlist=async(req,res)=>{
    

    try{
        const arts=await artModel.find({});
        res.json({success:true,data:arts})

    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})

    }

}

//remove art item
const removeArt=async(req,res)=>{
    try {
        const art=await artModel.findById(req.body.id);
        fs.unlink(`uploads/${art.image}`,()=>{

        })
        await artModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Art Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})

        
    }

}

const getArtworkById = async (req, res) => {
    try {
        const { id } = req.params;
        const artwork=await artModel.find({ _id: id});
        
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }
        console.log(artwork);

        res.status(200).json(artwork);
    } catch (error) {
        console.error("Error fetching artwork:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {addArtItem,artlist,removeArt,artfetchlist,updateCertificateHash,getArtworkById}
