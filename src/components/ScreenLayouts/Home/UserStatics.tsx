import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {useHomeStatisticsQuery} from '@rtkServices/HomeService';
import {OrdersIcon, TicketIcon, VideoIcon} from '@assets/svg/HomeScreenIcon';

const StaticsCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <View style={styles.staticsCard}>
      <Text style={styles.staticsCardTitle}>{value}</Text>
      <View style={styles.staticsCardSubTitleContainer}>
        {icon}
        <Text style={styles.staticsCardSubTitle}>{title}</Text>
      </View>
    </View>
  );
};

const UserStatics = ({isCreator, data}: {isCreator: boolean; data: any}) => {
  const staticsData = [
    {
      title: 'Watched Videos',
      value: data?.data?.totalWatchedVideos || 0,
      icon: <VideoIcon opacity={0.5} />,
    },
    {
      title: 'Total Orders',
      value: data?.data?.totalOrders || 0,
      icon: <OrdersIcon opacity={0.5} />,
    },
    {
      title: 'Tickets owned',
      value: data?.data?.tickets || 0,
      icon: <TicketIcon opacity={0.5} />,
    },
  ];
  return (
    <View style={styles.container}>
      {isCreator ? (
        <View style={styles.headerContainer}>
          <Text style={styles.creatorText}>Today's stats</Text>
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.staticsCardContainer}>
        {staticsData.map((item, index) => (
          <StaticsCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default UserStatics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  creatorText: {
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2'),
  },
  staticsCard: {
    backgroundColor: '#FFFFFF0F',
    padding: wp('4'),
    width: wp('40'),
    // height: hp('9'),
    borderRadius: 10,
  },
  staticsCardTitle: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  staticsCardSubTitle: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.5,
  },
  staticsCardSubTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,
  },
  staticsCardContainer: {
    gap: 10,
    paddingHorizontal: 15,
    height: hp('10'),
  },
});
