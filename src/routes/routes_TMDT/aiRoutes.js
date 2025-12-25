const express = require("express");

const {  taoNoiDungAI } = require("../../controllers/controller_TMDT/CRUD/geminiAIController");

const router = express.Router();

router.post("/generate", taoNoiDungAI);

module.exports = router;
