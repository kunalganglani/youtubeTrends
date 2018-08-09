import express from 'express';
import * as config from '../config.json';
import { YoutubeService } from '../services/youtube';

const router = express.Router();
const service = new YoutubeService();

/* GET home page. */
router.get('/', async (req, res) => {
  const countryCode = req.query.countryCode;
  const trends = await service.getTrendingVideos(countryCode);
  res.render('youtube/index', {
    title: config.title,
    videos: trends,
    countryList: config.countryList,
    selectedCountry: countryCode || "AF"
  });
});

router.get('/:videoId', async (req, res) => {
  const countryCode = req.query.countryCode;
  res.render('youtube/player', {
    title: config.title,
    videoId: req.params.videoId,
    countryList: config.countryList || "AF",
    selectedCountry: countryCode || "AF"
  });
});

module.exports = router;
