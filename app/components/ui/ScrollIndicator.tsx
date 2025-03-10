import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, PanResponder, GestureResponderEvent, PanResponderGestureState, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ScrollIndicatorProps {
  scrollPosition: number;
  contentHeight: number;
  screenHeight: number;
  headerHeight: number;
  footerHeight: number;
  onScrollTo: (position: number) => void;
}

export function ScrollIndicator({ scrollPosition, contentHeight, screenHeight, headerHeight, footerHeight, onScrollTo }: ScrollIndicatorProps) {
  // Use Animated values for smoother transitions
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedPosition = useRef(new Animated.Value(0)).current;
  
  const totalScrollable = Math.max(0, contentHeight - screenHeight);
  const containerHeight = screenHeight - headerHeight - footerHeight; // Account for top/bottom margins
  
  // Update animated position when scrollPosition changes (when not controlled by pan)
  useEffect(() => {
    // Calculate indicator position based on scroll percentage
    const scrollPercentage = totalScrollable > 0 ? scrollPosition / totalScrollable : 0;
    const newPosition = scrollPercentage * containerHeight;
    
    // Use setValue for immediate updates during scrolling instead of animation
    animatedPosition.setValue(newPosition);
    
  }, [scrollPosition, totalScrollable, containerHeight, animatedPosition]);
  
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Scale up when touch starts - use timing for more direct control
      Animated.timing(animatedScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true
      }).start();
    },
    onPanResponderMove: (evt: GestureResponderEvent, _: PanResponderGestureState) => {
      // Get the touch position relative to the container
      const touchY = evt.nativeEvent.pageY;
      
      // Calculate container bounds
      const containerTop = 50; // Same as in styles
      
      // Calculate the percentage of the touch within the container
      let touchPercentage = Math.max(0, Math.min(1, 
        (touchY - containerTop) / containerHeight
      ));
      
      // Convert to scroll position
      const newScrollPos = touchPercentage * totalScrollable;
      
      // Update animated position directly for immediate visual feedback
      // This provides the smoothest possible movement during dragging
      animatedPosition.setValue(touchPercentage * containerHeight);
      
      // Update scroll position in parent
      // Remove requestAnimationFrame for more immediate updates
      onScrollTo(newScrollPos);
    },
    onPanResponderRelease: () => {
      // Scale down when touch ends
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
    },
    onPanResponderTerminate: () => {
      // Scale down when touch is terminated
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
    },
  }), [containerHeight, totalScrollable, onScrollTo, animatedPosition, animatedScale]);
  
  // Don't show scroll tip if content fits in screen
  if (contentHeight <= screenHeight) {
    return null;
  }
  
  return (
    <View style={[styles.scrollIndicatorContainer]}>
      <View style={styles.touchArea} {...panResponder.panHandlers}>
        <Animated.View 
          style={[
            styles.scrollTip,
            { 
              transform: [
                { translateY: animatedPosition },
                { scale: animatedScale }
              ] 
            }
          ]}
        >
          <Feather 
            name="chevron-up" 
            size={14} 
            color="rgba(255, 255, 255, 0.7)" 
            style={styles.upIcon}
          />
          <Feather 
            name="chevron-down" 
            size={14} 
            color="rgba(255, 255, 255, 0.7)" 
            style={styles.downIcon}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollIndicatorContainer: {
    position: 'absolute',
    right: 8,
    top: 50,
    bottom: 50,
    width: 24,
    zIndex: 1000,
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -10, // Extend touch area to the left
    right: 0,
    width: 44, // Wider touch area
  },
  scrollTip: {
    position: 'absolute',
    right: 0,
    width: 24,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upIcon: {
    marginBottom: 4,
  },
  downIcon: {
    marginTop: -4,
  },
}); 