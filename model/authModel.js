import mongoose from "mongoose";
import  validator  from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema({ 

    name:{
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validator: {
          validate: (value) => validator.isEmail(value),
          message: "Email is not valid",
        },
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    active: {
        type: Boolean,
        default: true,
      },
    
 },
 { timestamps: true }
 );

 authSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });


 const authModel = mongoose.model("auth", authSchema);

 export default authModel;