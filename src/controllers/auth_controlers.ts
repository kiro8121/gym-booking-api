import { Request, Response, NextFunction } from 'express';
// Request bya5od el data el user ba3atha
// Response bnsta5dmo 3ashan nrd 3ala el user
// next 3ashan nkamel lel step el b3dha

import bcrypt from 'bcryptjs';
// bcrypt by3ml hashing lel password
// 3ashan man5azensh el password el 7a2ee2y fe database

import jwt from 'jsonwebtoken';
// jwt by3ml token ba3d el login
// el token by5aly el server y3raf en el user logged in

import User from '../models/model_user';
// User da el Model beta3 el User
// mn 5elalo bn3amel users fe MongoDB

import { Authent_Request } from '../middlewares/auth_auth_middleware';
// Authent_Request da Request 3ady bas mzawden 3aleh user
// 3ashan n2dar nwsel lel userId w role ba3d el authentication


export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // register mas2ola 3an enaha t3ml account gded

    try {
        // bn7awel ننفذ el code
        // law 7asal error nroo7 lel catch


        const { fullName, email, password, role } = req.body;
        // bn5od el data ely el user ba3atha mn req.body
        // fullName = esm el user
        // email = email beta3o
        // password = el password ely da5alo
        // role = el role beta3o



        // 1. F7s el Inputs
        // bnshof en el fields el asaseya mawgooda

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }
        // law ay field mn dol msh mawgood
        // bnrg3 400 w n2af el function

        // regex 3shan at2aked en el email maktob bsoora sa7
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// lw el email msh sa7 bnrg3 error
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // 2. El tashyeek 3ala wogood el email
        // bnshof el email da already mawgod fe database wla la

        const existingUser = await User.findOne({ email });
        // findOne btdawar fe MongoDB 3ala user 3ando nafs el email

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        // law la2ena user بنفس el email
        // man3mlsh account gded


        // 3. Hashing lel password
        // bn3ml hashing abl ma n5azen el password

        const hashedPassword = await bcrypt.hash(password, 10);
        // password = el password el 7a2ee2y
        // hashedPassword = el password ba3d el hashing
        // 10 = Salt Rounds


        // 4. Ta5zeen el User fe MongoDB

        const user = await User.create({
            full_Name: fullName,
            email,
            hass_password: hashedPassword,
            role
        });
        // hena mohem جدًا:
        // full_Name hya esm el field fe el Schema
        // fa bn7ot fullName ely gay mn el user fe full_Name
        //
        // hass_password hya esm el field fe el Schema
        // fa bn5azen gowaha el hashedPassword
        // msh el password el 7a2ee2y


        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
        // 201 ya3ny account et3amal بنجاح
        // bnrg3 message w userId


    } catch (err) {
        next(err);
        // law 7asal error bn3adee el error lel errorMiddleware
    }
};



export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // login mas2ola 3an enha tet2aked en el user data sa7

    try {

        const { email, password } = req.body;
        // bn5od email w password ely el user da5alhom


        // 1. El ba7s 3an el User

        const user = await User.findOne({ email });
        // bnsearch fe MongoDB bel email

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        // law el user msh mawgod يب2a el email 8alat


        // 2. Mo2arana el password

        const isMatch = await bcrypt.compare(
            password,
            user.hass_password
        );
        // bn2aren el password ely el user da5alo
        // ma3 el hashed password ely fe database
        //
        // mohem:
        // user.hass_password 3ashan da howa esm el field
        // fe el Schema


        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        // law el password 8alat bnrg3 error


        // 3. Tawlيد el JWT Token

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            // bn7ot userId w role gwa el token
            // msh bn7ot password 3ashan da sensitive


            process.env.JWT_SECRET || 'supersecretkey',
            // el secret key ely bnst5dmha 3ashan n3ml w nverify el token
            // el afdal en JWT_SECRET tekoon fe .env


            {
                expiresIn: '1d'
            }
            // el token salahyeto yom wa7ed
        );


        res.json({
            token,
            role: user.role
        });
        // bnrg3 el token lel user
        // el user byst5dmo ba3d kda fe requests ely me7taga login


    } catch (err) {
        next(err);
        // bn3adee ay error lel errorMiddleware
    }
};



export const getMe = async (
    req: Authent_Request,
    res: Response,
    next: NextFunction
) => {
    // getMe btgeb data beta3t el user ely 3amel login
    // hena bnst5dm Authent_Request 3ashan req.user mawgood


    try {

        const user = await User
            .findById(req.user?.userId)
            .select('-hass_password');
        // bngeb el user bel userId ely gwa el token
        //
        // select('-hass_password')
        // ya3ny matrg3sh el hashed password fe el response
        //
        // mohem:
        // el field esmo hass_password fe el Schema
        // fa lazm nktbo hena msh '-password'


        res.json(user);
        // bnrg3 data beta3t el user lel client
        // mn 8er hashed password


    } catch (err) {
        next(err);
        // bn3adee el error lel errorMiddleware
    }
};