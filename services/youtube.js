import Axios from 'axios';
import * as config from '../config.json';
import moment from "moment";

const axios = Axios.create({
  baseURL: config.youtubeApi.endpoint
});

export class YoutubeService {
  getTrendingVideos(countryCode = 'AF') {
    var trendingVidParams = {
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: countryCode, // replaced with country code from countryList
      maxResults: '24',
      key: config.youtubeApi.key
    };

    var result = [];

    return axios.get('/', {params: trendingVidParams}).then(async function(res){
      result = res.data.items;
      for (var i = 0; i < result.length; i++) {
        result[i] = {
          id: result[i].id,
          title: result[i].snippet.title,
          thumbnail: result[i].snippet.thumbnails.high.url,
          publishedAt: moment(result[i].snippet.publishedAt).fromNow()
        };
        result[i] = await YoutubeService.getVideoDetails(result[i]);
      }

      return result;
    });

  }

  static getVideoDetails(video) {
    var vidDetailsparams = {
      part: 'statistics',
      id: video.id,
      key: config.youtubeApi.key
    };

    return axios.get('/', {params: vidDetailsparams}).then(function(res) {
      var result = res.data;
      video.viewCount = result['items'][0].statistics.viewCount;
      video.likeCount = result['items'][0].statistics.likeCount;

      return video;
    });
  }
}
