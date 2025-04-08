import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// 🔑 הכנסי את המפתח שלך
const ASSEMBLYAI_API_KEY = '80d26ee504f24552a40bda89c25a44d2';

export default function SpeechToTextApp() {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      await sendToAssemblyAI(uri);
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const sendToAssemblyAI = async (uri) => {
    try {
      setLoading(true);
      setTranscript('');

      console.log("Uploading audio file...");

      // 🛠 שלב 1: העלאת קובץ אודיו בצורה נכונה
      const uploadRes = await FileSystem.uploadAsync('https://api.assemblyai.com/v2/upload', uri, {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      const uploadData = JSON.parse(uploadRes.body);
      console.log("Upload response:", uploadData);

      const audioUrl = uploadData.upload_url;

      console.log("Audio uploaded. Sending transcription request...");

      // 🛠 שלב 2: בקשת תמלול
      const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
            audio_url: audioUrl,
            language_code: 'he',  // 💬 תמלול בעברית
            speech_model: 'nano'  // מודל nano

          }),
       });

      const transcriptData = await transcriptRes.json();
      console.log("Transcript request response:", transcriptData);

      const transcriptId = transcriptData.id;

      // 🛠 שלב 3: Polling
      let done = false;
      let resultText = '';
      while (!done) {
        const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { authorization: ASSEMBLYAI_API_KEY },
        });

        const pollingData = await pollingRes.json();
        console.log("Polling response:", pollingData);

        if (pollingData.status === 'completed') {
          resultText = pollingData.text;
          done = true;
        } else if (pollingData.status === 'error') {
          resultText = `❌ שגיאה בתמלול: ${pollingData.error}`;
          done = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      setTranscript(resultText);
    } catch (err) {
      console.error('שגיאה בתהליך:', err);
      setTranscript(`❌ שגיאה כללית: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'עצור הקלטה' : 'התחל הקלטה'}
        onPress={recording ? stopRecording : startRecording}
      />
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {transcript ? <Text style={styles.text}>🗣️ {transcript}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  loader: {
    marginTop: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});
