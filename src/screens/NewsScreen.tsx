import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors} from '../constants/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import Clipboard from '@react-native-clipboard/clipboard';
import {getNewsData} from '../Api/Api';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

export default function NewsScreen() {
  const flatListRef = useRef(null);
  const shotRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [hinNews, setHinNews] = useState({
    title: '',
    desc: '',
  });
  const [generate, setGenerate] = useState(false);
  const navigation = useNavigation();
  const params = useRoute()

  const speakTxt = async item => {
    let lang = await AsyncStorage.getItem('lang');
    if (lang === 'hindi') {
      Tts.setDefaultLanguage('hi-IN');
    } else if (lang === 'english') {
      Tts.setDefaultLanguage('en-IN');
      await AsyncStorage.setItem('lang', 'hindi');
    }
    Tts.speak(item.title);
    Tts.speak(item.description);
  };

  const copyToClipboard = item => {
    Clipboard.setString(item.title + '.\n' + item.description);
  };

  const getNewsInfo = async () => {
    setLoader(true);
    let result = await getNewsData();
    setNewsData(result.data);
    setLoader(false);
  };

  const shareNews = async () => {
    setGenerate(true);
    await shotRef?.current.capture().then(uri => {
      // setImage(uri);
      let options = {
        title: 'NEWS',
        message: 'Download our news app',
        url: uri,
        saveToFiles: true,
      };
      Share.open(options)
        .then(res => {
          // setGenerate(false)
          navigation.navigate('Home');
        })
        .catch(err => {
          setGenerate(false);
        });
    });
  };

  useEffect(() => {
    getNewsInfo()
  }, [params]);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />
      <FlatList
        ref={flatListRef}
        data={newsData?.articles}
        keyExtractor={(item): string => item.title}
        showsVerticalScrollIndicator={false}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        snapToInterval={responsiveHeight(100)}
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
            <ViewShot
              ref={shotRef}
              options={{
                fileName: 'newsapp',
                format: 'png',
                quality: 1,
              }}>
                <ImageBackground
                  source={{
                    uri: item.urlToImage ? item.urlToImage : 'null',
                  }}
                  style={{
                    height: responsiveHeight(60),
                    width: responsiveWidth(100),
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  resizeMode={'stretch'}>
                  {!item.urlToImage ? (
                    <Text style={{color: Colors.white}}>No Image</Text>
                  ) : null}
                  <LinearGradient
                    colors={['#3E5151', '#0083b0']}
                    style={styles.createCardContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Home');
                      }}
                      style={styles.rowItem}>
                      <FontAwesome
                        color={Colors.white}
                        name="list-ul"
                        size={responsiveHeight(4)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        speakTxt(item);
                      }}
                      style={styles.rowItem}>
                      <FontAwesome
                        color={Colors.white}
                        name="volume-up"
                        size={responsiveHeight(4)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        copyToClipboard(item);
                      }}
                      style={styles.rowItem}>
                      <FontAwesome
                        color={Colors.white}
                        name="clipboard"
                        size={responsiveHeight(4)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rowItem}
                      onPress={() => {
                        shareNews();
                      }}>
                      <FontAwesome
                        color={Colors.white}
                        name="share-square-o"
                        size={responsiveHeight(4)}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </ImageBackground>
              <View style={styles.newsSection}>
                <View>
                  <Text style={styles.newsTitle} numberOfLines={3}>
                    {item.title}
                  </Text>
                  <Text style={styles.newsDesc} numberOfLines={11}>
                    {item.description
                      ? item.description
                      : 'Description is not available.'}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('FullStory', {url: item?.url});
                    }}>
                    <Text style={styles.story}>View Full Story</Text>
                  </TouchableOpacity>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsDate}>{formattedDate}</Text>
                    <Text style={styles.newsAuthor}>{item.author}</Text>
                  </View>
                </View>
              </View>
            </ViewShot>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainView: {
    height: responsiveHeight(80),
    width: responsiveWidth(97),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    backgroundColor: 'red',
    padding: responsiveHeight(1),
    alignSelf: 'flex-end',
    margin: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
  },
  header: {
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    color: 'white',
  },
  socialView: {
    paddingHorizontal: responsiveHeight(1),
    flexDirection: 'row',
    width: 350,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'brown',
    alignSelf: 'center',
  },
  socialTxt: {
    paddingVertical: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.5),
    color: 'white',
  },
  socialInnerView: {
    flexDirection: 'column',
    width: 350 / 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  picView: {
    height: 350,
    width: 350,
    borderColor: '#ccc',
    alignSelf: 'center',
  },

  userNameBtn: {
    borderColor: '#ccc',
    marginTop: responsiveHeight(1),
  },
  img: {
    height: responsiveHeight(6),
    width: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    overflow: 'hidden',
  },
  linearBg: {
    height: responsiveHeight(8),
    alignItems: 'center',
    width: responsiveWidth(100),
    flexDirection: 'row',
    paddingLeft: responsiveWidth(10),
    paddingRight: responsiveWidth(5),
    justifyContent: 'space-between',
    // borderBottomLeftRadius: responsiveHeight(714),
  },
  box: {
    // position: 'absolute',
    // bottom: 0,
    // width: responsiveWidth(100),
    // height: responsiveHeight(100),
    // alignItems: 'center',
  },
  txt: {
    paddingVertical: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2.5),
    color: Colors.black,
  },
  createCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(85),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
    borderTopLeftRadius: responsiveHeight(3),
    borderTopRightRadius: responsiveHeight(3),
  },
  rowItem: {},
  newsSection: {
    backgroundColor: Colors.white,
    height: responsiveHeight(40),
    borderTopLeftRadius: responsiveHeight(4),
    borderTopRightRadius: responsiveHeight(4),
    paddingVertical: responsiveHeight(3),
    justifyContent: 'space-between',
    paddingBottom: responsiveHeight(2),
    width: responsiveWidth(100),
  },
  newsTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(90),
    paddingHorizontal: responsiveWidth(3),
    alignSelf: 'center',
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  newsDesc: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(90),
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
  tag: {
    height: responsiveHeight(7),
    width: responsiveWidth(14),
    borderRadius: responsiveHeight(4),
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1),
  },
  story: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(100),
    color: Colors.blue,
    textDecorationLine: 'underline',
  },
  bgShade: {
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    backgroundColor: 'rgba(0, 0, 0, .4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterMarkTxt: {
    color: Colors.white,
    fontSize: responsiveFontSize(1.4),
    paddingHorizontal: responsiveHeight(1),
    textAlign: 'right',
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    right: responsiveWidth(1),
    top: responsiveHeight(15),
    borderRadius: responsiveHeight(20),
  },
  authorTxt: {
    textAlign: 'right',
    fontSize: responsiveFontSize(1.7),
    width: responsiveWidth(80),
  },
  quoteView: {
    borderTopColor: Colors.white,
    borderTopWidth: responsiveWidth(0.3),
    borderBottomColor: Colors.white,
    borderBottomWidth: responsiveWidth(0.3),
    paddingVertical: responsiveHeight(3),
    color: Colors.liteGrey,
  },
});
