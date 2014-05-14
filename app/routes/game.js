'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper.js');
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder: Home'});
};

exports.sellall = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.userId);
  users.findOne({_id: _id}, (err, user)=>{

    user.cash = user.cash + (user.wood / 5);
    user.wood = 0;

    users.save(user, (err, count)=>{
      res.send(user);
    });

  });
};

exports.sell = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.userId);

  users.findOne({_id: _id}, (err, user)=>{

    user.cash = user.cash + (req.body.wood / 5);
    user.wood = user.wood - req.body.wood;

    users.save(user, (err, count)=>{
      res.send(user);
    });

  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findAndRemove({_id: treeId}, (err, tree)=>{
    var _id = Mongo.ObjectID(tree.userId);

    users.findOne({_id: _id}, (err, user)=>{

      tree.isChopped = true;
      user.wood = user.wood + (tree.height / 2);

      users.save(user, (err, count)=>{
        res.send(user);
      });

    });
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id: treeId}, (err, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0,100) !== 69;

    trees.save(tree, (err, count)=>{
      res.render('game/tree', {tree: tree, treeHelper: treeHelper}, (err, html)=>{
        res.send(html);
      });

    });
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  trees.find({userId: userId}).toArray((err, objs)=>{
    res.render('game/forest', {trees: objs, treeHelper: treeHelper}, (err, html)=>{
      res.send(html);
    });
  });
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username: user.username}, (err, foundObj)=>{

    if(foundObj){
      res.send(foundObj);
    } else {
      users.save(user, (err, obj)=>{
        res.send(obj);
      });
    }

  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (err, obj)=>{
    res.render('game/tree', {tree: obj, treeHelper: treeHelper}, (err, html)=>{
      res.send(html);
    });
  });
};
