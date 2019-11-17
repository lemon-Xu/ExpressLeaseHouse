import axios from 'axios'
const loginAPI1 = (usersName, usersPass)=>{
    axios.get('/api1_users', {
        params: {
          "usersName": usersName,
          "usersPass": usersPass
        }
      })
        .then(function (res) {
          console.log(res)
        })
        .catch(function (err) {
          console.log(err)
        })
}

export {loginAPI1}