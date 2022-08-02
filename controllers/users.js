const {selectUsers} = require('../models')

exports.getUsers = (req,res,next)=>{
    selectUsers().then(({rows:users})=>{
        if(users.length===0){ res.status(404).send({msg:'users not found'})}
        res.status(200).send({users})
    }).catch(next)
}