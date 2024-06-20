import React from 'react';
import { View, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { TextInput } from 'react-native-paper';

interface FormInputProps {
  title: string,
  placeholder: string;
  value: string;
  valueSetter: (text: string) => void;
  errorMessage?: string;
  isSecureTextEntry?: boolean;
  keyboardType?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
            title,
            placeholder,
            value,
            valueSetter,
            errorMessage,
            isSecureTextEntry,
            keyboardType,
            required
        }) => {

  return (
    <View>
      <View style={{flexDirection: 'row'}}><Text>{title}</Text>{required ? <Text style={{color:'red', marginLeft: 2}}>*</Text> : null}</View>
      <TextInput
        mode = 'outlined'
        secureTextEntry={isSecureTextEntry}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => valueSetter(text)}
        keyboardType={keyboardType as KeyboardTypeOptions}
      />
      <Text style={styles.error}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    error: {
    color: 'red',
    },
});

export default FormInput;
