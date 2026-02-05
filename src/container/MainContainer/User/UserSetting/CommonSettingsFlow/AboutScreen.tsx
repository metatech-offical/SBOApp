import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {AboutScreenProps} from '@navigation/screens';
import {AboutData} from '@utils/data';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';

const AboutScreen = ({navigation}: AboutScreenProps) => {
  const renderItem = ({item}: any) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('AboutContentScreen', {data: item})}
        style={styles.pressViewStyle}>
        <Text style={styles.title}>{item?.label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader title="About" onBackPress={() => navigation.goBack()} />
        <View>
          <FlatList
            data={AboutData}
            renderItem={renderItem}
            keyExtractor={item => item.label}
          />
        </View>
      </View>
    </View>
  );
};

export default AboutScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
  pressViewStyle: {
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
});
