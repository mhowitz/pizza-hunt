const req = require('express/lib/request');
const { Pizza } = require('../models');


const pizzaController = {
    //get all pizzas 
    getAllPizza(req, res) {
        Pizza.find({})
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbPizza => res.json(dbPizza))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments', 
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizza => {
            if(!dbPizza) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizza)
        }).catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizza => res.json(dbPizza))
        .catch(err => res.status(400).json(err))
    },
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbPizza => {
            if(!dbPizza) {
                res.status(404).json({ message: 'no pizza found with this id' });
                return;
            }
            res.json(dbPizza)
        }).catch(err => res.status(400).json(err));
    },
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizza => {
            if(!dbPizza) {
                res.status(404).json({ message: 'no pizza found with this id' });
                return;
            }
            res.json(dbPizza)
        }).catch(err => res.status(400).json(err))
    }
};

module.exports = pizzaController;