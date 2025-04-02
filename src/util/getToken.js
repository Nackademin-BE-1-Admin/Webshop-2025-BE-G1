export function getToken(req) {
    return (
        req.cookies?.['hakim-livs-token'] 
        || req.cookies?.token 
        || req.body?.['hakim-livs-token'] 
        || req.body?.token 
        || req.headers['x-token']
        || req.headers['hakim-livs-token']
        || req.headers['x-hakim-livs-token']
    );
}