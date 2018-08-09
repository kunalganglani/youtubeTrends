import Axios from 'axios';
import * as config from '../config.json';
import moment from "moment";

const axios = Axios.create({
  baseURL: config.youtubeApi.endpoint
});


export class YoutubeService {
  getTrendingVideos(countryCode = 'AF') {
    const params = {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: countryCode, // should be replaced with country code from countryList
      maxResults: '24',
      key: config.youtubeApi.key
    };

    return axios.get('/', {
      params
    }).then(function (res) {
      return res.data.items.map(video => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: moment(video.snippet.publishedAt).fromNow(),
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount
      }))
    });
  }
}
