import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Button } from '@rneui/base';
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInData, setLoggedInData] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const checkTokenInAsyncStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const tokenExpDate = await AsyncStorage.getItem('authTokenExpDate');

      if (isTokenValid(token, tokenExpDate)) {
        const queryParams = new URLSearchParams({
          auth_token: token as string
        });
        fetch(`TODO COMPLETE API/user?${queryParams}`)
          .then(response => {
            if (!response.ok) {
              return response.json().then(data => {
                throw new Error(data.authenticationError);
              });
            }
            return response.json();
          })
          .then(data => {
            setLoggedInData(data);
            setIsLoggedIn(true);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setIsLoggedIn(false);
            setError(error.message || 'Authentication Error');
          });
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking value in AsyncStorage:', error);
      setIsLoggedIn(false);
      setError('Authentication Error');
    }
  };

  useEffect(() => {
    checkTokenInAsyncStorage();
  }, [refresh]);

  // Use useFocusEffect to reload the page when coming back from 'register' screen
  useFocusEffect(
    React.useCallback(() => {
      // Run the effect to reload the page
      checkTokenInAsyncStorage();
    }, [])
  );

  return (
    <View>
      {isLoggedIn ? (
        <LoggedInContent
          loggedInData={loggedInData}
          setRefresh={setRefresh}
          refreshVal={refresh}
        />
      ) : (
        <LoggedOutContent error={error} />
      )}
    </View>
  );
}

function LoggedInContent({ loggedInData, setRefresh, refreshVal }: any) {
  const router = useRouter();
  return (
    <>
      <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>Ești logat ca {loggedInData.first_name} {loggedInData.last_name}.</Text>
      <Button onPress={() => logOut(setRefresh, refreshVal)}>Log out</Button>
      <Button onPress={() => router.push('changepass')}>Schimbă parola</Button>
    </>
  );
}

function LoggedOutContent({ error }: any) {
  const router = useRouter();
  return (
    <>
      <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>{error ? error : 'Momentan nu ești logat.'}</Text>
      <Button onPress={() => router.push('register')}>Register</Button>
      <Button onPress={() => router.push('login')}>Log In</Button>
    </>
  );
}

function isTokenValid(token: string | null, tokenExpDate: string | null) {
  return token != null && tokenExpDate != null && new Date(tokenExpDate).getTime() > new Date().getTime();
}

async function logOut(setRefresh: any, refreshVal: any) {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authTokenExpDate');
    console.log('Token removed from AsyncStorage');
    setRefresh(!refreshVal);
  } catch (error) {
    console.error('Error removing token from AsyncStorage:', error);
  }
}

export default Index;
