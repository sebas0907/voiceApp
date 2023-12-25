import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Voice from '@react-native-voice/voice';
import Userinput from './input';
import Tts from 'react-native-tts';

const Voiceinput = () => {

    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingMode, setRecordingMode] = useState(false);
    const [languages, setLanguages] = useState(['en-US','es-es','de-de','fr-fr','it-it']);
    const [language, setLanguage] = useState("en-US");

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = stopRecording;
        Voice.onSpeechError = err => console.log('onSpeechError:',err);
        Voice.onSpeechResults = onSpeechResults;

        const androidPermissionChecking = async () => {
            if(Platform.OS === 'android'){
                const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                console.log("check permissions: ",hasPermission);
                const getService = await Voice.getSpeechRecognitionServices();
                console.log("check services: ", getService);
            };
            
        }
        androidPermissionChecking();

        return () => {
            Voice.destroy().then(Voice.removeAllListeners());
        }
        
    }, []);

    const onSpeechStart = e => console.log('Recording Started...:',e);
    //const onSpeechEnd = () => setIsRecording(false);
    //const onSpeechError = err => setError(err);
    const onSpeechResults = (e) => {
        setResult(e.value[0]);
        console.log(e);
        stopRecording();
        setRecordingMode(true)
    }

    const startRecording = async () => {
        setIsRecording(true);
        try {
            await Voice.start(language);
        } catch (err) {
          setError(err);
        }
    }

    const stopRecording = async () => {
        
        try {
            Voice.removeAllListeners();
            await Voice.stop();
            setIsRecording(false);
        } catch (err) {
            setError(err);
            
        }
    }

    const changeLanguage = () => {
        const langs = languages;
        const lang = langs.shift();
        langs.push(lang);
        setLanguage(lang);
        Tts.setDefaultLanguage(lang);
    }

    return (
        <Userinput 
        result={result} 
        setResult={setResult} 
        isRecording={isRecording} 
        setIsRecording={setIsRecording} 
        error={error}
        startRecording={startRecording}
        stopRecording={stopRecording}
        language={language}
        changeLanguage={changeLanguage}
        recordingMode={recordingMode}
        setRecordingMode={setRecordingMode} />
    );
};

export default Voiceinput;