import {Colors} from '@constant/colors';
import {height} from '@constant/fontSize';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

type Props = {
  Ref: any;
  sheetHeight?: number;
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  persistent?: boolean; // keep 10% visible
  snapPoints?: number[]; // e.g. [0.1, 0.6, 1] → 10%, 60%, 100%
};

const NewBottomSheet: React.FC<Props> = ({
  Ref,
  children,
  onOpen,
  onClose,
  sheetHeight = height / 3,
  persistent = false,
  snapPoints,
}) => {
  const [currentHeight, setCurrentHeight] = useState(sheetHeight);

  // Default snap logic
  const minHeight = snapPoints ? snapPoints[0] * height : sheetHeight;
  const midHeight = snapPoints ? snapPoints[1] * height : undefined;
  const maxHeight = snapPoints ? snapPoints[2] * height : undefined;

  // Handle close → instead of closing fully, go to minHeight
  const handleClose = () => {
    if (persistent && minHeight) {
      setCurrentHeight(minHeight);
      Ref.current?.open();
    } else {
      onClose?.();
    }
  };

  // Expose function to expand to mid or max
  const expandTo = (level: 'mid' | 'max') => {
    if (level === 'mid' && midHeight) {
      setCurrentHeight(midHeight);
      Ref.current?.open();
    } else if (level === 'max' && maxHeight) {
      setCurrentHeight(maxHeight);
      Ref.current?.open();
    }
  };

  useEffect(() => {
    if (persistent && minHeight) {
      setCurrentHeight(minHeight); // start at 10%
    }
  }, [persistent]);

  return (
    <RBSheet
      ref={Ref}
      height={currentHeight}
      closeOnPressMask={!persistent}
      closeOnPressBack={!persistent}
      draggable
      onOpen={onOpen}
      onClose={handleClose}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
        draggableIcon: {
          backgroundColor: Colors.white,
        },
        container: {
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          overflow: 'visible',
          backgroundColor: '#181620',
        },
      }}>
      <View>{children}</View>
    </RBSheet>
  );
};

export default NewBottomSheet;
