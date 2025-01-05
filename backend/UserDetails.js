const mongoose=require("mongoose");

const UserDetailSchema= new mongoose.Schema(
    {
        name:String,
        id: String,
        email:{type:String, unique: true},
        phone: String,
        password: String,
        confirmPassword: String,

    },
    {
        collection: "UserInfo",
    }

);
mongoose.model("UserInfo",UserDetailSchema);