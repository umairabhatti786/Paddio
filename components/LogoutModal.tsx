import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import sizeHelper, { screenWidth } from '@/constants/Helpers';
import { images } from '@/constants/Images';
import CustomText from "@/components/Text";
import { fonts } from '@/constants/Fonts';
import { theme } from '@/constants/Theme';
import { appStyles } from '@/constants/GlobalStyles';
import CustomButton from "@/components/Button";


const LogoutModal = ({
  modalVisible,
  setModalVisible,
  onCancel,
  onLogoutUser,
}: any) => {
  return (
    <Modal
      isVisible={modalVisible}
      deviceWidth={screenWidth}
      onBackButtonPress={() => setModalVisible?.(false)}
      onBackdropPress={() => setModalVisible?.(false)}
      backdropColor="rgba(0,0,0,0.5)"
      style={{flex: 1}}>
      <View style={styles.Container}>
        <Image
          style={{width: sizeHelper.calWp(100), height: sizeHelper.calWp(100)}}
          source={images.power_off}
        />
        <View
          style={{
            gap: sizeHelper.calHp(20),
            alignItems: 'center',
            paddingVertical: sizeHelper.calHp(20),
          }}>
          <CustomText
            text={'Alert'}
            fontFam={fonts.InterSemiBold}
            fontWeight="600"
            size={30}
          />
          <CustomText
            style={{textAlign: 'center', marginHorizontal: '10%'}}
            text={'Are you sure you want to logout?'}
            // color={theme.colors.text_black}
            size={25}
          />
        </View>
        <View style={{...appStyles.rowjustify, width: '100%'}}>
          <CustomButton
            height={60}
            bgColor={theme.colors.gray_btn}
            textColor={theme.colors.black}
            width={'45%'}
            text={'Cancel'}
            onPress={onCancel}
          />
          <CustomButton
            width={'45%'}
            height={60}
            bgColor={theme.colors.primary}
            textColor={theme.colors.white}
            text={'Logout!'}
            onPress={onLogoutUser}
          />
        </View>
      </View>
    </Modal>
  );
};
export default LogoutModal;
const styles = StyleSheet.create({
  Container: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: sizeHelper.calWp(40),
    paddingHorizontal: sizeHelper.calWp(30),
    paddingVertical: sizeHelper.calHp(20),
    gap: sizeHelper.calHp(20),
  },
});
