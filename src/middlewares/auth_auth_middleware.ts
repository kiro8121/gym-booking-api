import { Request, Response, NextFunction } from 'express';
//m3rofa y3ny yerd ya5d  w next el hoa shofony md7y kmlo el b3dy
import jwt from 'jsonwebtoken';
//jwt y3ml token lw token mt8irtsh 3shan msh kol shoia ysgl


export interface Authent_Request extends Request {
    user?: { userId: string; role: string };
}
//interface ll authentication request hoa hoa request bta3 express bs mzoden 3leh user

export const authenticate = (req: Authent_Request, res: Response, next: NextFunction) => {
//authenticate yt2kd ank logged in
    const token = req.headers.authorization?.split(' ')[1];
// ya5d token yt2kd w 2wl myshof msa7a
    if (!token)
        return res.status(401).json({
            message: 'Unauthorized: No token provided'
        });
    // try grb lw mzbtsh 5owsh 3la el catch
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'supersecretkey'
        ) as { userId: string; role: string };
        // be5tsar lw token s7 tl3 el bianat el mwgoda goa el token asmha decoded
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
// at2ra tmam wdeh controlers msh s7 tl3 error
export const authorize = (...roles: string[]) => {
    // da authrize yt2kd mn el role w da bi7dd anhy role le sla7iat eh w de el closure
    // bm3ny function bt7dd an kan function tany tsht8l wla la 2w mmkn ttsma callback
    // brdo 3l 7sb

    return (req: Authent_Request, res: Response, next: NextFunction) => {
        // bnshof lw da user w bnshof lw m3ah role s7 tmam y3dy msh tmam tl3 error 403
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' }); // 403 ممنوع لعدم وجود صلاحية
        }
        next();
    };
};

