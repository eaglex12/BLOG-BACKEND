import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';

dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Invalid username or password' }); // Changed message
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}
export const logoutUser = async (request, response) => {
    try {
        const token = request.body.token;
        console.log('Received token:', token);


        if (!token) {
            return response.status(400).json({ msg: 'Token is required' });
        }

        const deletedToken = await Token.deleteOne({ token: token });

        if (deletedToken.deletedCount === 1) {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            console.log('Tokens removed from storage'); // Log that tokens were removed
            return response.status(204).json({ msg: 'Logout successful' });
        } else {
            return response.status(400).json({ msg: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error during logout:', error);
        return response.status(500).json({ msg: 'Internal server error' });
    }
}
