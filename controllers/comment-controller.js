const { Comment, Pizza } = require('../models');


const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
            )
        }).then(dbPizza => {
            if(!dbPizza) {
                res.status(404).json({ message: 'no pizza found with this id ' });
                return;
            }
            res.json(dbPizza)
        }).catch(err => res.json(err))
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedCmnt => {
            if(!deletedCmnt) {
                return res.status(404).json({ message: 'no comment with this id ' });
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        }).then(dbPizza => {
            if(!dbPizza){
                res.status(404).json({ message: 'No pizza found w this iddddd ' });
                return;
            }
            res.json(dbPizza)
        }).catch(err => res.json(err));
    }
};

module.exports = commentController;