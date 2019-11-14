var express = require('express');
var router = express.Router();
 
router.get('/:name', function(req, res) {
  
});
 
router.get('',function(req, res,) {
  console.log('---get')
  console.log(req.query)
  var ret = {
    "usersName": req.query.usersName,
    "usersPass": req.query.usersPass,
    "usersRank": req.query.usersRank
  }

  res.end(JSON.stringify(ret))
})

router.post('',function(req, res,) {
  console.log('---post')
  console.log(req.body)
  var ret = {
    "usersName": req.body.usersName,
    "usersPass": req.body.usersPass,
    "usersRank": req.body.usersRank
  }

  res.end(JSON.stringify(ret))
})

router.delete('',function(req, res,) {
  console.log('---delete')
  console.log(req.body)
  var ret = {
    "usersName": req.body.usersName,
    "usersPass": req.body.usersPass,
    "usersRank": req.body.usersRank
  }

  res.end(JSON.stringify(ret))
})

router.put('',function(req, res,) {
  console.log('---put')
  console.log(req.body)
  var ret = {
    "usersName": req.body.usersName,
    "usersPass": req.body.usersPass,
    "usersRank": req.body.usersRank
  }

  res.end(JSON.stringify(ret))
})

module.exports = router;