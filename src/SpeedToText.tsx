import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import Voice, {
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
const SpeedToText = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const speechStartHandler = (e: SpeechStartEvent) => {
    console.log('speechStart successful', e);
  };

  const speechEndHandler = (e: SpeechEndEvent) => {
    setLoading(false);
    console.log('stop handler', e);
  };

  const speechResultsHandler = (e: SpeechResultsEvent) => {
    if (e.value) {
      const text = e.value[0];
      setResult(text);
    } else {
      console.log('empty result');
    }
  };

  const startRecording = async () => {
    setLoading(true);
    try {
      await Voice.start('en-Us');
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const clear = () => {
    setResult('');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>Voice to Text Recognition</Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            multiline={true}
            placeholder="say something!"
            editable={false}
            style={{
              flex: 1,
              height: '100%',
            }}
            onChangeText={text => setResult(text)}
          />
        </View>
        <View style={styles.btnContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <TouchableOpacity onPress={startRecording} style={styles.speak}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Speak</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => stopRecording()} style={styles.stop}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Stop</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={clear} style={styles.clear}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Clear</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default SpeedToText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26,
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 300,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  speak: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  stop: {
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  clear: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    with: '50%',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
});
