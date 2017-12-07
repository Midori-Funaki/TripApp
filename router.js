module.exports = (express) =>{
    const router = express.Router();

    router.get('/trip',(req,res)=>{
        res.render('trip');
    })

    return router;
}