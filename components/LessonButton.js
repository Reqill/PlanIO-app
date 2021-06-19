import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';
import Ionicons from '@expo/vector-icons/Ionicons'

export default LessonButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Button onPress={() => { setModalVisible(true) }}
                buttonStyle={styles.buttonStyle}
                icon={<Ionicons name={"ios-home"} size={28} color={"black"} />}
            />
            <View style={styles.container}>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={modalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    style={styles.contentView}
                >
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>Hi 👋!</Text>
                        <Text>Hello from Overlay!</Text>
                    </View>
                </Modal>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonStyle: {
        height: 50,
        width: 50,
        backgroundColor: "#CCC4B8",
        borderRadius: 100,
        marginBottom: 20,
        borderColor: "#f5f0e7",
        borderWidth: 5,
    }
});