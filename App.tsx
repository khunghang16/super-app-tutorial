// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */
//
// import React, {useCallback, useState} from 'react';
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   NativeModules,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
//
// const {ConnectNativeModule} = NativeModules;
//
// interface App {
//   bundleId: string;
//   appName: string;
// }
//
// function App(): JSX.Element {
//   const [input, setInput] = useState<string>('');
//   const LIST_APPS: Array<App> = [
//     {
//       bundleId: `index.${Platform.OS}-1.bundle`,
//       appName: 'MiniAppOne',
//     },
//     {
//       appName: 'MiniAppTwo',
//       bundleId: `index.${Platform.OS}-2.bundle`,
//     },
//   ];
//
//   const goToNextApp = useCallback(
//     async (item: App) => {
//       ConnectNativeModule?.openApp(
//         item.appName,
//         item.bundleId,
//         {
//           text: input,
//         },
//         false,
//         () => {},
//       );
//
//       const result = await ConnectNativeModule?.getBundleNames();
//       return result;
//     },
//     [input],
//   );
//
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//       keyboardVerticalOffset={64}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <SafeAreaView style={styles.container}>
//           <Text style={styles.title}>Input send to miniapp</Text>
//           <TextInput
//             value={input}
//             placeholder="please input here"
//             onChangeText={text => setInput(text)}
//             style={styles.input}
//           />
//           <View style={styles.content}>
//             {LIST_APPS.map(app => (
//               <TouchableOpacity
//                 key={app?.bundleId}
//                 style={styles.btnApp}
//                 onPress={() => goToNextApp(app)}>
//                 <Text style={styles.appName}>{app?.appName}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   appName: {
//     fontWeight: 'bold',
//     fontSize: 24,
//     color: '#fff',
//   },
//   btnApp: {
//     borderWidth: 1,
//     backgroundColor: '#999',
//     padding: 16,
//     borderRadius: 60,
//   },
//   input: {
//     borderRadius: 4,
//     borderWidth: StyleSheet.hairlineWidth,
//     marginHorizontal: 16,
//     marginVertical: 10,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 20,
//     padding: 20,
//   },
// });
//
// export default App;

/* App.js */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  NativeModules, Platform
} from 'react-native';
import {
  DocumentDirectoryPath,
  readDir,
  downloadFile,
  getFSInfo,
  copyFileAssets, readDirAssets
} from 'react-native-fs';
const {ConnectNativeModule} = NativeModules;
const App = () => {
  const [directory, setDirectory] = useState([]);
  console.log("directory",directory[0],DocumentDirectoryPath)
  useEffect(() => {
    const getDirectoryList = async () => {
      try {
        const pathList = await readDir(DocumentDirectoryPath);
        setDirectory(pathList);
      } catch (error) {
        console.log(error);
      }
    };
    getDirectoryList();
  }, []);

  React.useEffect(()=>{
    //24266168
    getFSInfo().then(response => {
      console.log("deviceSpace",response)
    });

    // getFSInfo().then(response => {
    //   const deviceSpace = response.freeSpace * 0.001;
    //   if (deviceSpace > res.bytesWritten) {
    //     console.log('there is enough space');
    //   } else {
    //     console.log('there is not enough space');
    //   }
    // });
  },[])

  // handle download pdf function
  const handleDownload = () => {
    const url = Platform.OS === 'ios'? 'https://api.escuelajs.co/api/v1/files/2509.bundle':'https://api.escuelajs.co/api/v1/files/6c1a.bundle';

    const path = `${DocumentDirectoryPath}/index.android-1.bundle`;
    const response = downloadFile({
      fromUrl: url,
      toFile: path,
    });
    response.promise
        .then(async res => {
          if (res && res.statusCode === 200 && res.bytesWritten > 0) {
            console.log('size:', res.bytesWritten);


          } else {
            console.log(res);
          }
        })
        .catch(error => console.log(error));
  };

  const goToNextApp = React.useCallback(
      async ({bundleName, appPath}) => {
        ConnectNativeModule?.openApp(
            bundleName,
            appPath,
            {
              text: 'Test 1',
            },
            false,
            () => {},
        );

        const result = await ConnectNativeModule?.getBundleNames();
        return result;
      },
      [],
  );

  // render list of files in our directory
  const renderItem = ({item}) => (
      <View>
        <TouchableOpacity
            style={styles.list}
            onPress={() => {
              if(item.name === 'index.android-1.bundle' || item.name === 'index.ios-1.bundle'){
                goToNextApp({
                    bundleName: `MiniAppOne`,
                    appPath: item.path,
                })

              }
            }}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listName}>{item.path}</Text>
        </TouchableOpacity>
      </View>
  );

  return     <SafeAreaView style={styles.mainBody}>
    <View style={{alignItems: 'center'}}>
      <Text style={{fontSize: 30, textAlign: 'center'}}>
        React Native File Blob Tutorial
      </Text>
    </View>
    <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleDownload}>
      <Text style={styles.buttonTextStyle}>Download Image</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5}>
      <Text style={styles.buttonTextStyle}>Upload Image</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={async ()=>{

        try {
          const arrayRes = await readDirAssets('index.android-1.bundle');
          console.log("arrayRes",arrayRes)
          arrayRes.map(async item => {
            if (item.isFile()) {
              await copyFileAssets(
                  item.path,
                  DocumentDirectoryPath + '/' + item.path,
              );
            }
          });
        } catch (error) {
          console.log('error ', error);
        }

    }
    }>
      <Text style={styles.buttonTextStyle}>Copy</Text>
    </TouchableOpacity>

    <View style={styles.container}>
      <Text style={styles.fileHeader}>Files</Text>
      {/* if directory length is more than 0, then map through the directory array, else show no files text */}
      {directory.length > 0 ? (
          <FlatList
              data={directory}
              renderItem={renderItem}
              keyExtractor={item => item.name}
          />
      ) : null}
    </View>
  </SafeAreaView>


};
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  fileHeader: {
    color: '#fff',
    fontSize: 30,
    marginBottom: 10,
    borderColor: '#ccc',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  parent: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  list: {
    marginVertical: 5,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  listName: {
    fontSize: 16,
  },
});
export default App;
