import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';

interface SubtotalCardProps {
  containerStyle?: StyleProp<ViewStyle> | undefined;
  amountTextStyle?: StyleProp<TextStyle> | undefined;
  currency?: string;
  title?: string;
  tickets?: number;
  amount?: number;
  isShowNumTicket?: boolean;
}

const SubtotalCard = ({
  currency = '',
  title = 'Subtotal',
  tickets = 0,
  amount = 0,
  isShowNumTicket = true,
  containerStyle,
  amountTextStyle,
}: SubtotalCardProps) => {
  return (
    <View
      style={{
        ...styles.container,
        ...(typeof containerStyle == 'object' && containerStyle),
      }}>
      <View style={styles.leftSection}>
        <View style={styles.ticketManageImgContainer}>
          <Image
            source={require('@assets/images/TicketManage.png')}
            style={styles.ticketManageImg}
          />
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={styles.title}>{title}</Text>
          {isShowNumTicket && (
            <Text style={styles.subText}>
              {tickets} ticket{tickets > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={{
            ...styles.amount,
            ...(typeof amountTextStyle == 'object' && amountTextStyle),
          }}>
          {currency}
          {amount}
        </Text>
        <Text style={styles.subTextRight}>incl Tax</Text>
      </View>
    </View>
  );
};

export default SubtotalCard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  title: {
    color: '#CAC9CE',
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Medium'],
  },
  amount: {
    color: '#CAC9CE',
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Medium'],
  },
  subText: {
    color: '#CAC9CE50',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 2,
  },
  subTextRight: {
    color: '#CAC9CE50',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginTop: 4,
  },
  ticketManageImg: {
    height: 20,
    width: 20,
  },
  ticketManageImgContainer: {
    height: 34,
    width: 34,
    borderRadius: 34,
    backgroundColor: '#FFFFFF10',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
