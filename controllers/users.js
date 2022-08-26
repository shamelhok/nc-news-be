const {selectUsers, selectUserByUsername, insertUser} = require('../models')

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
exports.addUser=(req,res,next)=>{
    try {const {username,name,avatar_url} =req.body
    insertUser(username,name,avatar_url)
        .then(({rows})=>{
            const new_user =rows[0]
            res.status(201).send({new_user})
        }).catch(next)
    } catch {res.status(400).send({msg:'bad request'})}
  }