import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required!'));
        return; // without return, mongoose validation error raised by code below might break the api server!
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });


    try {
        await newUser.save();
        res.json('Signup success!')
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    if ( !email || !password || email === '' || password === '' ) {
        next(errorHandler(400, 'All fields are required!'));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(errorHandler(404, 'User not found!'));
            return
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            next(errorHandler(400, 'Invalid password!'))
            return
        }
        const {password: passwd, ...userInfo } = validUser._doc;

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(userInfo);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (validUser) {
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const {password, ...userInfo} = validUser._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(userInfo);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-8),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...userInfo } = newUser._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(userInfo);

        }
    } catch (error) {
        next(error);
    }
};