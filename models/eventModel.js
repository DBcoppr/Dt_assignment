import mongoose from "mongoose";
const eventschema=mongoose.Schema({
type:{
    type:String,default:"event"
},
uid:{
    type:Number,
    unique:true
},
name:{
    type:String
},
tagline:{
    type:String
},
schedule:{
    type:Date
},
description:{
    type:String
},
imagefile:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
moderator:{
    type:String
},
category:{
    type:String
},
sub_category:{
    type:String
},
rigor_rank:{
    type:Number
},
attendees:{
type:[Number]
}


})

const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
  });
  
const Image = mongoose.model('Image', imageSchema);
const Event =  mongoose.model("Event",eventschema)

export {Image,Event}
  