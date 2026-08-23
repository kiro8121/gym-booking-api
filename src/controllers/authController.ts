import { Request, Response, NextFunction } from 'express';


import bcrypt from 'bcryptjs';


import jwt from 'jsonwebtoken';


import User from '../models/userModel';


import { AuthentRequest } from '../middlewares/authMiddleware';


// register
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        
      const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role
        });
        

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
        
    } catch (err) {
        next(err);
        
    }
};


// login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    try {

        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
       
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
       
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || 'supersecretkey',
            {
                expiresIn: '1d'
            }
        );

        res.json({
            token,
            role: user.role
        });
        
    } catch (err) {
        next(err);
        
    }
};


// get information about me 
export const getMe = async (
    req: AuthentRequest,
    res: Response,
    next: NextFunction
) => {
   
    try {
        const user = await User
            .findById(req.user?.userId)
            .select('-password');
        res.json(user);

    } catch (err) {
        next(err);
    }
};