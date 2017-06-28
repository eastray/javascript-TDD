/**
 * Created by dhkim on 2017-05-12.
 */
const models = require('../../models');

const index = function (req, res) {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }
  models.User
    .findAll({
      limit: limit
    })
    .then(users => {
      res.json(users);
    });
};

const show = function (req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();
  /*const user = users.filter((user) => {
   user.id === id;
   })[0];*/
  models.User.findOne({
    where: {id}
  }).then(user => {
    if (!user) return res.status(404).end();
    res.json(user);
  });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();
  models.User.destroy({
    where: {id}
  }).then(() => {
    res.status(204).end();
  });
  //const user = users.filter(user => user.id !== id);
};

const create = (req, res) => {
  const name = req.body.name;

  if (!name) return res.status(400).end();

  //const isConflic = users.filter(user => user.name === name).length;
  //if (isConflic) return res.status(409).end();

  //const id = Date.now();
  //const user = {id, name};
  //users.push(user);
  models.User.create({name})
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstrainError') {
        return res.status(400).end()
      }
    })
};

const update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const name = req.body.name;
  if (!name) return res.status(400).end();

  //if (isConflict) return res.status(409).end();


  models.User.findOne({where: {id}})
    .then(user => {
      if (!user) return res.status(404).end();

      user.name = name;
      user.save()
        .then(() => {
          res.json(user);
        })
        .catch((err) => {
          if (err.name === 'SequelizeUniqueConstrainError') {
            return res.status(409).end();
          }
          res.status(500).end();
        })
    });
};

module.exports = {
  index, show, destroy, create, update,
  /*index: index,
   show: show,
   destroy: destroy,
   create: create,
   update: update*/
};