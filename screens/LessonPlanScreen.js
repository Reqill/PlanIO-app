import React from 'react';
import { Text, View } from 'react-native';

// class LessonPlanScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             dayIdx: 0,
//             classIdx: 11,
//             timeTable: <View />,
//             isOverlayVisible: false,
//             fadeAnim: new Animated.Value(0),
//             refreshing: false,
//             visible: true,
//         };
//         this.change = true;
//         this.lessonTable = [];
//         this.replacement = [];
//         this.luckyNumbers = [];
//         this.schoolURL = this.props.schoolURL;
//     }

//     safetyGap = () => {
//         if (this.lessonTable.length === 0) {
//             this.refresh();
//         }
//         if (this.lessonTable.length === 0) {
//             getLessonPlan(this.schoolURL)
//                 .then((response) => {
//                     this.lessonTable = response;
//                     if (this.state.dayIdx > response[0].schoolDays.length - 1) {
//                         this.setState({ dayIdx: 0 });
//                     }
//                     if (this.state.classIdx > response[0].numberOfClasses - 1) {
//                         this.setState({ classIdx: 0 });
//                     }
//                     if (this.state.dayIdx < 0) {
//                         this.setState({
//                             classIdx: Number(response[0].schoolDays.length - 1),
//                         });
//                     }
//                     if (this.state.classIdx < 0) {
//                         this.setState({
//                             classIdx: response[0].numberOfClasses - 1,
//                         });
//                     }
//                 })
//                 .catch((error) => console.log(error.message));
//         } else {
//             if (this.state.dayIdx > this.lessonTable[0].schoolDays.length - 1) {
//                 this.setState({ dayIdx: 0 });
//             }
//             if (this.state.classIdx > this.lessonTable[0].numberOfClasses - 1) {
//                 this.setState({ classIdx: 0 });
//             }
//             if (this.state.dayIdx < 0) {
//                 this.setState({
//                     classIdx: Number(this.lessonTable[0].schoolDays.length - 1),
//                 });
//             }
//             if (this.state.classIdx < 0) {
//                 this.setState({ classIdx: this.lessonTable[0].numberOfClasses - 1 });
//             }
//         }
//     };
//     nextClass = () => {
//         if (this.state.classIdx !== this.lessonTable[0].numberOfClasses - 1) {
//             this.setState({ classIdx: this.state.classIdx + 1 });
//         } else {
//             this.setState({ classIdx: 0 });
//         }
//         {
//             this.safetyGap();
//         }
//     };
//     prevClass = () => {
//         if (this.state.classIdx !== 0) {
//             this.setState({ classIdx: this.state.classIdx - 1 });
//         } else {
//             this.setState({ classIdx: this.lessonTable[0].numberOfClasses - 1 });
//         }
//         {
//             this.safetyGap();
//         }
//     };
//     nextDay = () => {
//         if (this.state.dayIdx !== 4) {
//             this.setState({ dayIdx: this.state.dayIdx + 1 });
//             // this.storeItem("day", this.state.dayIdx + 1);
//         } else {
//             this.setState({ dayIdx: 0 });
//             // this.storeItem("day", 0);
//         }
//         {
//             this.safetyGap();
//         }
//     };
//     prevDay = () => {
//         if (this.state.dayIdx !== 0) {
//             this.setState({ dayIdx: this.state.dayIdx - 1 });
//             // this.storeItem("day", this.state.dayIdx - 1);
//         } else {
//             this.setState({ dayIdx: 4 });
//             // this.storeItem("day", 4);
//         }
//         {
//             this.safetyGap();
//         }
//     };
//     saveClass = () => {
//         this.safetyGap();
//         storeItem("favClass", this.state.classIdx);
//         // Alert.alert("Klasa została zapisana");
//         this.refresh();
//     };
//     loadClass = () => {
//         retrieveItem("favClass")
//             .then((goals) => {
//                 if (!isNaN(goals)) {
//                     this.setState({ classIdx: Number(goals) });
//                 } else this.setState({ classIdx: 0 });
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//         this.change = false;
//         this.refresh();
//     };
//     generatePlan = (classIdx, dayIdx) => {
//         if ((this.lessonTable.length === 0) | (this.replacement.length === 0)) {
//             getLessonPlan(this.schoolURL)
//                 .then((response) => {
//                     this.lessonTable = response;
//                     getReplacement(response[0].replacementsURL)
//                         .then((res) => {
//                             this.replacement = res;
//                             return generateCard(
//                                 dayIdx,
//                                 classIdx,
//                                 this.lessonTable,
//                                 this.replacement
//                             );
//                         })
//                         .catch((error) => console.log(error.message));
//                     this.loadClass();
//                 })
//                 .catch((error) => console.log(error.message));
//         } else {
//             return generateCard(dayIdx, classIdx, this.lessonTable, this.replacement);
//         }
//     };
//     refresh = () => {
//         getLessonPlan(this.schoolURL)
//             .then((response) => {
//                 this.lessonTable = response;
//                 getReplacement(response[0].replacementsURL)
//                     .then((res) => {
//                         this.replacement = res;
//                     })
//                     .catch((error) => console.log(error.message));
//                 getLuckyNumbers(response[0].luckyNumbersURL)
//                     .then((resp) => {
//                         this.luckyNumbers = resp;
//                     })
//                     .catch((error) => console.log(error.message));
//             })
//             .catch((error) => console.log(error.message));
//     };
//     toggleOverlay = () => {
//         this.setState({ isOverlayVisible: !this.state.isOverlayVisible });
//     };

//     //   ....           ....           ....           ....          //
//     //    ||             ||             ||             ||           //
//     //  /"""l|\        /"""l|\        /"""l|\        /"""l|\        //
//     // /_______\      /_______\      /_______\      /_______\       //
//     // |  .-.  |------|  .-.  |------|  .-.  |------|  .-.  |------ //
//     //  __|L|__| .--. |__|L|__| .--. |__|L|__| .--. |__|L|__| .--.  //
//     //  __\  \\p__`o-o'__\  \\p__`o-o'__\  \\p__`o-o'__\  \\p__`o-o'//
//     // ------------------------------------------------------------ //
//     // ------------------------------------------------------------ //

//     _onRefresh = () => {
//         // getSchoolPage().then((res) => console.log(res));
//         // runCrypto("essa").then((res) => console.log(res));   kryptowanie
//         this.setState({ refreshing: true });
//         getLessonPlan(this.schoolURL)
//             .then((response) => {
//                 this.lessonTable = response;
//                 getReplacement(response[0].replacementsURL)
//                     .then((res) => {
//                         this.replacement = res;
//                         this.setState({ refreshing: false });
//                         this.safetyGap();
//                     })
//                     .catch((error) => console.log(error.message));
//                 getLuckyNumbers(response[0].luckyNumbersURL)
//                     .then((resp) => {
//                         this.luckyNumbers = resp;
//                     })
//                     .catch((error) => console.log(error.message));
//             })
//             .catch((error) => console.log(error.message));
//     };

//     componentDidMount() {
//         this.setState({ dayIdx: getDayOfWeek() });
//         this.generatePlan(this.classIdx, this.dayIdx);
//         this.loadClass();
//         this.backHandler = BackHandler.addEventListener(
//             "hardwareBackPress",
//             this.backAction
//         );
//     }
//     backAction = () => {
//         this.setState({ visible: false });
//         return true;
//     };
//     componentWillUnmount() {
//         this.backHandler.remove();
//     }
//     // fadeIn = () => {
//     //   Animated.timing(this.state.fadeAnim, {
//     //     toValue: 1,
//     //     duration: 500,
//     //     useNativeDriver: true,
//     //   }).start();
//     // };

//     // fadeOut = () => {
//     //   Animated.timing(this.state.fadeAnim, {
//     //     toValue: 0,
//     //     duration: 500,
//     //     useNativeDriver: true,
//     //   }).start();
//     // };

//     render() {
//         const config = {
//             velocityThreshold: 0.3,
//             directionalOffsetThreshold: 80,
//         };
//         if (
//             (!(this.lessonTable.length === 0) | !(this.replacement.length === 0)) &
//             this.state.visible
//         ) {
//             return (
//                 <View style={styles.ehh}>
//                     <SafeAreaView style={styles.main}>
//                         <View style={styles.top}>
//                             <View style={styles.pickBox}>
//                                 <TouchableOpacity
//                                     style={styles.arrowButton}
//                                     onPress={this.prevClass}
//                                 >
//                                     <Text style={styles.arrow}>{"<"}</Text>
//                                 </TouchableOpacity>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.info}>
//                                         {this.lessonTable[0].classLabels[this.state.classIdx]}
//                                     </Text>
//                                 </View>
//                                 <TouchableOpacity
//                                     style={styles.arrowButton}
//                                     onPress={this.nextClass}
//                                 >
//                                     <Text style={styles.arrow}>{">"}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={styles.pickBox}>
//                                 <TouchableOpacity
//                                     style={styles.arrowButton}
//                                     onPress={this.prevDay}
//                                 >
//                                     <Text style={styles.arrow}>{"<"}</Text>
//                                 </TouchableOpacity>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.info}>
//                                         {this.lessonTable[0].schoolDays[this.state.dayIdx]}
//                                     </Text>
//                                 </View>
//                                 <TouchableOpacity
//                                     style={styles.arrowButton}
//                                     onPress={this.nextDay}
//                                 >
//                                     <Text style={styles.arrow}>{">"}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         <View style={styles.bottom}>
//                             <View style={styles.topagain}>
//                                 <ScrollView
//                                     style={styles.scrollBox}
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
//                                     <GestureRecognizer
//                                         // onSwipe={(direction, state) => this.onSwipe(direction, state)}
//                                         // onSwipeUp={(state) => this.onSwipeUp(state)}
//                                         // onSwipeDown={(state) => this.onSwipeDown(state)}
//                                         onSwipeLeft={this.nextDay}
//                                         onSwipeRight={this.prevDay}
//                                         config={config}
//                                         style={{
//                                             flex: 1,
//                                         }}
//                                     >
//                                         <View style={styles.center}>
//                                             {this.generatePlan(
//                                                 this.state.classIdx,
//                                                 this.state.dayIdx
//                                             )}
//                                         </View>
//                                     </GestureRecognizer>
//                                 </ScrollView>
//                             </View>

//                             <View style={styles.bottomer}>
//                                 <TouchableOpacity
//                                     style={styles.classbtn}
//                                     onPress={this.saveClass}
//                                 >
//                                     <Text style={styles.btntxt}>zapisz klase</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     style={styles.luckybtn}
//                                     onPress={this.toggleOverlay}
//                                 >
//                                     <Text style={styles.luckytxt}>♧</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     style={styles.classbtn}
//                                     onPress={this.loadClass}
//                                 >
//                                     <Text style={styles.btntxt}>twoja klasa</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </SafeAreaView>

//                     <Overlay
//                         isVisible={this.state.isOverlayVisible}
//                         onBackdropPress={this.toggleOverlay}
//                         backdropStyle={styles.backdrop}
//                         overlayStyle={styles.overlay}
//                     >
//                         <View style={styles.overlayyy}>
//                             <Text style={styles.numbersIndicator}>Szczęśliwe numerki:</Text>
//                             <LuckyNumbersDisplay luckyNumbers={this.luckyNumbers} />
//                             <Text style={styles.bezIndicator}>Klasy bez numerków:</Text>
//                             <WithoutLuckyNumber luckyNumbers={this.luckyNumbers} />
//                         </View>
//                     </Overlay>
//                 </View>
//             );
//         } else if (this.state.visible) {
//             getLessonPlan(this.schoolURL)
//                 .then((response) => {
//                     this.lessonTable = response;
//                     getReplacement(response[0].replacementsURL)
//                         .then((res) => {
//                             this.replacement = res;
//                         })
//                         .catch((error) => console.log(error.message));
//                 })
//                 .catch((error) => console.log(error.message));

//             return <InternetConnection />;
//         } else {
//             return <SchoolPick changeSchool={true} />;
//         }
//     }
// }

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

// export default LessonPlanScreen;

export default function LessonPlanScree() {
    return (<View style={[{ justifyContent: "center" }, { alignItems: "center" }, { flex: 1 }]}><Text>Lesson Plan Screen</Text></View>);
}