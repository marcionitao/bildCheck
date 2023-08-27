import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    marginTop: 40,
    width: '95%',
    height: 300,
    borderRadius: 7,
  },
  results: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  },
})
