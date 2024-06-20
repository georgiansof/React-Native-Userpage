import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Button, Text } from 'react-native'
import { CheckBox } from '@rneui/base'
import DatePicker from 'react-native-neat-date-picker'
import FormInput from './components/formInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface FormData {
    email: string,
    email_again: string,
    password: string,
    password_again: string,
    phone_number: string,
    first_name: string,
    last_name: string,
    address: string,
    cnp: string,
    birth_date: string,
    confirm_adult: boolean,
    emailmarketing: boolean,
    accept_terms: boolean
}

interface ErrorLabels {
    email: string,
    emailConfirm: string,
    password: string,
    passwordConfirm: string,
    phoneNumber?: string,
    lastName: string,
    firstName: string,
    CNP: string,
    address: string,
    birthdate: string,
    confirmAdult: string,
    terms: string
}

const errorLabelsCleared : ErrorLabels = {
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    lastName: '',
    firstName: '',
    CNP: '',
    address: '',
    birthdate: '',
    confirmAdult: '',
    terms: ''
}


const Register = () => {
    const router = useRouter();

    const [APIErr, setAPIErr] = useState('');

    const [showDatePicker, setshowDatePicker] = useState(false)

    const [eighteenChecked, setEighteenChecked] = useState(false);

    const [MarketingChecked, setMarketingChecked] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');

    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');

    const [CNP, setCNP] = useState('');

    const [address, setAdress] = useState('');

    const [birthdate, setBirthDate] = useState('');

    const [emailErr, setEmailErr] = useState('');
    const [emailConfirmErr, setEmailConfirmErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [passwordConfirmErr, setPasswordConfirmErr] = useState('');
    const [phoneNumberErr, setPhoneNumberErr] = useState('');
    const [lastNameErr, setLastNameErr] = useState('');
    const [firstNameErr, setFirstNameErr] = useState('');
    const [CNPErr, setCNPErr] = useState('');
    const [addressErr, setAddressErr] = useState('');
    const [birthdateErr, setBirthdateErr] = useState('');
    const [confirmAdultErr, setConfirmAdultErr] = useState('');
    const [termsErr, setTermsErr] = useState('');

    const openDatePicker = () => setshowDatePicker(true);
    const onCancel = () => setshowDatePicker(false);
    const onConfirm = (output: any) => {
        // Data aleasa, ascunde calendarul
        setshowDatePicker(false)
        setBirthDate(output.dateString)
    }

    const handleSubmitForm = async () => {
        let formData : FormData = 
        {
            email: email,
            email_again: emailConfirm,
            password: password,
            password_again: passwordConfirm,
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            address: address,
            cnp: CNP,
            birth_date: birthdate,
            confirm_adult: eighteenChecked,
            emailmarketing: MarketingChecked,
            accept_terms: termsChecked
        };

        let errSetters = {
                setEmail: setEmailErr,
                setEmailConfirm: setEmailConfirmErr,
                setPassword: setPasswordErr,
                setPasswordConfirm: setPasswordConfirmErr,
                setPhoneNumber: setPhoneNumberErr,
                setLastName: setLastNameErr,
                setFirstName: setFirstNameErr,
                setCNP: setCNPErr,
                setAddress: setAddressErr,
                setBirthdate: setBirthdateErr,
                setConfirmAdult: setConfirmAdultErr,
                setTerms: setTermsErr
        }

        Object.values(errSetters).forEach(setter => setter('')); /// reset ErrorLabels

        const verificationOK = formDataCheck(formData, errSetters); /// also shows error labels
        
        const transformDate = (dateString: string) => {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        };

        formData.birth_date = transformDate(formData.birth_date);

        console.log(formData.birth_date)
        
        if(verificationOK) {
            try {
                const response = await fetch('TODO COMPLETE: API/REGISTER', {
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
                    console.log('Token salvat, user inregistrat.');
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
    <ScrollView>
        <View style={styles.body}>
            <View style={styles.titleDiv}>
                <Text style={styles.title}>Înregistrează-te</Text>
                <Text style={styles.subtitle}>Creează-ți cont. Asigură-te că introduci informațiile corecte.</Text>
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
                    title="Confirmare adresă email"
                    placeholder="Reintrodu email"
                    value={emailConfirm}
                    valueSetter={setEmailConfirm}
                    errorMessage={emailConfirmErr}
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

                <FormInput 
                    title="Confirmă parola"
                    placeholder="Confirmă parola"
                    value={passwordConfirm}
                    valueSetter={setPasswordConfirm}
                    errorMessage={passwordConfirmErr}
                    isSecureTextEntry={true}
                    required={true}
                />

                <FormInput 
                    title="Telefon"
                    placeholder="Completează numărul de telefon" 
                    value={phoneNumber}
                    valueSetter={setPhoneNumber}
                    errorMessage={phoneNumberErr}
                    keyboardType='phone-pad'
                />

                <FormInput 
                    title="Nume"
                    placeholder="Completează numele"
                    value={lastName}
                    valueSetter={setLastName}
                    errorMessage={lastNameErr}
                    required={true}
                />

                <FormInput 
                    title="Prenume"
                    placeholder="Completează prenumele"
                    value={firstName}
                    valueSetter={setFirstName}
                    errorMessage={firstNameErr}
                    required={true}
                />

                <FormInput 
                    title="CNP"
                    placeholder="Completează CNP"
                    value={CNP}
                    valueSetter={setCNP}
                    errorMessage={lastNameErr}
                    keyboardType='numeric'
                    required={true}
                />

                <FormInput 
                    title="Adresă"
                    placeholder="Completează adresa"
                    value={address}
                    valueSetter={setAdress}
                    errorMessage={addressErr}
                    required={true}
                />

                <View style={{flex:1, flexDirection:'row'}}><Text>Data nașterii</Text><Text style={{color:'red', marginLeft: 2}}>*</Text></View>
                <Button title={'Alege data nasterii'} onPress={openDatePicker} />
                <DatePicker
                    isVisible={showDatePicker}
                    mode={'single'}
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                />
                <Text>{birthdate}</Text>
                <Text style={styles.error}>{birthdateErr}</Text>
            </View>
            <View style={styles.checkboxes}>
                <CheckBox
                    checked={eighteenChecked}
                    onPress={() => setEighteenChecked(!eighteenChecked)}
                    title="Declar pe propria răspundere că am 18 ani împliniți. *"
                />
                <Text style={styles.error}>{confirmAdultErr}</Text> 
                <CheckBox
                    checked={MarketingChecked}
                    onPress={() => setMarketingChecked(!MarketingChecked)}
                    title="Sunt de acord cu utilizarea datelor mele personale prin mijloacele de comunicare puse la dispoziție, pentru a primi buletine de informare despre ofertele generale legate de produse, campanii sau servicii relevante. Vezi politica de confidențialitate."
                />
                <CheckBox
                    checked={termsChecked}
                    onPress={() => setTermsChecked(!termsChecked)}
                    title='Sunt de acord cu termenii și condițiile. *'
                />
                <Text style={styles.error}>{termsErr}</Text>
            </View>
            <View style={styles.submitDiv}>
                <Button title='Creează contul' onPress={handleSubmitForm}/>
                <View>
                    <Text>Ai deja un cont?</Text>
                    <Text style={{fontWeight:'bold'}}>Intră în contul tău.</Text>
                </View>
            </View>
        </View>
    </ScrollView>
  )
}

export default Register;

export enum ErrorType {
    Empty,
    Invalid,
    TooShort,
    TooLong,
    MustContainNumber,
    ConfirmDiffers,
    InvalidDate, 
    UnderEighteen,
    NoError
}


function formDataCheck(formData: FormData, errSetters: any) : boolean {
    let isDataCorrect : boolean = true;

    /*****************    Verificare email  ****************************** */
    const emailVerification = verifyEmail(formData.email);

    if(emailVerification == ErrorType.Empty)
        errSetters.setEmail("Campul email este obligatoriu.");
    else
        if(emailVerification == ErrorType.Invalid)
            errSetters.setEmail("Email-ul introdus este invalid.");

    /*****************    Verificare confirmare email  ************************ */
    let emailConfirmVerification = verifyEmail(formData.email_again);
    if(emailConfirmVerification == ErrorType.Empty)
        errSetters.setEmailConfirm("Reintroducerea email-ului este obligatorie.");
    else
        if(emailConfirmVerification == ErrorType.Invalid)
            errSetters.setEmailConfirm("Email-ul introdus este invalid.");

    if(formData.email != formData.email_again) {
        errSetters.setEmailConfirm("Câmpurile de email nu sunt identice.");
        emailConfirmVerification = ErrorType.ConfirmDiffers;
    }

    /*****************    Verificare parola  ************************ */

    const passwordVerification = verifyPassword(formData.password);
    if(passwordVerification == ErrorType.Empty)
        errSetters.setPassword("Vă rugăm introduceți o parolă.");
    else
        if([ErrorType.TooShort, ErrorType.MustContainNumber].includes(passwordVerification))
            errSetters.setPassword("Parola trebuie să conțină cel puțin 6 caractere și minim o cifră.");
        else
            if(passwordVerification == ErrorType.TooLong)
                errSetters.setPassword("Parola introdusă este prea lungă (max. 64 caractere).");

    /******************** Verificare confirmare parola ***************************/

    let passwordConfirmVerification = verifyPassword(formData.password_again);
    if(passwordConfirmVerification == ErrorType.Empty)
        errSetters.setPasswordConfirm("Vă rugăm introduceți o parolă.");
    else
        if([ErrorType.TooShort, ErrorType.MustContainNumber].includes(passwordConfirmVerification))
            errSetters.setPasswordConfirm("Parola trebuie să conțină cel puțin 6 caractere și minim o cifră.");
        else 
            if(passwordConfirmVerification == ErrorType.TooLong)
                errSetters.setPasswordConfirm("Parola introdusă este prea lungă (max. 64 caractere).");

    if(formData.password != formData.password_again) {
        errSetters.setPasswordConfirm("Parola nu este identică în cele două câmpuri.");
        passwordConfirmVerification = ErrorType.ConfirmDiffers;
    }

    /******************** Verificare telefon  ************************** */

    // telefonul este camp optional si exemplul din API nu contine numarul de telefon
    // TBD
    const phoneVerification = ErrorType.NoError
    //const phoneVerification = verifyPhone(formData.phone_number);

    /********************* Verificare CNP ******************************** */
    const cnpVerification = verifyCNP(formData.cnp);
    if(cnpVerification == ErrorType.Empty)
        errSetters.setCNP("CNP-ul este obligatoriu.");
    else
        if(cnpVerification == ErrorType.Invalid)
            errSetters.setCNP("CNP-ul introdus este invalid.");

    /********************* Verificare data de nastere ****************************** */
    const birthDateVerification = verifyBirthDate(formData.birth_date, formData.cnp);
    if(birthDateVerification == ErrorType.Empty)
        errSetters.setBirthdate("Data de nastere este obligatorie.");
    else
        if(birthDateVerification == ErrorType.InvalidDate)
            errSetters.setBirthdate("Formatul datei de naștere este invalid.");
        else
            if(birthDateVerification == ErrorType.UnderEighteen)
                errSetters.setBirthdate("Vârsta minimă necesară este de 18 ani împliniți.");
            else
                if(birthDateVerification == ErrorType.ConfirmDiffers)
                    errSetters.setBirthdate("Data nașterii nu corespunde cu CNP-ul dat.");

    /********************* Verificare campuri nenule ************************* */
    if(formData.last_name == '')
        errSetters.setLastName("Numele este obligatoriu.");
    if(formData.first_name == '')
        errSetters.setFirstName("Prenumele este obligatoriu.");
    if(formData.address == '')
        errSetters.setAddress("Adresa este obligatorie.");

    if(formData.last_name == '' || formData.first_name == '' || formData.address == '')
        isDataCorrect = false;

    /********************** Verificare checkbox-uri *************************** */

    if(formData.accept_terms == false)
        errSetters.setTerms("Este necesară acceptarea termenilor și a condițiilor.");
    if(formData.confirm_adult == false)
        errSetters.setTerms("Confirmă dacă ai peste 18 ani.");

    if(formData.accept_terms == false || formData.confirm_adult == false)
        isDataCorrect = false;

    if(!AllEqualTo(ErrorType.NoError, [emailVerification, emailConfirmVerification, 
                                        passwordVerification, passwordConfirmVerification,
                                        phoneVerification,
                                        cnpVerification,
                                        birthDateVerification
                                        ]))
        isDataCorrect = false;

    return isDataCorrect;
}

export function verifyEmail(email: string) : ErrorType {
    // local-part@domain
    // local-part are cel mult 64 de bytes (ASCII Chars)
    // domain are cel mult 255 bytes

    if(email == '')
        return ErrorType.Empty;

    const first_rounded_a = email.indexOf('@');

    if(first_rounded_a == -1)
        return ErrorType.Invalid; /// nu contine @

    const local_part = email.slice(0,first_rounded_a);
    const domain_part = email.slice(first_rounded_a + 1, email.length);

    /// conform https://www.mailboxvalidator.com/resources/articles/acceptable-email-address-syntax-rfc/
    /// implementarea nu include adresele de e-mail fara domeniu (tip IPv4 / IPv6)

    if(local_part.length > 64)
        return ErrorType.Invalid;

    const allowed_special_chars = '!#$%&*+-/=?^_`.{|}~';
    /// Verificare caractere nepermise
    for(let chr of local_part)
        if(!isAlphanumeric(chr) && allowed_special_chars.indexOf(chr) == -1)
            return ErrorType.Invalid;
    
    /// Verificare punct la inceput sau sfarsit
    if(local_part[0] == '.' || local_part[local_part.length - 1] == '.')
        return ErrorType.Invalid;

    /// Verificare puncte consecutive
    for(let i=0; i<local_part.length-1; ++i)
        if(local_part[i] == '.' && local_part[i+1] == '.')
            return ErrorType.Invalid;


    if(domain_part.length > 255) /// detaliile la site-ul de mai sus
        return ErrorType.Invalid;

    const dns_labels = domain_part.split('.');

    for(let label of dns_labels) {
        if(label[0] == '-' || label[label.length - 1] == '-')
            return ErrorType.Invalid;

        if(label.length > 63 || !/^[a-zA-Z0-9-]+$/.test(label))
            return ErrorType.Invalid;
    }

    if(/^[0-9-]+$/.test(dns_labels[dns_labels.length])) /// top level domain full numeric, not ok.
        return ErrorType.Invalid;

    return ErrorType.NoError;
}

export function verifyPassword(password: string) : ErrorType {
    
    if(password == '')
        return ErrorType.Empty;
    
    if(password.length < 6)
        return ErrorType.TooShort;

    if(password.length > 64)
        return ErrorType.TooLong;

    if(! /\d/.test(password)) /// verificare daca contine cel putin o cifra
        return ErrorType.MustContainNumber;
    return ErrorType.NoError;
}

function verifyCNP(cnp: string) : ErrorType {
    if(cnp == '')
        return ErrorType.Empty;

    if(cnp.length != 13)
        return ErrorType.Invalid;

    const judet = parseInt(cnp.slice(7, 9));
    if(judet < 1 || judet > 52)
        return ErrorType.Invalid;

    /// Cifra de control
    const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
    
    let control = 0;
    for(let i=0; i<12; ++i)
        control += parseInt(cnp[i]) * weights[i]

    control %= 11;

    if(control != parseInt(cnp[12])) 
        return ErrorType.Invalid;

    return ErrorType.NoError;
}

function verifyBirthDate(date: string, cnp: string) : ErrorType {
    /// verifica daca corespunde cu cnp
    if(date == '')
        return ErrorType.Empty;
    
    try {
        var birthDate = new Date(date);
    }
    catch(except) {
        console.log(except);
        return ErrorType.InvalidDate;
    }

    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const birthMonth = birthDate.getMonth();
    const currentMonth = currentDate.getMonth();
    const birthDay = birthDate.getDate();
    const currentDay = currentDate.getDate();

    if (currentMonth < birthMonth || (currentMonth == birthMonth && currentDay < birthDay))
        age--;

    if(age < 18)
        return ErrorType.UnderEighteen;

    const birthYearTwoDigits = birthDate.getFullYear() % 100;
    const birthMonth1Indexed = birthMonth + 1;

    if(birthYearTwoDigits != parseInt(cnp.slice(1,3))
    || birthMonth1Indexed != parseInt(cnp.slice(3,5))
    || birthDay != parseInt(cnp.slice(5,7))) 
        return ErrorType.ConfirmDiffers;


    return ErrorType.NoError;
}

function AllEqualTo(value: any, list: Array<any>) : boolean {
    for(let elem of list) {
        console.log(elem);
        if(elem != value)
            return false;
    }
    return true;
}

function isAlphanumeric(char : string) {
    return /^[a-z0-9]$/i.test(char);
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
        flex: 1,
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    error: {
        color: 'red',
    },
});
