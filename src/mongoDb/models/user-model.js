import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
 fullName: {type:String, required:true},
 phone:{type:String,required:true},
 email:{type:String,required:true,unique:true,lowercase:true},
 password:{type:String,required:true,minLength:6},
 role:{
    type:String,
    enum:["user","admin","super_admin"],
    default: "user",
 }
},{timestamps:true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  

  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  export default mongoose.model("User", userSchema);