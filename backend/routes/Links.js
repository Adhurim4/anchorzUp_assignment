const express = require('express');
const {Links}  = require("../models");
const router = express.Router();
const crypto = require('crypto');  
const Sequelize = require('sequelize');

const moment = require('moment');

router.post("/", async (req, res) => {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });
    let expirationDate = null;

    if (body.expiration) {
        const minutesMatch = body.expiration.match(/^(\d+)m$/);
        if (minutesMatch) {
            expirationDate = moment().add(parseInt(minutesMatch[1], 10), 'minutes').toDate();
        }

        const hoursMatch = body.expiration.match(/^(\d+)h$/);
        if (hoursMatch) {
            expirationDate = moment().add(parseInt(hoursMatch[1], 10), 'hours').toDate();
        }
    }

    try {
        const newLink = await Links.create({
            shortUrl: generateShortURL(body.url),
            originalUrl: body.url,
            expirationDate: expirationDate,
        });
        return res.json(newLink);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const link = await Links.findByPk(id);
  
      if (!link) {
        return res.status(404).json({ error: "Link not found" });
      }
  
      await link.destroy();
  
      return res.json({ message: "Link deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });

 
router.get("/", async (req, res) => {
    try {
      const currentDate = new Date();
  
      const listOfValidLinks = await Links.findAll({
        where: {
            expirationDate: {
            [Sequelize.Op.or]: {
              [Sequelize.Op.eq]: null,
              [Sequelize.Op.gte]: currentDate, 
            },
          },
        },
      });
  
      res.json(listOfValidLinks);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  router.get("/:shortUrl", async (req, res) => {
    const shortUrl = req.params.shortUrl;
  
    try {
      const link = await Links.findOne({ where: { shortUrl } });
      if (!link) {
        return res.status(404).json({ error: "Short link not found" });
      }
      if (link.expirationDate && new Date() > link.expirationDate) {
        return res.status(403).json({ error: "Short link has expired" });
      }

      return res.redirect(link.originalUrl);
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });
  

function generateShortURL(originalUrl) {
    const hash = crypto.createHash('sha256').update(originalUrl).digest('hex');
    return hash.substr(0, 8); 
}

module.exports = router;
