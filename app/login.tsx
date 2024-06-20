import React, { useState, useEffect } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import FormInput from './components/formInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ErrorType, verifyEmail} from './register'
import { useRouter } from 'expo-router';

const LogIn = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');

    const [password, setPassword] = useState('');
    const [passwordErr, setPasswordErr] = useState('');

    const [APIErr, setAPIErr] = useState('');

    const handleSubmitForm = async () => {
        let formData = 
        {
            email: email,
            password: password
        };

        let errSetters = {
                setEmail: setEmailErr,
                setPassword: setPasswordErr
        }

        Object.values(errSetters).forEach(setter => setter('')); /// reset ErrorLabels

        const verificationOK = formDataCheck(formData, errSetters); /// also shows error labels
        
        if(verificationOK) {
            try {
                const response = await fetch('TODO COMPLETE: API/AUTH', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if(response.ok) {
                    const authToken = data.auth_token;
                    const authTokenExpDate = data.auth_token_expiration_date;
                    await AsyncStorage.setItem('authToken', authToken);
                    await AsyncStorage.setItem('authTokenExpDate', authTokenExpDate);
                    console.log('Token salvat, user logat.');
                    setAPIErr('');
                    router.back();
                }
                else {
                    console.log('Inregistrarea a esuat: ', data);
                    setAPIErr(data.authenticationError);
                }
            }
            catch (error) {
                console.error('Eroare la inregistrare: ', error);
            }
        }
    }

    return (
        <View style={styles.body}>
            <View style={styles.titleDiv}>
                <Text style={styles.title}>Loghează-te</Text>
                <Text style={styles.subtitle}>Bine ai venit! Ne-am bucura să știm cine ești.</Text>
            </View>

            {APIErr != '' ? <Text style={{fontWeight:'bold', fontSize: 20, color: 'red'}}>APIErr</Text> : null}

            <View style={styles.form}>
                <FormInput 
                    title="Adresă email"
                    placeholder="Completează email"
                    value={email}
                    valueSetter={setEmail}
                    errorMessage={emailErr}
                    required={true}
                />

                <FormInput 
                    title="Parolă"
                    placeholder="Completează parola"
                    value={password}
                    valueSetter={setPassword}
                    errorMessage={passwordErr}
                    isSecureTextEntry={true}
                    required={true}
                />
            </View>
            <View style={styles.submitDiv}>
                <Button title='Intră în cont' onPress={handleSubmitForm}/>
                <View>
                    <Text>Nu ai un cont?</Text>
                    <Text style={{fontWeight:'bold'}}>Înregistrează-te.</Text>
                </View>
            </View>
        </View>
    );
}

function formDataCheck(formData:any, errSetters:any) {
    const emailVerification = verifyEmail(formData.email);

    if(emailVerification == ErrorType.Empty)
        errSetters.setEmail("Campul email este obligatoriu.");
    else
        if(emailVerification == ErrorType.Invalid)
            errSetters.setEmail("Email-ul introdus este invalid.");


    if(emailVerification != ErrorType.NoError)
        return false;
    return true;
}


const styles = StyleSheet.create({
    body: {
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 20
    },

    titleDiv: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 20
    },

    title: {
        fontWeight: 'bold',
        fontSize: 30
    },

    subtitle: {
        color: 'black',
        textAlign: 'center'
    },

    form: {
        marginLeft: 50,
        marginRight: 40
    },
    checkboxes: {
        marginLeft: 30,
        marginRight: 20
    },

    submitDiv: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    error: {
        color: 'red',
    },
});


export default LogIn;