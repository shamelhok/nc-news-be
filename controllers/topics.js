const{selectTopics, insertTopic}= require('../models')
exports.getTopics = (req,res,next)=>{
    selectTopics().then(({rows})=>{
        let msg = 'no topics found'
        if(rows.length>0){
            msg = 'here are the topics'
        }
        res.status(200).send({msg,topics:rows})
    }).catch(next)
}
exports.postTopic = (req,res,next)=>{
    try {const {slug,description} =req.body
    insertTopic(slug,description)
        .then(({rows})=>{
            const new_topic =rows[0]
            res.status(201).send({new_topic})
        }).catch(next)
    } catch {res.status(400).send({msg:'bad request'})}
  }