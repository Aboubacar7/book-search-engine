const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log("signup", user);
      return { token, user };
    },
    loginUser: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("Incorrect email");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError("incorrect password");
        }
        console.log("login", user);
        const token = signToken(user);
        console.log(token)
        return { token, user };
        
      } catch (err) {
        console.log(err);
      }
    },

    saveBook: async (parent, { bookData }, context) => {
      console.log(bookData);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("you need to be logged in");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { book: { _id: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("book has not been removed");
    },
  },
};

module.exports = resolvers;
