

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const getNewsData = async () => {
  let category = await AsyncStorage.getItem('category');
  
  if (!category) {
    category = 'general';
  }
  return axios.get(
    `https://newsapi.org/v2/top-headlines?category=${category?.toLowerCase()}&country=in&apiKey=ADD YOUR API KEY HERE`,
  );
};

export const getHeadlines = async () => {
    return axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=ADD YOUR API KEY HERE`,
    );
  };
