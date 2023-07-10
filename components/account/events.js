import React from 'react'
import {Text,View,StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import { connect } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'; 
import dateFormat from 'dateformat'

const Events = ({gigs, toEventsMap, account}) => {
    getDate = date => {
        return dateFormat(date, "fullDate")
    }
    return(
        <View style={styles.container}>
            {gigs.length ?
            <TouchableOpacity style={{position: 'absolute', right: 10, zIndex: 10}} onPress={() => toEventsMap(account)}>
                <MaterialIcons name="zoom-out-map" size={38} color="#9370DB" />           
            </TouchableOpacity>
            :
            null
            }
            {gigs.length ?
            <ScrollView>
                {gigs.map((event, index) => (
                    <View key={index} style={styles.event}>
                        <Text style={{fontSize: 24, fontWeight: '300', paddingBottom:5, color: 'white'}}>{event.description}</Text>
                        <Text style={{fontSize: 20, fontWeight: '300', paddingBottom:5, color: 'white'}}>{event.address}</Text>
                            <Text style={{fontSize: 20, fontWeight: '300', paddingBottom:5, color: 'white'}}>{getDate(event.event_date)} @ {event.event_time}</Text>
                    
                    </View>
                    
                ))}
            </ScrollView>
            :
        <Text style={{fontSize: 24, textAlign: 'center', marginTop: 25, fontWeight: '300', color: 'white'}}>user has no events.</Text>
        }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    event: {
        height: 'auto',
        backgroundColor: '#2e2e2e',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#9370DB'
    },

})
export default Events