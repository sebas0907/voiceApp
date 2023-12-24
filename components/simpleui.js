import { View, Text, TouchableOpacity} from 'react-native';

const Simpleui = (props) => {
    return(
        <View style={{alignItems: 'center', margin: 20}}>
            <Text style={{fontSize: 20, color: 'green', fontWeight: '500'}}>
                Voice Input 
            </Text>
            <Text>{props.result}</Text>
            <Text>{props.error}</Text>
            <TouchableOpacity style={{marginTop: 30}} onPress={props.isRecording ? props.stopRecording : props.startRecording}>
                <Text style={{color: 'red'}}>{props.isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Simpleui;