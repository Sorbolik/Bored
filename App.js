
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, Button, StyleSheet, StatusBar, Modal, Pressable, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { getRequest } from './utils/ApiRequests';
import API from './utils/API';
import { SelectList } from 'react-native-dropdown-select-list'

const App = () => {
    const [activity, setActivity] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [initialHints, setInitialHints] = useState(10);
    const [hintsLeft, setHintsLeft] = useState(initialHints);
    const [activityCounter, setActivityCounter] = useState(0);

    useEffect(() => {
        if (activity) {
            setShowModal(true);
            setActivityCounter(activityCounter + 1);
        }
    }, [activity])

    useEffect(() => {
        setHintsLeft(initialHints - activityCounter);
        if (initialHints - activityCounter === -2) {
            setInitialHints(970);
        }
    }, [activityCounter])

    const data = [
        { key: '1', value: 'education' },
        { key: '2', value: 'recreational' },
        { key: '3', value: 'social' },
        { key: '4', value: 'diy' },
        { key: '5', value: 'charity' },
        { key: '6', value: 'cooking' },
        { key: '7', value: 'relaxation' },
        { key: '8', value: 'music' },
        { key: '9', value: 'busywork' },
    ]
    const getActivity = (params) => {
        getRequest(API.BORED_BASE + API.ACTIVITIES, params).then((resp) => {
            setActivity(resp.data.activity);
            console.log(activity);
        }).catch((error) => {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    const onModalViewLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setModalWidth(width);
    }

    const getModalButtonDynamicSheet = (modalWidth) => {
        return StyleSheet.create({
            modalButton: {
                borderRadius: 20,
                padding: 10,
                elevation: 2,
                width: modalWidth * 80 / 100
            }
        })
    }

    const content = () => {
        if (hintsLeft >= 0) {
            return (<><Text style={styles.paragraphNoPadding}>But pay close attention, you only have</Text>
                <Text style={styles.paragraphNoPaddingBIG}>{hintsLeft}</Text>
                <Text style={styles.paragraphNoPadding}>hints left, use them wisely.</Text ></>)
        } else if (hintsLeft === -1) {
            return (<Text style={styles.paragraphJoke}>I was Just kidding, who is the moron who would put the upper limit at {initialHints}?</Text>)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                transparent={false}
                visible={showModal}
                presentationStyle={"fullScreen"}
                onRequestClose={() => {
                    setShowModal(!showModal);
                }}>

                <TouchableWithoutFeedback onPress={() => {
                    console.log("overlay pressed");
                    setShowModal(!showModal)
                }}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.centeredView}>


                    <View onLayout={onModalViewLayout} style={styles.modalView}>
                        <Text style={styles.modalText}>{activity}</Text>
                        <Pressable
                            style={[getModalButtonDynamicSheet(modalWidth).modalButton, styles.buttonClose]}
                            onPress={() => setShowModal(!showModal)}>
                            <Text style={styles.textStyle}>DONE</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
            <Text style={styles.title}>Are you bored?</Text>
            <Text style={styles.subtitle}>Don't worry, boredom always precedes a period of great creativity.</Text>
            <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => getActivity()}>
                <Text style={styles.textStyle}>You can have a random activity</Text>
            </Pressable>
            <Text style={styles.paragraphOR}>OR</Text>
            <Text style={styles.paragraph}>you can choose the main topic and then you will get a random activity about it</Text>
            <SelectList
                boxStyles={styles.dropdown}
                dropdownStyles={styles.dropdown}
                search={false}
                placeholder="Choose the main topic"
                setSelected={(val) => getActivity({ type: val })}
                data={data}
                save="value"
            />

            {content()}



        </SafeAreaView >

    );
};

// React Native Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: StatusBar.currentHeight
    },
    title: {
        fontSize: 40,
        color: "#000",
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        paddingVertical: 15
    },
    paragraphOR: {
        fontSize: 100,
        color: "#000",
        textAlign: 'center',
        paddingVertical: 5
    },
    paragraph: {
        width: Dimensions.get('window').width * 90 / 100,
        fontSize: 15,
        color: "#000",
        textAlign: 'center',
        padding: 15
    },
    paragraphNoPadding: {
        width: Dimensions.get('window').width * 90 / 100,
        fontSize: 15,
        color: "#000",
        textAlign: 'center',
        // padding: 15
    },
    paragraphNoPaddingBIG: {
        width: Dimensions.get('window').width * 90 / 100,
        fontSize: 30,
        color: "#000",
        textAlign: 'center',
        // padding: 15
    },
    paragraphJoke: {
        width: Dimensions.get('window').width * 90 / 100,
        fontSize: 30,
        color: "#000",
        textAlign: 'center',
        padding: 15
    },
    dropdown: {
        width: Dimensions.get('window').width * 80 / 100,
        marginBottom: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: Dimensions.get('window').width * 80 / 100,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default App;