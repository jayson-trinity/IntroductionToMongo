const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    reqired: true, 
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const Users = mongoose.model('user', userSchema)

exports.createUser = async (data) => {
  return await new Users(data).save();
}

exports.getAllUsers = async () => {
  return await Users.find({});
}

exports.getOneUser = async (userId) => {
  const user = await Users.findOne({ _id: userId });
  if (!user) throw new Error("User does not exists");

  return user
}

exports.updateUser = async (userId, data) => {
  const user = await Users.findByIdAndUpdate(
    { _id: userId },
    { $set: data }
  );

  if (!user) throw new Error("User doesn't exist", 404);

  return user;
}

exports.deleteUser = async (userId) => {
  const user = await Books.findOne({ _id: userId });
  user.remove()
  return user
}
