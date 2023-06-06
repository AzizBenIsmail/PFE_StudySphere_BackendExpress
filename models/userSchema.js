const mongoose=require("mongoose");
userSchema = new mongoose.Schema(
    {
        username:String, //unique 
        first_Name:String,
        last_Name:String,
        email: String,
        password:String,
        createdAt: Date,
        updatedAt: Date,
        userType: String,
        image_user: String,
        enabled: Boolean, //
        phoneNumber: Number, //length 8

    },{timestamps:true}
);
userSchema.pre("save", function (next) {
    try {
    const User = this;  
    User.createdAt = new Date();
    User.updatedAt = new Date();

    next();
} catch (error) {
  next(error);
}
});

const User= mongoose.model("User",userSchema);
module.exports= User;