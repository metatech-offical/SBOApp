import {useState, useEffect} from 'react';
import {Keyboard, KeyboardEvent, Platform} from 'react-native';

// Hook to detect keyboard visibility
export const useKeyboardVisibility = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return isKeyboardVisible;
};

// Hook to get detailed keyboard information
export const useKeyboardInfo = () => {
  const [keyboardInfo, setKeyboardInfo] = useState({
    isVisible: false,
    height: 0,
    duration: 0,
    endCoordinates: {
      height: 0,
      width: 0,
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardInfo({
          isVisible: true,
          height: event.endCoordinates.height,
          duration: event.duration || 0,
          endCoordinates: {
            height: event.endCoordinates.height,
            width: event.endCoordinates.width,
          },
        });
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event: KeyboardEvent) => {
        setKeyboardInfo({
          isVisible: false,
          height: 0,
          duration: event.duration || 0,
          endCoordinates: {
            height: 0,
            width: 0,
          },
        });
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return keyboardInfo;
};

// Hook to get keyboard height for responsive layouts
export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return keyboardHeight;
};

// Function to dismiss keyboard
export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

// Function to check if keyboard is currently visible (synchronous)
export const isKeyboardCurrentlyVisible = (): boolean => {
  // Note: This is not always reliable, better to use the hooks above
  return false;
};

// Get default keyboard height for different platforms
export const getDefaultKeyboardHeight = (platform: 'ios' | 'android' = Platform.OS as 'ios' | 'android'): number => {
  const keyboardHeights = {
    ios: {
      portrait: 291,
      landscape: 162,
    },
    android: {
      portrait: 256,
      landscape: 256,
    },
  };
  
  return keyboardHeights[platform].portrait;
};

// Hook for keyboard-aware layout adjustments
export const useKeyboardAwareLayout = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible,
    // Helper functions for common layout adjustments
    getBottomPadding: () => isKeyboardVisible ? keyboardHeight : 0,
    getTopOffset: () => isKeyboardVisible ? -keyboardHeight * 0.3 : 0,
  };
};

// Hook for keyboard-aware scroll behavior
export const useKeyboardAwareScroll = () => {
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        setShouldScrollToTop(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setShouldScrollToTop(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return {
    shouldScrollToTop,
    keyboardHeight,
    scrollOffset: keyboardHeight * 0.5, // Adjust scroll offset as needed
  };
};

// Utility for keyboard-aware input focus
export const useKeyboardAwareInput = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsInputFocused(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsInputFocused(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return {
    isInputFocused,
    keyboardHeight,
    inputContainerStyle: {
      paddingBottom: isInputFocused ? keyboardHeight * 0.1 : 0,
    },
  };
};

// Constants for common keyboard configurations
export const KEYBOARD_CONFIG = {
  // Keyboard behavior for different platforms
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  
  // Vertical offset for keyboard avoiding view
  verticalOffset: Platform.OS === 'ios' ? 90 : 0,
  
  // Animation duration
  animationDuration: 250,
  
  // Common keyboard heights
  heights: {
    ios: {
      portrait: 291,
      landscape: 162,
    },
    android: {
      portrait: 256,
      landscape: 256,
    },
  },
} as const; 