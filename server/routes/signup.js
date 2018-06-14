import express from 'express';

let router = express.Router();


router.post('/', async (req, res) => {
  console.log('received');

});

export default router;