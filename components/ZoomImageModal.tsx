import {
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { windowHeight, windowWidth } from '@/constants/Commons';
import sizeHelper from '@/constants/Helpers';
const ZoomImageModal = ({
    modalVisible,
    setModalVisible,
    onPress,
    icon,
    title,
    des,
    buttonTitle,
    book_img,
    onBackdropPress
}: any) => {

    return (
        <Modal
            isVisible={modalVisible}
            deviceWidth={windowWidth}
            deviceHeight={windowHeight}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            onBackButtonPress={() => setModalVisible?.(false)}
            onBackdropPress={() => {
                onBackdropPress?.()
                setModalVisible?.(false)
            }}
            style={{ margin: 0 }} // Make modal full screen

            backdropColor="rgba(0,0,0,0.3)"
        >
            <Pressable
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Image
                    style={{ width: windowWidth / 1.2, height: windowHeight / 2.5, borderRadius: sizeHelper.calWp(20) }}
                    source={{ uri: book_img }}
                    resizeMode="contain"
                // resizeMethod={"auto"}
                // resizeMethod=""
                />


                <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: `rgba(0, 0, 0, 0.4)`, // Apply opacity to the background color
                        opacity: 0.5,
                    }}
                />
            </Pressable>

        </Modal>
    );
};

export default ZoomImageModal;


