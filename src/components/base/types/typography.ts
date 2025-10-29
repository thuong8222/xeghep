import { scale } from 'react-native-size-matters';
import { Platform, TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  baseSemiBold: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: scale(14),
    lineHeight: scale(20),
    letterSpacing: 0,
  },
  mediumSemiBold: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: scale(16),
    lineHeight: scale(24),
    letterSpacing: 0,
  },
  largeSemiBold: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: scale(16),
    lineHeight: scale(24),
    letterSpacing: 0,
  },

  smallRegular: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',

    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontSize: scale(12),
    lineHeight: scale(16),
    letterSpacing: 0,
  },
  mediumMedium: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',

    fontWeight: '500',
    fontSize: scale(16),
    letterSpacing: 0,
  },
  mediumRegular: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontSize: scale(16),
    lineHeight: scale(24),
    letterSpacing: 0,
  },
  mediumMediumCenter: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: '500',
    fontSize: scale(16),
    lineHeight: scale(24),
    letterSpacing: 0,
    textAlign: 'center',
  },
  baseRegular: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontStyle: 'normal',
    fontSize: scale(16),
    lineHeight: scale(20),
    letterSpacing: 0,
  },
  baseRegularSearch: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontSize: scale(14),
    lineHeight: scale(20),
    letterSpacing: 0,
  },
  smallSemiBold: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',

    fontWeight: '600',
    fontSize: scale(12),
    lineHeight: scale(16),
    letterSpacing: 0,
    textAlign: 'right',
  },
  smallSemiBoldMenu: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(16),
    letterSpacing: 0,
  },
};
