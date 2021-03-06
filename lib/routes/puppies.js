const connection = require('../db');
const notFound = require('../utils/not-found');
const ObjectID = require('mongodb').ObjectID;

module.exports = function puppies(req, res) {
    const puppies = connection.db.collection('puppies');
    if (req.method === 'POST') {
        puppies.insert(req.body)
            .then(result => result.ops[0])
            .then(saved => {
                res.end(JSON.stringify(saved));
            })
            .catch(console.log); //eslint-disable-line
    } else if (req.method === 'GET' && !req.url.params.id) {
        puppies.find({})
            .toArray()
            .then(puppies => res.end(JSON.stringify(puppies)))
            .catch(console.log)//eslint-disable-line
    } else if (req.method === 'GET' && req.url.params.id) {
        let puppyId = new ObjectID(req.url.params.id);
        puppies.findOne({ _id: puppyId })
            .then(puppy => {
                if (!puppy) {
                    return notFound(req, res);
                } else {

                    res.end(JSON.stringify(puppy));
                }
            })
            .catch(console.log);//eslint-disable-line
    } else if (req.method === 'DELETE') {
        let puppyId = new ObjectID(req.url.params.id);
        puppies.remove({ _id: puppyId })
            .then(response => {
                if (response.result.n) res.end(JSON.stringify({ removed: true }));
                else res.end(JSON.stringify({ removed: false }));
            })
            .catch(console.log);//eslint-disable-line
    } else if (req.method === 'PUT') {
        let puppyId = new ObjectID(req.url.params.id);
        puppies.update({_id: puppyId}, { $set: req.body } )
            .then( response => {
                if (response.result.nModified) res.end(JSON.stringify({ modified: true }));
                else res.end(JSON.stringify({ modified: false }));
            })
            .catch(console.log); //eslint-disable-line
    } else {
        notFound(req, res);
    }
};