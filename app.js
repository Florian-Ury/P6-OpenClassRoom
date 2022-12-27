const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://Ury:1928@cluster0.qpzvsjs.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
