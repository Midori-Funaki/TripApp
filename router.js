module.exports = (express) =>{
    const router = express.Router();

    router.get('/',(req,res)=>{
        res.render('trip');
    })

    router.post('/add-trip', (req, res) => {
        let from_date = req.body['from-date'],
            to_date = req.body['to-date'];

        res.render('search', {'from-date': from_date, 'to-date': to_date});
    })

    return router;
}