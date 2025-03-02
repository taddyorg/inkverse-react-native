import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, PanResponder, GestureResponderEvent, PanResponderGestureState, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ScrollIndicatorProps {
  scrollPosition: number;
  contentHeight: number;
  screenHeight: number;
  onScrollTo: (position: number) => void;
}

export function ScrollIndicator({ scrollPosition, contentHeight, screenHeight, onScrollTo }: ScrollIndicatorProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Use Animated values for smoother transitions
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedPosition = useRef(new Animated.Value(0)).current;
  
  const totalScrollable = Math.max(0, contentHeight - screenHeight);
  const containerHeight = screenHeight - 100; // Account for top/bottom margins
  
  // Update animated position directly when scrollPosition changes
  useEffect(() => {
    if (!isDragging) {
      // Calculate indicator position based on scroll percentage
      const scrollPercentage = totalScrollable > 0 ? scrollPosition / totalScrollable : 0;
      const newPosition = scrollPercentage * containerHeight;
      
      // Update animated value directly without animation when not dragging
      animatedPosition.setValue(newPosition);
    }
  }, [scrollPosition, isDragging, totalScrollable, containerHeight, animatedPosition]);
  
  // Animate scale when dragging starts/ends
  useEffect(() => {
    Animated.spring(animatedScale, {
      toValue: isDragging ? 1.2 : 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, [isDragging, animatedScale]);
  
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
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
      const newIndicatorPosition = touchPercentage * containerHeight;
      animatedPosition.setValue(newIndicatorPosition);
      
      // Update scroll position in parent
      requestAnimationFrame(() => {
        onScrollTo(newScrollPos);
      });
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
    onPanResponderTerminate: () => {
      setIsDragging(false);
    },
  }), [containerHeight, totalScrollable, onScrollTo, animatedPosition]);
  
  // Don't show scroll tip if content fits in screen
  if (contentHeight <= screenHeight) {
    return null;
  }
  
  return (
    <View style={styles.scrollIndicatorContainer}>
      <View style={styles.touchArea} {...panResponder.panHandlers}>
        <Animated.View 
          style={[
            styles.scrollTip,
            { 
              transform: [
                { translateY: animatedPosition },
                { scale: animatedScale }
              ] 
            },
            isDragging && styles.scrollTipActive
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTipActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  upIcon: {
    marginBottom: 4,
  },
  downIcon: {
    marginTop: -4,
  },
}); 