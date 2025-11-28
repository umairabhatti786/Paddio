import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder-expo";
import { appStyles } from "./GlobalStyles";
import sizeHelper from "./Helpers";

export const LayoutsServices = {
  ProfileLayout: () => {
    return (
      <SkeletonPlaceholder
        backgroundColor="#E1E9EE"
        highlightColor="#F2F8FC"
      >
        {/* Profile Image */}
        <View
          style={{
            borderRadius: 999,
            alignSelf: "center",
            width: sizeHelper.calWp(170),
            height: sizeHelper.calWp(170),
            borderWidth: sizeHelper.calWp(8),
            marginTop:sizeHelper.calHp(30)
          }}
        />

        {/* Name and Info */}
        <View style={{ gap: sizeHelper.calHp(20), alignItems: "center",marginTop:sizeHelper.calHp(20) }}>
          <View
            style={{
              width: sizeHelper.calWp(300),
              height: sizeHelper.calHp(17),
                borderRadius: sizeHelper.calWp(10),
            }}
          />
          <View
            style={{
              width: sizeHelper.calWp(240),
              height: sizeHelper.calHp(17),
              borderRadius: sizeHelper.calWp(10),
            }}
          />
          <View style={[appStyles.row, { gap: sizeHelper.calWp(30) }]}>
            <View
              style={{
                width: sizeHelper.calWp(150),
                height: sizeHelper.calHp(17),
                borderRadius: sizeHelper.calWp(10),
              }}
            />
            <View
              style={{
                width: sizeHelper.calWp(150),
                height: sizeHelper.calHp(17),
                borderRadius: sizeHelper.calWp(10),
              }}
            />
          </View>
        </View>

        {/* Cards List */}
        <View
          style={{
            gap: sizeHelper.calHp(30),
            marginTop: sizeHelper.calHp(30),
            marginHorizontal:sizeHelper.calWp(30)
            
          }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.card} />
          ))}
        </View>
      </SkeletonPlaceholder>
    );
  },


  EventsLayout: () => {
    return (
      <SkeletonPlaceholder
        backgroundColor="#E1E9EE"
        highlightColor="#F2F8FC"
      >
      

      <View
          style={{
            gap: sizeHelper.calHp(30),
            
          }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={{...styles.card,
              height: sizeHelper.calHp(240), // realistic height

            }} />
          ))}
        </View>
       
      </SkeletonPlaceholder>
    );
  },
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: sizeHelper.calHp(350), // realistic height
    borderRadius: sizeHelper.calWp(15),
  },
});
