import {View, StyleSheet, FlatList} from 'react-native';
import {BookingHistoryProps} from '@navigation/screens';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import NodataFound from '@components/DataEmpty/NodataFound';
import BookingHistoryCard from '@components/ScreenLayouts/SettingsComponent/BookingHistoryCard';
import {DUMMY_BOOKING_HISTORY} from '@utils/dummyTicketing';

const BookingHistory = ({navigation}: BookingHistoryProps) => {
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Booking History"
          onBackPress={() => navigation.goBack()}
        />
        <FlatList
          data={DUMMY_BOOKING_HISTORY}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={<NodataFound />}
          keyExtractor={item => item.date}
          renderItem={({item}) => (
            <BookingHistoryCard date={item.date} cards={item.cards} />
          )}
        />
      </View>
    </View>
  );
};

export default BookingHistory;

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
});
