var express = require('express');
var router = express.Router();

router.get(':houseId',function(req, res,) {
  console.log('---get')
  console.log(req.query)
  var ret = {
    'houseID': req.query.houseID
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