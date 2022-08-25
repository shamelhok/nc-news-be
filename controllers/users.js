const {selectUsers, selectUserByUsername} = require('../models')

exports.getUsers = (req,res,next)=>{
    selectUsers().then(({rows:users})=>{
        if(users.length===0){ res.status(404).send({msg:'users not found'})}
        res.status(200).send({users})
    }).catch(next)
}
exports.getUserByUsername = (req,res,next)=>{
    const {username} =req.params
    selectUserByUsername(username).then(({rows:users})=>{
        if(users.length===0){ res.status(404).send({msg:'user not found'})
    } else{ res.status(200).send({user:users[0]})}
    }).catch(next)
}