// 4 parameters 5alyin Express y3raf en da Global Error Handler
// ya3ny ay error y7sal fe el app momken ywsal lel function de
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // err = el error ely 7asal
    // req = el request ely el user ba3ato
    // res = el response ely hnrdo بيه 3ala el user
    // next = bnsta5dmo 3ashan nkamel lel middleware ely ba3do law me7tag


    console.error('Global Error Handler:', err);
    // bnprint el error fe el terminal
    // 3ashan e7na k developers n3raf el moshkela 7aslet feen


    const status = err.status || 500;
    // bnshof el error 3ando status code wla la
    // law 3ando status code bnst5dmo
    // law msh mawgod bnst5dm 500
    // 500 ya3ny Internal Server Error


    const message = err.message || 'Internal Server Error';
    // bnshof el error 3ando message wla la
    // law 3ando message bnrg3ha lel user
    // law msh mawgoda bnrg3 message default


    // 4. Targ3 error mratab fe JSON
    res.status(status).json({
        success: false,
        status,
        message
    });
    // bnrg3 response lel user
    // success false ya3ny el operation matmtesh بنجاح
    // status = HTTP status code zay 400 aw 404 aw 500
    // message = description beta3t el error
};