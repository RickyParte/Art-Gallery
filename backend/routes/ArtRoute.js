import express from "express";
import { addArtItem, artfetchlist, artlist,removeArt,updateCertificateHash,getArtworkById  } from "../controllers/artController.js";
import multer from "multer"

const ArtRouter=express.Router();



const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }

})

const upload =multer({storage:storage})

ArtRouter.post("/add",upload.single("image"),addArtItem)

ArtRouter.get("/list/:id",artlist)

ArtRouter.get("/list",artfetchlist)

ArtRouter.put("/updateCertificateHash/:id",updateCertificateHash)

ArtRouter.get('/artworks/:id', getArtworkById);



ArtRouter.post("/remove",removeArt);
export default ArtRouter;