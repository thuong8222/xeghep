import React from "react";
import { ActivityIndicator } from "react-native";
import AppButton from "../common/AppButton";
import AppView from "../common/AppView";
import { ColorsGlobal } from "../base/Colors/ColorsGlobal";
import AppText from "../common/AppText";
import { scale } from "../../utils/Helper";

const Area = React.memo(({ data, loading, gotoDetailAreaPress }: any) => {
    const isJoinArea = data?.is_member;

    return (
        <AppButton
            onPress={() => {
                gotoDetailAreaPress();
            }}
            gap={8}
            paddingVertical={16}
            paddingLeft={12}
            flex={1}
            row
            opacity={isJoinArea ? 1 : 0.5}
            disabled={!isJoinArea || loading}
        >
            <AppView
                height={45}
                width={45}
                radius={9999}
                backgroundColor={ColorsGlobal.backgroundLight}
                alignItems="center"
                justifyContent="center"
                padding={4}
            >
                <AppText
                    fontSize={scale(18)}
                    lineHeight={scale(26)}
                    fontWeight={700}
                    textAlign="center"
                >
                    {data?.members_count > 99 ? '99+' : data?.members_count}
                </AppText>
            </AppView>

            <AppView flex={1}>
                <AppText
                    color={
                        data?.is_read
                            ? ColorsGlobal.textLight
                            : ColorsGlobal.main
                    }
                    fontSize={16}
                    fontWeight={700}
                >
                    {data?.name}
                </AppText>

                <AppText
                    color={
                        data?.is_read
                            ? ColorsGlobal.textLight
                            : ColorsGlobal.main
                    }
                    fontSize={12}
                >
                    {'Khu vực ' + data?.description}
                </AppText>
            </AppView>

            {loading && (
                <AppView paddingRight={12} justifyContent="center">
                    <ActivityIndicator color={ColorsGlobal.main} size="small" />
                </AppView>
            )}
        </AppButton>
    );
});
export default Area;