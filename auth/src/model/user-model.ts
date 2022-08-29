import mongoose from "mongoose";
import { Password } from "../services/password";

//an interface that describes the  properties
//that are used to create a new user
interface userAttr{
    email: string,
    password: string
}
//an interface that describes the  properties
//that are used to create a user model
interface userModel extends mongoose.Model<userDoc>{
    build(attrs: userAttr): userDoc;   
}

//an interface that describes the properties 
// that a User document has
interface userDoc extends mongoose.Document{
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }


})
userSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hash =  await Password.toHash(this.get('password'))
        this.set('password',hash)

    }
    done()
})
userSchema.statics.build = (attr)=>{
    return new User(attr)
}
const User = mongoose.model<userDoc,userModel>("user",userSchema)
//User.build({email:'',password:''})
export {User};