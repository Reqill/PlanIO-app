import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
// import styles from "./styles.js";
// import InternetConnection from 'Apps.js'

// async function storeItem(key, item) {
//     try {
//         var tmp = await AsyncStorage.setItem(key, String(item));
//         return tmp;
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// async function retrieveItem(key) {
//     try {
//         const retrievedItem = await AsyncStorage.getItem(key);
//         const item = String(retrievedItem);
//         return item;
//     } catch (error) {
//         console.log(error.message);
//     }
//     return;
// }
// async function getSchoolList() {
//     const response = await fetch("https://api.npoint.io/664a31744bc4b05f56d0");
//     const list = await response.json();
//     return list;
// }

// class SchoolPickScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             change: false,
//             refreshing: false,
//         };
//         this.schoolList = [];
//         this.schoolURL = "";
//         this.schoolChosen = false;
//         this.getData = this.getData.bind(this);
//         this.changeSchool = this.props.changeSchool;
//     }

//     getData = (URL) => {
//         this.schoolURL = URL;
//         this.schoolChosen = true;
//         storeItem("pickedSchool", URL);
//     };

//     _onRefresh = () => {
//         this.setState({ refreshing: true });
//         getSchoolList()
//             .then((res) => {
//                 this.schoolList = res;
//                 this.setState({ refreshing: false });
//             })
//             .catch((er) => console.log(er));
//     };

//     _schoolChosen = () => {
//         this.setState({ change: false });
//     };

//     generateSchoolList = () => {
//         return this.schoolList.map((el, i) => (
//             <GenerateSchoolCard
//                 elementData={el}
//                 key={i}
//                 eventHandler={this._schoolChosen}
//                 sendData={this.getData}
//             />
//         ));
//     };

//     render() {
//         if ((this.schoolURL.length > 10) & !this.changeSchool) {
//             return <Main schoolURL={this.schoolURL} />;
//         } else {
//             if (this.state.change) {
//                 if (!this.schoolChosen) {
//                     return (
//                         <SafeAreaView style={styles.main}>
//                             <View style={styles.pickHeaderContainer}>
//                                 <Text style={styles.pickHeaderText}>Wybierz szkołe:</Text>
//                             </View>
//                             <View style={styles.bottomPick}>
//                                 <ScrollView
//                                     style={styles.schoolScrollBox}
//                                     showsVerticalScrollIndicator={false}
//                                     alwaysBounceVertical={true}
//                                     decelerationRate={0.956}
//                                     fadingEdgeLength={35}
//                                     refreshControl={
//                                         <RefreshControl
//                                             refreshing={this.state.refreshing}
//                                             onRefresh={this._onRefresh.bind(this)}
//                                         />
//                                     }
//                                 >
//                                     {this.generateSchoolList()}
//                                     <View style={styles.center}>
//                                         <View style={styles.schoolContainer}>
//                                             <Text style={styles.schoolFillText}>
//                                                 więcej szkoł wkrótce...
//                         </Text>
//                                         </View>
//                                     </View>
//                                 </ScrollView>
//                             </View>
//                         </SafeAreaView>
//                     );
//                 } else {
//                     return <Main schoolURL={this.schoolURL} />;
//                 }
//             } else {
//                 getSchoolList()
//                     .then((res) => {
//                         this.schoolList = res;
//                         retrieveItem("pickedSchool").then((resp) => {
//                             if (resp.length > 10) {
//                                 this.schoolURL = resp;
//                             }
//                             this.setState({ change: true });
//                         });
//                     })
//                     .catch((er) => console.log(er));
//                 return <InternetConnection />;
//             }
//         }
//     }
// }

// export default SchoolPickScreen;

export default function SchoolPickScreen() {
    return (<View style={[{ justifyContent: "center" }, { alignItems: "center" }, { flex: 1 }]}><Text>School Pick Screen</Text></View>)
}