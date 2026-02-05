import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {CollectionDetailProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {useGetCollectionDetailQuery} from '@rtkServices/CreatorStoreService';
import FastImage from 'react-native-fast-image';
import {fontSize, height, width} from '@constant/fontSize';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import Loader from '@components/CustomLoader/Loader';
import CustomButton from '@components/CustomButtons/CustomButton';
import moment from 'moment';

const CollectionDetail = ({navigation, route}: CollectionDetailProps) => {
  const {collectionId} = route.params || {};
  const {data: collectionDetail, isLoading} =
    useGetCollectionDetailQuery(collectionId);

  const {name, description, coverImage, createdAt} =
    collectionDetail?.data || {};

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <StackHeader title={''} onBackPress={() => navigation.goBack()} />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <View style={styles.allContainerData}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {coverImage && (
                <FastImage source={{uri: coverImage}} style={styles.image}>
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(0,0,0,0.4)',
                      'rgba(0,0,0,0.9)',
                    ]}
                    style={styles.gradientOverlay}
                  />
                </FastImage>
              )}
              <Text style={styles.collectionName}>{name}</Text>
              <View style={styles.gridContainer}>
                <Text style={styles.gridItemText}>{'Created on'}</Text>
                <Text style={styles.gridItemValue}>{moment(createdAt).fromNow()}</Text>
              </View>
              <View style={styles.gridContainer}>
                <Text style={styles.descriptionTitle}>
                  {'Merchandise Details'}
                </Text>
                <Text numberOfLines={7} style={styles.descriptionText}>
                  {description}
                </Text>
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                text="Edit collection"
                onPress={() => {
                  navigation.navigate('CreateCollection', {
                    collectionId: collectionId,
                  });
                }}
                btnStyle={{width: '55%', backgroundColor:Colors.white}}
                textStyle={{color: Colors.black}}
                isLoading={isLoading}
              />
              <CustomButton
                text="Preview"
                onPress={() => {
                  navigation.navigate('CollectionPreview', {
                    collectionId: collectionId || '',
                    collectionName : name || ''
                  });
                }}
                btnStyle={{width: '40%'}}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default CollectionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  image: {
    width: width - 30,
    height: height / 4,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'center',
  },
  allContainerData: {
    paddingHorizontal: 15,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    justifyContent: 'flex-end',
  },
  collectionName: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginTop: 10,
    paddingVertical: 5,
  },
  gridContainer: {
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 5,
    minHeight: 87,
    marginTop: 10,
  },
  gridItemText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
  },
  gridItemValue: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: '#E9E9EE',
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#DEDEDE',
    marginTop: 10,
  },
  descriptionText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: 'lightgray',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 5,
  },
});
