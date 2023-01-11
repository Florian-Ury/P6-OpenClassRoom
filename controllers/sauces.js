const Sauces = require('../models/Sauces');
const fs = require("fs");
const {findIndex} = require("rxjs");


  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
      ...sauceObject,
      userId:req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then( () => res.status(201).json({message : "Objet enregistré !"}))
      .catch(error => res.status(400).json({error}))
  };

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
      .then(sauce => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({message : "Non autorisé"})
        } else {
          Sauces.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : "Sauces mis à jour"}))
            .catch(error => {res.status(401).json({error})})
        }
      })
      .catch(error => { res.status(400).json({error})})
  };

  exports.deleteSauce = (req, res, next)=> {
    Sauces.findOne({ _id : req.params.id})
      .then(sauce => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({message : 'Non-autorisé'});
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauces.deleteOne({_id : req.params.id})
              .then( () => { res.status(200).json({message: "Objet supprimé"})})
              .catch(error => {res.status(400).json({error})})
          })
        }
      })
      .catch(error => {
        res.status(500).json({error})
      })
  };

  exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id : req.params.id })
      .then( sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
  };

  exports.getAllSauce = (req, res, next) => {
    Sauces.find()
      .then( sauce => res.status(200).json(sauce))
      .catch( error => res.status(400).json(error));

  };

  exports.getLike = (req, res, next) => {
    Sauces.findOne({ _id : req.params.id })
      .then( sauce => {
        let like = req.body.like
          if (like === 1) {
          let addingLike = 0
            if (sauce.likes == null){
                addingLike = 1
            } else {
              addingLike = parseInt(sauce.likes)+1
            }
            Sauces.updateOne({ _id : req.params.id}, {likes: addingLike, _id: req.params.id, $push: {usersLiked : req.body.userId}})
              .then(() => res.status(200).json({message : "like mis à jour"}))
              .catch(error => {res.status(401).json({error})})
          } else if (like === -1) {
            let addingDislikes = 0
            if (sauce.dislikes == null){
              addingDislikes = 1
            } else {
              addingDislikes = parseInt(sauce.dislikes)+1
            }
            Sauces.updateOne({ _id : req.params.id}, {dislikes: addingDislikes, _id: req.params.id, $push: { usersDisliked : req.body.userId}})
              .then(() => res.status(200).json({message : "like mis à jour"}))
              .catch(error => {res.status(401).json({error})})
          } else if (like === 0) {
              let calcul = 0
              const usersLiked = sauce.usersLiked.includes(req.body.userId)
              const usersDisliked = sauce.usersDisliked.includes(req.body.userId)
              if (usersLiked === true) {
                calcul = parseInt(sauce.likes)-1
                Sauces.updateOne({ _id : req.params.id}, {likes: calcul, _id: req.params.id, $pull: { usersLiked : req.body.userId}})
                  .then(() => res.status(200).json({message : "like mis à jour"}))
                  .catch(error => {res.status(401).json({error})})
              } else if (usersDisliked === true) {
                calcul = parseInt(sauce.dislikes)-1
                Sauces.updateOne({ _id : req.params.id}, {dislikes: calcul, _id: req.params.id, $pull: { usersDisliked : req.body.userId}})
                  .then(() => res.status(200).json({message : "like mis à jour"}))
                  .catch(error => {res.status(401).json({error})})
              }
            }
      })
      .catch(error => res.status(404).json({error}));
  };
