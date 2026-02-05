import React, {useMemo, useCallback, forwardRef, memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  (
    {
      index = 0,
      onClose,
      renderView,
      label,
      submitLabel = 'Submit',
      onSubmit,
      paddingHorizontal = 10,
      RenderFooter,
      forComments = false,
      containerStyle = {},
    },
    ref,
  ) => {
    const snapPoints = useMemo(
      () => ['20%', '30%', '40%', '50%', '70%', '95%'],
      [],
    );

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

    const BottomSheetContainer = !forComments ? BottomSheetScrollView : View;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={index}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleComponent={() => {
          return <></>;
        }}
        backgroundStyle={{backgroundColor: '#181620'}}
        onChange={handleSheetChanges}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={[{flex: 1}, containerStyle]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <BottomSheetContainer
            nestedScrollEnabled={true}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            onScrollEndDrag={() => Keyboard.dismiss()}
            style={{flex: 1}}>
            <View style={styles.container}>
              <View style={{alignItems: 'center', marginTop: 15}}>
                <View style={styles.line} />
              </View>
              {label && (
                <View style={styles.headerViewStyle}>
                  <Text style={styles.titleStyle}>{label}</Text>
                  {onSubmit && (
                    <Pressable onPress={onSubmit}>
                      <Text style={styles.submitButtonText}>{submitLabel}</Text>
                    </Pressable>
                  )}
                </View>
              )}
              <View
                style={[
                  styles.contentContainer,
                  {paddingHorizontal: paddingHorizontal},
                ]}>
                {renderView && renderView()}
              </View>
            </View>
          </BottomSheetContainer>
          {Boolean(RenderFooter) ? <RenderFooter /> : null}
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10000,
  },
  headerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: '#242323',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  titleStyle: {
    fontSize: fontSize.f14,
    color: Colors.white,
    paddingLeft: 12,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  indicator: {
    marginTop: 15,
    height: 4,
    width: 40,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 2,
  },
  submitButtonText: {
    fontSize: fontSize.f16,
    color: '#FE2C55',
    paddingRight: 10,
    fontFamily: fonts['Poppins-Medium'],
  },
  line: {
    height: 2,
    width: '10%',
    backgroundColor: Colors.white,
  },
});

export default memo(CustomBottomSheet);
