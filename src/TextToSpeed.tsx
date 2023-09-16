import {
  FlatList,
  Keyboard,
  LogBox,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import Slider from '@react-native-community/slider';
import Tts from 'react-native-tts';

interface VoiceState {
  id: string;
  name: string;
  language: string;
}
const TextToSpeed = () => {
  const [voices, setVoices] = useState<VoiceState[]>([]);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  // const [speechRate, setSpeechRate] = useState(0.5);
  // const [speechPitch, setSpeechPitch] = useState(1);
  const [text, setText] = useState('Xin chào Việt Nam');
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  useEffect(() => {
    Tts.addEventListener('tts-start', _event => setTtsStatus('started'));
    Tts.addEventListener('tts-finish', _event => setTtsStatus('finished'));
    Tts.addEventListener('tts-cancel', _event => setTtsStatus('cancelled'));
    // Tts.setDefaultRate(speechRate);
    // Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    return () => {
      // Tts.removeEventListener('tts-start', _event => setTtsStatus('started'));
      // Tts.removeEventListener('tts-finish', _event => setTtsStatus('finished'));
      // Tts.removeEventListener('tts-cancel', _event =>
      //   setTtsStatus('cancelled'),
      // );
    };
  }, []);

  const initTts = async () => {
    const voices = await Tts.voices();
    const availableVoices = voices
      .filter(
        v =>
          !v.networkConnectionRequired &&
          !v.notInstalled &&
          v.language === 'vi-VN',
      )
      .map(v => {
        return {id: v.id, name: v.name, language: v.language};
      });
    let selectedVoice = null;
    if (voices && voices.length > 0) {
      selectedVoice = voices[0].id;
      try {
        await Tts.setDefaultLanguage(voices[0].language);
      } catch (err) {
        //Samsung S9 has always this error:
        //"Language is not supported"
        console.log('setDefaultLanguage error ', err);
      }
      await Tts.setDefaultVoice(voices[0].id);
      setVoices(availableVoices);
      setSelectedVoice(selectedVoice);
      setTtsStatus('initialized');
    } else {
      setTtsStatus('initialized');
    }
  };

  //toc do noi
  // const updateSpeechRate = async (rate: number) => {
  //   await Tts.setDefaultRate(rate);
  //   setSpeechRate(rate);
  // };

  // tram bỗng
  // const updateSpeechPitch = async (rate: number) => {
  //   await Tts.setDefaultPitch(rate);
  //   setSpeechPitch(rate);
  // };

  const readText = async () => {
    Tts.stop();
    Tts.speak(text);
  };

  const onVoicePress = async (voice: VoiceState) => {
    try {
      await Tts.setDefaultLanguage(voice.language);
    } catch (err) {
      // Samsung S9 has always this error:
      // "Language is not supported"
      console.log('setDefaultLanguage error ', err);
    }
    await Tts.setDefaultVoice(voice.id);
    setSelectedVoice(voice.id);
  };

  const renderVoiceItem: ListRenderItem<VoiceState> = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          height: 50,
          backgroundColor: selectedVoice === item.id ? '#DDA0DD' : '#5F9EA0',
        }}
        onPress={() => onVoicePress(item)}>
        <Text style={styles.buttonTextStyle}>
          {`${item.language} - ${item.name || item.id}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Text to Speech Conversion with Natural Voices
        </Text>
        <Text style={styles.sliderContainer}>
          {`Selected Voice: ${selectedVoice || ''}`}
        </Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={text}
            multiline={true}
            placeholder="write something!"
            onSubmitEditing={Keyboard.dismiss}
            style={{
              flex: 1,
              height: '100%',
            }}
            onChangeText={text => setText(text)}
          />
        </View>
        <TouchableOpacity style={styles.buttonStyle} onPress={readText}>
          <Text style={styles.buttonTextStyle}>
            Click to Read Text ({`Status: ${ttsStatus || ''}`})
          </Text>
        </TouchableOpacity>
        <Text style={styles.sliderLabel}>Select the Voice from below</Text>
        <FlatList
          style={{width: '100%', marginTop: 5}}
          keyExtractor={item => item.id}
          renderItem={renderVoiceItem}
          // extraData={selectedVoice}
          data={voices}
        />
      </View>
    </SafeAreaView>
  );
};

export default TextToSpeed;

const styles = StyleSheet.create({
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    maxHeight: Dimensions.get('window').height / 2,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 5,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    padding: 5,
  },
  sliderLabel: {
    textAlign: 'center',
    marginRight: 20,
  },
  slider: {
    flex: 1,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    color: 'black',
    width: '100%',
    textAlign: 'center',
    height: 40,
  },
});
