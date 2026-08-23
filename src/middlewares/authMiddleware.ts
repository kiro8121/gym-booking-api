import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthentRequest extends Request {
    user?: { userId: string; role: string };
}

export const authenticate = (req: AuthentRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({
            message: 'Unauthorized: No token provided'
        });
   
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'supersecretkey'
        ) as { userId: string; role: string };
        
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorize = (...roles: string[]) => {
    
    return (req: AuthentRequest, res: Response, next: NextFunction) => {
        
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' }); 
        }
        next();
    };
};