const{selectTopics}= require('../models')
exports.getTopics = (req,res,next)=>{
    selectTopics().then(({rows})=>{
        let msg = 'no topics found'
        if(rows.length>0){
            msg = 'here are the topics'
        }
        res.status(200).send({msg,topics:rows})
    }).catch(next)
}