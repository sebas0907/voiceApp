import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import Tts from 'react-native-tts';
import {BASE_URL, OPENAI_API_KEY} from '@env';

const Userinput = (props) => {

    const [messages, setMessages] = useState([]);

    const URL = BASE_URL;
    const token = 'Bearer '+OPENAI_API_KEY;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token
    };

    const data = {
      "model": "gpt-4-1106-preview",//"gpt-3.5-turbo",
      "messages": [{"role": "user", "content": `${props.result}`}],
      "temperature": 1.0 // 0.7 works just well
    };

    const query = {
      "inputs": `${props.result}`,
    }
  
    const sendMessage = () => {
      if (props.result) {
        setMessages([...messages, {text: props.result, sender: 'user'}]);
        
        props.setResult('');
        
        axios.post(URL, data , {headers: headers}).then((response) => {
              const res = response.data.choices[0].message.content;
              setMessages([...messages, {text: props.result, sender: 'user'}, {text: res, sender: 'chatgpt'}]); 
              voiceHandler(res);
            }).catch((err)=>{
              console.log(err);
              Alert.alert("Error!",err, [{text:"OK"}]);
            }); 
          };
    };

    const deleteMessage = () => {
      setMessages([]);
      props.setResult('');
      Tts.stop()
    };

    //this just for debbuging purposes!
    useEffect(() => {
      console.log(messages);
    },[messages]);

    useEffect(() => {
      Tts.setDefaultRate(0.6);
      
      if (props.recordingMode){
        sendMessage();
        props.setRecordingMode(false);
      } 
      
    });

    const voiceHandler = (mes) => {
      
      Tts.getInitStatus().then(()=>{        
        Tts.speak(mes);
      },(err)=>{
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      })
    }
 
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          <View style={styles.languageContainer} >
            <TouchableOpacity style={styles.languageButton} onPress={props.changeLanguage} >
            <Text style={{'color':'white'}}>{props.language}</Text>
            </TouchableOpacity>
          </View>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                {
                  alignSelf:
                    message.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    message.sender === 'user' ? '#BB2525' : '#141E46',
                },
              ]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="your message..."
            value={props.result}
            onChangeText={text => props.setResult(text)}
          />
          <TouchableOpacity
            onPress={props.isRecording ? props.stopRecording : props.startRecording}
            style={styles.voiceButton}>
            {props.isRecording ? (
              <Text style={styles.voiceButtonText}>•••</Text>
            ) : (
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/4980/4980251.png',
                }}
                style={{width: 45, height: 45}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteMessage} style={styles.cancelButton}>
            <Text style={styles.sendButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#202020',//#FFF5E0
    },
    messagesContainer: {
      padding: 10,
    },
    messageBubble: {
      maxWidth: '70%',
      marginVertical: 5,
      borderRadius: 10,
      padding: 10,
    },
    messageText: {
      color: 'white',
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#202020',//#ccc
      backgroundColor: '#202020',//white
    },
    languageContainer: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#202020',//#FFF5E0
    },
    input: {
      flex: 1,
      fontSize: 16,
      padding: 10,
      borderRadius: 20,
      color: "white", //black
      backgroundColor: '#808080',//#EFEFEF
    },
    voiceButton: {
      marginLeft: 10,
      fontSize: 24,
    },
    voiceButtonText: {
      fontSize: 24,
      height: 45,
    },
    sendButton: {
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: 'green',
      borderRadius: 20,
    },
    sendButtonText: {
      color: 'white',
      fontSize: 16,
    },
    cancelButton: {
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#FF6969',
      borderRadius: 20,
    },
    languageButton: {
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: 'violet',
      borderRadius: 20,
    },     
  });
  
  export default Userinput;