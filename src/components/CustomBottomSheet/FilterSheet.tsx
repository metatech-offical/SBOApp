import React, {useMemo, useCallback, forwardRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Colors} from '@constant/colors';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {fontSize, hp} from '@constant/fontSize';
import LinearGradient from 'react-native-linear-gradient';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const FilterSheet = forwardRef<BottomSheet, FilterSheetProps>(
  (
    {
      index = -1,
      onClose = () => {},
      renderView,
      label,
      submitLabel = 'Submit',
      onSubmit,
      paddingHorizontal = 0,
      RenderFooter,
      forComments,
      useBottomSheetCustomFooter = false,
      containerStyle = {},
      footerStyle = {},
      backgroundStyle = {},
      headerViewStyle = {},
      customTitleStyle = {},
      cuttomSnapPoints,
    },
    ref,
  ) => {
    const styles = MakeStyle(Colors);

    // For top sheet we need to invert the percentages
    const snapPoints = useMemo(() => {
      const basePoints = cuttomSnapPoints || [
        '30%',
        '40%',
        '55%',
        '60%',
        '70%',
        '80%',
        '80%',
      ];
      // We don't need to invert for numeric values as they're handled within the wrapper
      return basePoints;
    }, [cuttomSnapPoints]);

    const handleSheetChanges = useCallback(
      (sheetIndex: number) => {
        if (sheetIndex === -1 && onClose) {
          onClose();
        }
      },
      [onClose],
    );

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={1}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    // Render the content of the top sheet
    const renderContent = () => (
      <View style={{flex: 1}}>
        <View style={[styles.container, containerStyle]}>
          {label && (
            <View
              style={[
                styles.headerViewStyle,
                backgroundStyle,
                headerViewStyle,
              ]}>
              <Text style={[styles.titleStyle, customTitleStyle]}>{label}</Text>
              <TouchableOpacity onPress={onClose}>
                <CrossIcon
                  width={hp('3%')}
                  height={hp('3%')}
                  fill={Colors.black}
                />
              </TouchableOpacity>
            </View>
          )}

          <BottomSheetScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            nestedScrollEnabled={true}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            onScrollEndDrag={() => Keyboard.dismiss()}>
            <LinearGradient
              style={[
                styles.contentContainer,
                {paddingHorizontal: paddingHorizontal},
                backgroundStyle,
              ]}
              colors={['#152D28', '#251748']}
              start={{x: 0, y: 0.05}}
              end={{x: 0, y: 1}}>
              {renderView && renderView()}
            </LinearGradient>
            <View
              style={{
                height: 8,
                backgroundColor: '#FFFFFF2E',
                width: '15%',
                alignSelf: 'center',
                borderRadius: 10,
                marginVertical: hp('4%'),
                marginBottom: hp('2%'),
              }}
            />
          </BottomSheetScrollView>
        </View>
      </View>
    );

    const content = useMemo(
      () => renderContent(),
      [
        renderView,
        label,
        RenderFooter,
        paddingHorizontal,
        containerStyle,
        footerStyle,
      ],
    );

    // The main container is rotated 180 degrees, positioning the bottom sheet at the top
    // And then all the child elements are rotated 180 degrees again to appear correctly
    return (
      <View
        style={{
          height: SCREEN_HEIGHT,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          transform: [{rotate: '180deg'}],
        }}>
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          index={index}
          enableHandlePanningGesture={false}
          onClose={onClose}
          backdropComponent={renderBackdrop}
          handleComponent={() => <></>}
          backgroundStyle={{backgroundColor: Colors.inputBackground}}
          style={{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            zIndex: 999,
            elevation: 10,
          }}
          onChange={handleSheetChanges}>
          <View style={{flex: 1, transform: [{rotate: '180deg'}]}}>
            {content}
          </View>
        </BottomSheet>
        {Boolean(RenderFooter) && RenderFooter && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[
              styles.footerContainer,
              footerStyle,
              {transform: [{rotate: '180deg'}]},
            ]}>
            <View style={{transform: [{rotate: '180deg'}]}}>
              {RenderFooter()}
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  },
);

const MakeStyle = (colors: typeof Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#251748',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      zIndex: 999,
      elevation: 10,
    },
    headerViewStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.grey,
      width: '100%',
      paddingHorizontal: 10,
      paddingVertical: 14,
      backgroundColor: '#251748',
    },
    titleStyle: {
      fontSize: fontSize.f16,
      color: colors.black,
      paddingLeft: 12,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },

    TransperentView: {
      width: '100%',
      height: 50,
      backgroundColor: 'transparent',
    },
    footerContainer: {
      backgroundColor: '#251748',
      borderBottomWidth: 1,
      borderBottomColor: colors.grey,
      paddingHorizontal: 10,
      position: 'absolute',
      bottom: 0, // Keep at bottom but it will be inverted
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
    },
  });

export default FilterSheet;
