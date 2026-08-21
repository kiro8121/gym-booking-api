import { Request, Response, NextFunction } from 'express';


export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now(); // bnsgl w2t eltalb
    // finish حادثة بتشتغل أول ما السيرفر يخلص ويرجع الرد للعميل
    res.on('finish', () => {
        const duration = Date.now() - start; // بنحسب وقت التنفيذ
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
//bntb3 date method git url status code 200 w 7aga y3ny s7 w duration
    next();
};