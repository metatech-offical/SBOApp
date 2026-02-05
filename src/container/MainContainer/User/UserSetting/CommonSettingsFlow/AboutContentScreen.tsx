import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {AboutContentScreenProps} from '@navigation/screens';
import {
  useAboutPrivacyPolicyQuery,
  useAboutTermsOfServiceQuery,
} from '@rtkServices/SettingsService';
import {View, StyleSheet, Text, FlatList} from 'react-native';

const AboutContentScreen = ({navigation, route}: AboutContentScreenProps) => {
  const {data = {}} = route?.params || {};

  const {data: privacyData, isLoading: isPrivacyLoading} =
    useAboutPrivacyPolicyQuery();
  const {data: termsData, isLoading: isTermsLoading} =
    useAboutTermsOfServiceQuery();

  const content = data?.id == '1' ? privacyData?.data : termsData?.data;

  const renderItem = ({item}: {item: {title: string; content: string}}) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <Text style={styles.sectionContent}>{item.content}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No data found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title={data?.label}
          onBackPress={() => navigation.goBack()}
        />
        {isPrivacyLoading || isTermsLoading ? (
          <Loader visible={true} />
        ) : (
          <FlatList
            data={content?.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmptyComponent}
            ListHeaderComponent={() => (
              <View>
                <Text style={styles.title}>{content?.title ?? ''}</Text>
                <Text style={styles.lastUpdated}>
                  {content?.lastUpdated ? 'Last Updated:' : ''}{' '}
                  {content?.lastUpdated}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default AboutContentScreen;

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
  title: {
    marginBottom: 10,
    padding: 10,
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  lastUpdated: {
    fontSize: fontSize.f12,
    color: Colors.white,
    marginBottom: 20,
    padding: 10,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 10,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
  },
  sectionContent: {
    fontSize: fontSize.f14,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    textAlign: 'center',
  },
});
