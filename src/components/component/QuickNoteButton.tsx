import React from 'react';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppView from '../common/AppView';

import { ActivityIndicator } from 'react-native';

type QuickNoteButtonProps = {
    label: string;
    isActive: boolean;
    onPress: () => void;
    fontStyle?: 'normal' | 'italic';
    loading?: boolean;
};

const QuickNoteButton: React.FC<QuickNoteButtonProps> = ({
    label,
    isActive,
    onPress,
    fontStyle = 'italic',
    loading = false,
}) => {
    return (
        <AppView>

 
        <AppButton
            onPress={onPress}
            borderWidth={1}
            borderColor={isActive ? ColorsGlobal.main : ColorsGlobal.borderColor}
            backgroundColor={isActive ? ColorsGlobal.main + '15' : 'transparent'}
            paddingVertical={4}
            paddingHorizontal={12}
            radius={99}
            justifyContent='center'
            disabled={loading}
        >
            {loading && isActive ? (
                <AppView row alignItems="center" gap={4}>
                     <ActivityIndicator size="small" color={ColorsGlobal.main} />
                     <AppText
                        fontStyle={fontStyle}
                        color={isActive ? ColorsGlobal.main : ColorsGlobal.textLight}
                        fontSize={14} lineHeight={24} textAlign='center' 
                    >
                        {label}
                    </AppText>
                </AppView>
            ) : (
                <AppText
                    fontStyle={fontStyle}
                    color={isActive ? ColorsGlobal.main : ColorsGlobal.textLight}
                    fontSize={14} lineHeight={24} textAlign='center' 

                >
                    {label}
                </AppText>
            )}
        </AppButton>
        </AppView>
    );
};

export default QuickNoteButton;
