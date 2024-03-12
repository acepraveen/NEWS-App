import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {newsCategory, sampleNewsData} from '../constants/data';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors} from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getHeadlines} from '../Api/Api';
import Loader from '../components/Loader';

export default function Home() {
  const [currentCate, setCurrentCate] = useState('');
  const [headlinesData, setHeadlinesData] = useState([]);
  const [loader,setLoader] = useState(false)
  const navigation = useNavigation();

  const updateCategory = async item => {
    await AsyncStorage.setItem('category', item.name);
    setCurrentCate(item.name);
    navigation.navigate('NewsScreen',{category:item.name});
  };

  const handleDefaultCategory = async () => {
    setLoader(true)
    let result = await AsyncStorage.getItem('category');
    setCurrentCate(result);
    setLoader(false)
  };

  useEffect(() => {
    handleDefaultCategory();
  }, [currentCate]);

  const handleHeadlines = async () => {
    let result = await getHeadlines();
    setHeadlinesData(result.data);
  };

  useEffect(() => {
    handleHeadlines();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Loader visible={loader}/>
      <Text style={styles.cateHeading}>Select Category</Text>
      <View style={{height: responsiveHeight(30)}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={newsCategory}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                updateCategory(item);
              }}>
              <ImageBackground
                source={{uri: item.img}}
                style={styles.cateView}
                resizeMode={'cover'}
                blurRadius={4}>
                <Text
                  style={[
                    styles.cateName,
                    {
                      borderWidth: currentCate === item.name ? 2 : 0,
                    },
                  ]}>
                  {item.name}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
      <Text style={styles.cateHeading}>Headlines</Text>
      <View style={{paddingBottom: responsiveHeight(4)}}>
      <FlatList
        data={headlinesData?.articles}
        keyExtractor={(item): string => item.title}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          function changeImageCategory() {
            throw new Error('Function not implemented.');
          }

          let date = new Date(item.publishedAt);
          const formattedDate = date.toLocaleDateString('en-in', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          return (
            <TouchableOpacity
              style={styles.headlineCard}
              onPress={() => {
                navigation.navigate('FullStory', {url: item?.url});
              }}>
              <View style={{flexDirection: 'row'}}>
                <ImageBackground
                  source={{
                    uri: item.urlToImage,
                  }}
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(30),
                    borderWidth:responsiveWidth(0.1),
                    borderColor: Colors.black,
                    justifyContent:'center',
                    alignItems:'center'
                  }}
                  resizeMode={'stretch'}
                >
                 {!item.urlToImage ?
                  <Text style={{color:Colors.black}}>No Image</Text>
                 :null}
                </ImageBackground>
                <Text style={styles.newsTitle} numberOfLines={6}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.newsSection}>
                <View>
                  <Text style={styles.newsDesc} numberOfLines={4}>
                    {item.description ? item.description: 'Description is not available.'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: responsiveHeight(2),
    paddingRight: 0,
    backgroundColor: Colors.white,
    flexGrow: 1,
    paddingBottom: responsiveHeight(5)
  },
  cateHeading: {
    color: Colors.black,
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
  },
  cateName: {
    color: Colors.white,
    margin: responsiveHeight(2),
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
    paddingHorizontal: responsiveHeight(1),
    borderColor: Colors.white,
    borderStyle: 'dashed',
  },
  cateView: {
    height: responsiveHeight(30),
    width: responsiveWidth(80),
    marginLeft: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 1,
    borderWidth: responsiveWidth(0.1),
  },
  headlineCard: {
    height: responsiveHeight(30),
    paddingRight: responsiveHeight(1),
    marginBottom: responsiveWidth(4),
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
    width: responsiveWidth(90),
    backgroundColor: Colors.white,
    elevation: 3,
    borderWidth: responsiveWidth(0.1),
  },
  newsSection: {
    width: responsiveWidth(90),
    flexDirection: 'column',
    alignItems: 'center',
  },
  newsTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(56),
    paddingHorizontal: responsiveWidth(3),
    alignSelf: 'center',
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  newsDesc: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(80),
    paddingHorizontal: responsiveWidth(3),
    alignSelf: 'center',
    textAlign: 'justify',
    marginVertical: responsiveHeight(2),
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  newsDate: {
    color: Colors.grey,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(45),
  },
  newsAuthor: {
    color: Colors.grey,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(45),
    textAlign: 'right',
  },
});
