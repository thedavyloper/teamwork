const express = require('express');
const cors = require('cors');
require('dotenv').config();
const client = require('../db/config');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());

exports.createArticle = (req, res, next) => {
  console.log(req.body)
  
  
  const { title, article, date } = req.body

  const sql = 'INSERT INTO articles (title, article, now()::date) VALUES ($1, $2, $3)';

  
  const params = [title, article, date];

  return client.query(sql, params)
  .then(() => {
    res.status(201).json({
      message: 'Article successfully posted'
    })
  })
  .catch(error => {
    res.status(404).json({
      message: error
    })
  })  
}

exports.getArticleById = (req, res, next) => {
  const sql = 'SELECT now()::date * FROM articles WHERE articleId = $1;'
  const params = [parseInt(req.params.id)];
  return client.query(sql, params)
  .then(article => {
    res.status(200).json({
      result: article.rows,
      
    })
  })
  .catch(error => {
    res.status(403).json({
      error
    })
  })
}



exports.getArticles = (req, res, next) => {

  return client.query('SELECT * FROM articles;')
  .then((articles) => {
    res.status(200).json({
      message: 'Articles requested successfully',
      log: console.log(articles.rows),
      
    })
  })
  .catch(error => {
    res.status(404).json({
      message: error
    })
  }) 

}

exports.updateArticleById = (req, res, next) => {
  
  const { title, article, date } = req.body
  const sql = 'UPDATE articles SET title = $1, article = $2, now()::date = $3 WHERE articleId = $4;'
  const params = [title, article, date, parseInt(req.params.id)]
  return client.query(sql, params)
  .then(article => {
    res.status(201).json({
      Update: article.rows,
      log: console.log(article.rows)
    })
  })
  .catch(error => {
    res.status(404).json({
      error
    })
  })
}

exports.deleteArticleById = (req, res, next) => {
  
  const sql = 'DELETE now() FROM articles WHERE articleId = $1;'
  const params = [parseInt(req.params.id)]
  return client.query(sql, params)
  .then(result => {
    res.status(200).json({
      Deleted: result.rows
    })
  })
  .catch(error => {
    res.status(404).json({
      error
  })
  })
}
