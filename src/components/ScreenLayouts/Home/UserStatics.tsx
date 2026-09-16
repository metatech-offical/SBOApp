import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {
  HomeChevronIcon,
  OrdersIcon,
  TicketIcon,
  VideoIcon,
} from '@assets/svg/HomeScreenIcon';
import {DUMMY_HOME_STATS} from '@utils/dummyHome';

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
  const stats = data?.data || {};
  const hasApiStats =
    (stats.totalWatchedVideos || 0) +
      (stats.totalOrders || 0) +
      (stats.tickets || 0) >
    0;
  const values = hasApiStats ? stats : DUMMY_HOME_STATS;

  const creatorStatics = [
    {
      title: 'Videos',
      value: values.totalWatchedVideos || 0,
      icon: <VideoIcon width={21} height={21} opacity={0.5} />,
    },
    {
      title: 'Total Orders',
      value: values.totalOrders || 0,
      icon: <OrdersIcon width={15} height={21} opacity={0.5} />,
    },
    {
      title: 'Tickets owned',
      value: values.tickets || 0,
      icon: <TicketIcon width={21} height={21} opacity={0.5} />,
    },
  ];

  if (!isCreator) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.staticsCardContainer}>
        {creatorStatics.map((item, index) => (
          <StaticsCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.creatorText}>Today's stats</Text>
        <HomeChevronIcon strokeOpacity={0.7} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.staticsCardContainer}>
        {creatorStatics.map((item, index) => (
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
    marginTop: 24,
  },
  creatorText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  staticsCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: 150,
    height: 79,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  staticsCardTitle: {
    fontSize: fontSize.f22,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    lineHeight: 28,
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
    gap: 8,
    paddingHorizontal: 16,
  },
});
