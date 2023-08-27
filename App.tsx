import { StatusBar } from 'expo-status-bar'
import { View, Image, ActivityIndicator } from 'react-native'
import { styles } from './styles'
import { useState } from 'react'

import { Button } from './src/components/Button'

import { decodeJpeg } from '@tensorflow/tfjs-react-native'

import * as ImagePicker from 'expo-image-picker'
import * as tensorflow from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as FileSystem from 'expo-file-system'
import {
  Classification,
  ClassificationProps,
} from './src/components/Classification'

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ClassificationProps[]>([])

  const handleSelectImage = async () => {
    setIsLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      })
      // se usuario não cancelar o upload
      if (!result.canceled) {
        const { uri } = result.assets[0]
        setSelectedImageUri(uri)
        // apos termos uma imagem selecionada, iremos classificar a imagem
        await imageClassification(uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const imageClassification = async (imageUri: string) => {
    // limpar o estado
    setResults([])
    // carregar o tensorflow
    await tensorflow.ready()
    // carregar o modelo de classificacao
    const model = await mobilenet.load()
    // converter a imagem para base64
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    })
    // criando um buffer
    const imgBuffer = tensorflow.util.encodeString(imageBase64, 'base64').buffer
    const raw = new Uint8Array(imgBuffer)
    const imageTensor = decodeJpeg(raw)
    // classificar a imagem
    const classificationResult = await model.classify(imageTensor)
    // setar o resultado na tela e atualizar o estado
    setResults(classificationResult)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Image
        source={{
          uri:
            selectedImageUri ||
            'https://ceowatermandate.org/wp-content/plugins/ninja-forms/assets/img/no-image-available-icon-6.jpg',
        }}
        style={styles.image}
        alt="image"
      />
      <View style={styles.results}>
        {results.map((result, index) => (
          <Classification data={result} key={index} />
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <Button title="Selecionar imagem" onPress={handleSelectImage} />
      )}
    </View>
  )
}
