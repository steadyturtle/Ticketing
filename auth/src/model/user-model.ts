import mongoose from "mongoose";
import { Password } from "../services/password";

//an interface that describes the  properties
//that are used to create a new user
interface userAttr {
  email: string;
  password: string;
}
//an interface that describes the  properties
//that are used to create a user model
//it's a representation of a hole collection
interface userModel extends mongoose.Model<userDoc> {
  build(attrs: userAttr): userDoc;
}

//an interface that describes the properties
// that a User document has
//after saving data to db this is the object that a single record has
interface userDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await Password.toHash(this.get("password"));
    this.set("password", hash);
  }
  done();
});
userSchema.statics.build = (attr: userDoc) => {
  return new User(attr);
};
const User = mongoose.model<userDoc, userModel>("User", userSchema);
//User.build({email:'',password:''})
export { User };
