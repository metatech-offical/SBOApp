import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import {Colors} from '@constant/colors';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

const ActivityItemCard = ({
  title,
  date,
  icon,
  onPress,
}: {
  title: string;
  date: string;
  icon: any;
  onPress?: any;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.ticketItem}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketDate}>{date}</Text>
        <Text numberOfLines={2} style={styles.ticketTitle}>
          {title}
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={20}
        style={styles.arrowContainer}
        onPress={onPress}>
        <BackArrow
          width={18}
          height={18}
          color={Colors.white}
          opacity={0.5}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ActivityItemCard;

const styles = StyleSheet.create({
  ticketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    marginVertical: hp('0.5%'),
    backgroundColor: '#FFFFFF0F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF0F',
    marginHorizontal: wp('2%'),
  },
  iconContainer: {
    width: wp('12'),
    height: wp('12'),
    backgroundColor: '#C685FF1A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  ticketInfo: {
    flex: 1,
  },
  ticketDate: {
    color: '#999',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginBottom: 4,
  },
  ticketTitle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    width: wp('60%'),
  },
  arrowContainer: {
    padding: 8,
  },
});
