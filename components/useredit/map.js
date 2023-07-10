import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import MapView from 'react-native-maps';
import {connect} from 'react-redux'


const Map = ({currentUser, getAddressFromCoordinates, regionName}) => {

    return(
        <View style={styles.container}>
            <MapView style={styles.container} 
                    initialRegion={{
                    latitude: parseFloat(currentUser.location.latitude), 
                    longitude: parseFloat(currentUser.location.longitude), 
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.05}} onRegionChange={reg => getAddressFromCoordinates(reg.latitude, reg.longitude)}
            >
                <View>
                <View style={styles.arrow}></View>
                <View style={styles.location}>
                    <Text style={{textAlign: 'center',fontSize:24}}>{regionName}</Text>
                </View>
                </View>
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'yellow'
    },
    location:{
        height: 'auto',
        backgroundColor: 'royalblue',
        padding: 15,
        width: 'auto',
        position: 'relative',
        top: 240,
        alignSelf: 'center',
        borderRadius: 10
        // left: 120
        
       

    },
    arrow: {
        position: 'relative',
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 20,
        top: 240,

        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "royalblue",
        alignSelf: 'center',

    }
})
const mapStateToProps = state => ({currentUser: state.currentUser})
export default connect(mapStateToProps)(Map)