// Define the query and mutation functionality to work with the Mongoose models.
const { AuthenticationError } = require('apollo-server-express');
const { User, Rx } = require('../models');
const { signToken } = require("../utils/auth");


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('rx');
            }
            throw new AuthenticationError('You need to be logged in')
        },

    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this Email');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect Password');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveRx: async (parent, { rx }, context) => {
            // console.log(book)
            if (context.user) {
                const rxData = await User.findOneAndUpdate(
                    {
                        _id: context.user._id
                    },
                    {
                        $push: {
                            savedRx: rx
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                    },
                )
                // console.log(bookData);
                return rxData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeRx: async (parent, { rxId }, context) => {
            if (context.user) {
                const rx = await User.findOneAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $pull: {
                            savedRx: {
                                rxId: rxId
                            },
                        },
                    },
                    {
                        new: true
                    }
                )
                return rx
            }
            throw new AuthenticationError
        },
    },
};
module.exports = resolvers;