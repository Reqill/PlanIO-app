import * as Font from "expo-font";
import React from "react";
import { AppLoading } from "expo";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Image,
  BackHandler,
  StatusBar
} from "react-native";
import GenerateLessonCard from "./GenerateCard.js";
import { Overlay } from "react-native-elements";
import styles from "./styles.js";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import AsyncStorage from "@react-native-community/async-storage";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'

// import LessonButton from './components/LessonButton.js'
import SettingsScreen from './screens/SettingsScreen.js'
import LessonPlanScreen from './screens/LessonPlanScreen.js'
import NewsFeedScreen from './screens/NewsFeedScreen.js'
import SchoolPickScreen from './screens/SchoolPickScreen.js'

const Tab = createBottomTabNavigator();

// const Other = () => {
//   return (null);
// }


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async UNSAFE_componentWillMount() {
    await Font.loadAsync({
      "jaapokki-regular": require("./assets/fonts/jaapokki-regular.ttf"),
      "jaapokki-enchance": require("./assets/fonts/jaapokkienchance-regular.ttf"),
      "jaapokki-substract": require("./assets/fonts/jaapokkisubtract-regular.ttf"),
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="LessonPlan"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'LessonPlan') {
                iconName = 'ios-home'
              } else if (route.name === 'Settings') {
                iconName = 'ios-list';
              } else {
                iconName = 'ios-list'
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={28} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#534833',
            inactiveTintColor: 'white',
            showLabel: false,
            style: {
              backgroundColor: '#CCC4B8',
            }
          }}
        >
          <Tab.Screen name="SchoolPick" component={SchoolPickScreen} />
          <Tab.Screen name="LessonPlan" component={Main} />
          {/* <Tab.Screen name="Other" component={Other} options={{
            tabBarButton: () => (<LessonButton />),
          }} /> */}
          <Tab.Screen name="NewsFeed" component={NewsFeedScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor="#CCC4B8" translucent={true} />
      </NavigationContainer>
    );
  }
}

function GenerateSchoolCard({ elementData, eventHandler, sendData }) {
  const { schoolID, schoolName, schoolURL } = elementData;

  const handleEvent = (event) => {
    sendData(schoolURL);
    eventHandler(event);
  };

  return (
    <View style={styles.center}>
      <View style={styles.schoolContainer}>
        <View style={styles.leftSide}>
          <Text style={styles.schoolNameText}>{schoolName}</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity style={styles.full} onPress={handleEvent}>
            <Text style={styles.pickSchoolBtn}>{">>"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

class SchoolPick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
      refreshing: false,
    };
    this.schoolList = [];
    this.schoolURL = "";
    this.schoolChosen = false;
    this.getData = this.getData.bind(this);
    this.changeSchool = this.props.changeSchool;
  }

  getData = (URL) => {
    this.schoolURL = URL;
    this.schoolChosen = true;
    storeItem("pickedSchool", URL);
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    getSchoolList()
      .then((res) => {
        this.schoolList = res;
        this.setState({ refreshing: false });
      })
      .catch((er) => console.log(er));
  };

  _schoolChosen = () => {
    this.setState({ change: false });
  };

  generateSchoolList = () => {
    return this.schoolList.map((el, i) => (
      <GenerateSchoolCard
        elementData={el}
        key={i}
        eventHandler={this._schoolChosen}
        sendData={this.getData}
      />
    ));
  };

  render() {
    if ((this.schoolURL.length > 10) & !this.changeSchool) {
      return <Main schoolURL={this.schoolURL} />;
    } else {
      if (this.state.change) {
        if (!this.schoolChosen) {
          return (
            <SafeAreaView style={styles.main}>
              <View style={styles.pickHeaderContainer}>
                <Text style={styles.pickHeaderText}>Wybierz szkołe:</Text>
              </View>
              <View style={styles.bottomPick}>
                <ScrollView
                  style={styles.schoolScrollBox}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={true}
                  decelerationRate={0.956}
                  fadingEdgeLength={35}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  }
                >
                  {this.generateSchoolList()}
                  <View style={styles.center}>
                    <View style={styles.schoolContainer}>
                      <Text style={styles.schoolFillText}>
                        więcej szkoł wkrótce...
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
          );
        } else {
          return <Main schoolURL={this.schoolURL} />;
        }
      } else {
        getSchoolList()
          .then((res) => {
            this.schoolList = res;
            retrieveItem("pickedSchool").then((resp) => {
              if (resp.length > 10) {
                this.schoolURL = resp;
              }
              this.setState({ change: true });
            });
          })
          .catch((er) => console.log(er));
        return <InternetConnection />;
      }
    }
  }
}

async function runCrypto(txt) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    txt
  );
  return digest;
  /* Some crypto operation... */
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayIdx: 0,
      classIdx: 11,
      timeTable: <View />,
      isOverlayVisible: false,
      fadeAnim: new Animated.Value(0),
      refreshing: false,
      visible: true,
    };
    this.change = true;
    this.lessonTable = [];
    this.replacement = [];
    this.luckyNumbers = [];
    this.schoolURL = this.props.schoolURL;
  }

  safetyGap = () => {
    if (this.lessonTable.length === 0) {
      this.refresh();
    }
    if (this.lessonTable.length === 0) {
      getLessonPlan(this.schoolURL)
        .then((response) => {
          this.lessonTable = response;
          if (this.state.dayIdx > response[0].schoolDays.length - 1) {
            this.setState({ dayIdx: 0 });
          }
          if (this.state.classIdx > response[0].numberOfClasses - 1) {
            this.setState({ classIdx: 0 });
          }
          if (this.state.dayIdx < 0) {
            this.setState({
              classIdx: Number(response[0].schoolDays.length - 1),
            });
          }
          if (this.state.classIdx < 0) {
            this.setState({
              classIdx: response[0].numberOfClasses - 1,
            });
          }
        })
        .catch((error) => console.log(error.message));
    } else {
      if (this.state.dayIdx > this.lessonTable[0].schoolDays.length - 1) {
        this.setState({ dayIdx: 0 });
      }
      if (this.state.classIdx > this.lessonTable[0].numberOfClasses - 1) {
        this.setState({ classIdx: 0 });
      }
      if (this.state.dayIdx < 0) {
        this.setState({
          classIdx: Number(this.lessonTable[0].schoolDays.length - 1),
        });
      }
      if (this.state.classIdx < 0) {
        this.setState({ classIdx: this.lessonTable[0].numberOfClasses - 1 });
      }
    }
  };
  nextClass = () => {
    if (this.state.classIdx !== this.lessonTable[0].numberOfClasses - 1) {
      this.setState({ classIdx: this.state.classIdx + 1 });
    } else {
      this.setState({ classIdx: 0 });
    }
    {
      this.safetyGap();
    }
  };
  prevClass = () => {
    if (this.state.classIdx !== 0) {
      this.setState({ classIdx: this.state.classIdx - 1 });
    } else {
      this.setState({ classIdx: this.lessonTable[0].numberOfClasses - 1 });
    }
    {
      this.safetyGap();
    }
  };
  nextDay = () => {
    if (this.state.dayIdx !== 4) {
      this.setState({ dayIdx: this.state.dayIdx + 1 });
      // this.storeItem("day", this.state.dayIdx + 1);
    } else {
      this.setState({ dayIdx: 0 });
      // this.storeItem("day", 0);
    }
    {
      this.safetyGap();
    }
  };
  prevDay = () => {
    if (this.state.dayIdx !== 0) {
      this.setState({ dayIdx: this.state.dayIdx - 1 });
      // this.storeItem("day", this.state.dayIdx - 1);
    } else {
      this.setState({ dayIdx: 4 });
      // this.storeItem("day", 4);
    }
    {
      this.safetyGap();
    }
  };
  saveClass = () => {
    this.safetyGap();
    storeItem("favClass", this.state.classIdx);
    // Alert.alert("Klasa została zapisana");
    this.refresh();
  };
  loadClass = () => {
    retrieveItem("favClass")
      .then((goals) => {
        if (!isNaN(goals)) {
          this.setState({ classIdx: Number(goals) });
        } else this.setState({ classIdx: 0 });
      })
      .catch((error) => {
        console.log(error);
      });
    this.change = false;
    this.refresh();
  };
  generatePlan = (classIdx, dayIdx) => {
    if ((this.lessonTable.length === 0) | (this.replacement.length === 0)) {
      getLessonPlan(this.schoolURL)
        .then((response) => {
          this.lessonTable = response;
          getReplacement(response[0].replacementsURL)
            .then((res) => {
              this.replacement = res;
              return generateCard(
                dayIdx,
                classIdx,
                this.lessonTable,
                this.replacement
              );
            })
            .catch((error) => console.log(error.message));
          this.loadClass();
        })
        .catch((error) => console.log(error.message));
    } else {
      return generateCard(dayIdx, classIdx, this.lessonTable, this.replacement);
    }
  };
  refresh = () => {
    getLessonPlan(this.schoolURL)
      .then((response) => {
        this.lessonTable = response;
        getReplacement(response[0].replacementsURL)
          .then((res) => {
            this.replacement = res;
          })
          .catch((error) => console.log(error.message));
        getLuckyNumbers(response[0].luckyNumbersURL)
          .then((resp) => {
            this.luckyNumbers = resp;
          })
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));
  };
  toggleOverlay = () => {
    this.setState({ isOverlayVisible: !this.state.isOverlayVisible });
  };

  //   ....           ....           ....           ....          //
  //    ||             ||             ||             ||           //
  //  /"""l|\        /"""l|\        /"""l|\        /"""l|\        //
  // /_______\      /_______\      /_______\      /_______\       //
  // |  .-.  |------|  .-.  |------|  .-.  |------|  .-.  |------ //
  //  __|L|__| .--. |__|L|__| .--. |__|L|__| .--. |__|L|__| .--.  //
  //  __\  \\p__`o-o'__\  \\p__`o-o'__\  \\p__`o-o'__\  \\p__`o-o'//
  // ------------------------------------------------------------ //
  // ------------------------------------------------------------ //

  _onRefresh = () => {
    // getSchoolPage().then((res) => console.log(res));
    // runCrypto("essa").then((res) => console.log(res));   kryptowanie
    this.setState({ refreshing: true });
    getLessonPlan(this.schoolURL)
      .then((response) => {
        this.lessonTable = response;
        getReplacement(response[0].replacementsURL)
          .then((res) => {
            this.replacement = res;
            this.setState({ refreshing: false });
            this.safetyGap();
          })
          .catch((error) => console.log(error.message));
        getLuckyNumbers(response[0].luckyNumbersURL)
          .then((resp) => {
            this.luckyNumbers = resp;
          })
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));
  };

  componentDidMount() {
    this.setState({ dayIdx: getDayOfWeek() });
    this.generatePlan(this.classIdx, this.dayIdx);
    this.loadClass();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  backAction = () => {
    this.setState({ visible: false });
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  // fadeIn = () => {
  //   Animated.timing(this.state.fadeAnim, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // fadeOut = () => {
  //   Animated.timing(this.state.fadeAnim, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    if (
      (!(this.lessonTable.length === 0) | !(this.replacement.length === 0)) &
      this.state.visible
    ) {
      return (
        <View style={styles.ehh}>
          <SafeAreaView style={styles.main}>
            <View style={styles.top}>
              <View style={styles.pickBox}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={this.prevClass}
                >
                  <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <View style={styles.infoBox}>
                  <Text style={styles.info}>
                    {this.lessonTable[0].classLabels[this.state.classIdx]}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={this.nextClass}
                >
                  <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickBox}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={this.prevDay}
                >
                  <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <View style={styles.infoBox}>
                  <Text style={styles.info}>
                    {this.lessonTable[0].schoolDays[this.state.dayIdx]}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={this.nextDay}
                >
                  <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottom}>
              <View style={styles.topagain}>
                <ScrollView
                  style={styles.scrollBox}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={true}
                  decelerationRate={0.956}
                  fadingEdgeLength={35}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  }
                >
                  <GestureRecognizer
                    // onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    // onSwipeUp={(state) => this.onSwipeUp(state)}
                    // onSwipeDown={(state) => this.onSwipeDown(state)}
                    onSwipeLeft={this.nextDay}
                    onSwipeRight={this.prevDay}
                    config={config}
                    style={{
                      flex: 1,
                    }}
                  >
                    <View style={styles.center}>
                      {this.generatePlan(
                        this.state.classIdx,
                        this.state.dayIdx
                      )}
                    </View>
                  </GestureRecognizer>
                </ScrollView>
              </View>

              {/* <View style={styles.bottomer}>
                <TouchableOpacity
                  style={styles.classbtn}
                  onPress={this.saveClass}
                >
                  <Text style={styles.btntxt}>zapisz klase</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.luckybtn}
                  onPress={this.toggleOverlay}
                >
                  <Text style={styles.luckytxt}>♧</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.classbtn}
                  onPress={this.loadClass}
                >
                  <Text style={styles.btntxt}>twoja klasa</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </SafeAreaView>

          <Overlay
            isVisible={this.state.isOverlayVisible}
            onBackdropPress={this.toggleOverlay}
            backdropStyle={styles.backdrop}
            overlayStyle={styles.overlay}
          >
            <View style={styles.overlayyy}>
              <Text style={styles.numbersIndicator}>Szczęśliwe numerki:</Text>
              <LuckyNumbersDisplay luckyNumbers={this.luckyNumbers} />
              <Text style={styles.bezIndicator}>Klasy bez numerków:</Text>
              <WithoutLuckyNumber luckyNumbers={this.luckyNumbers} />
            </View>
          </Overlay>
        </View>
      );
    } else if (this.state.visible) {
      getLessonPlan(this.schoolURL)
        .then((response) => {
          this.lessonTable = response;
          getReplacement(response[0].replacementsURL)
            .then((res) => {
              this.replacement = res;
            })
            .catch((error) => console.log(error.message));
        })
        .catch((error) => console.log(error.message));

      return <InternetConnection />;
    } else {
      return <SchoolPick changeSchool={true} />;
    }
  }
}

async function storeItem(key, item) {
  try {
    var tmp = await AsyncStorage.setItem(key, String(item));
    return tmp;
  } catch (error) {
    console.log(error.message);
  }
}
async function retrieveItem(key) {
  try {
    const retrievedItem = await AsyncStorage.getItem(key);
    const item = String(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return;
}
async function getSchoolList() {
  const response = await fetch("https://api.npoint.io/664a31744bc4b05f56d0");
  const list = await response.json();
  return list;
}
async function getLessonPlan(URL) {
  const response = await fetch(URL);
  const plan = await response.json();
  return plan;
}
async function getReplacement(URL) {
  const response = await fetch(URL);
  const replacement = await response.json();
  return replacement;
}
async function getLuckyNumbers(URL) {
  const response = await fetch(URL);
  const numbers = await response.json();
  return numbers;
}
function generateCard(dayIdx, classIdx, plan, replacement) {
  const firstLesson = plan[1][classIdx][dayIdx][1][0].noLesson;
  const tmp = plan[1][classIdx][dayIdx][1].length;
  const lastLesson = plan[1][classIdx][dayIdx][1][tmp - 1].noLesson;

  return plan[1][classIdx][dayIdx][1].map((el, i) => (
    <GenerateLessonCard
      elementData={el}
      key={i}
      lessonTime={plan[0].lessonHours}
      classIdx={classIdx}
      dayIdx={dayIdx}
      replacements={replacement}
      classLabels={plan[0].classLabels}
      schoolDays={plan[0].schoolDays}
      firstLesson={firstLesson}
      lastLesson={lastLesson}
    />
  ));
}
function getDayOfWeek() {
  let date = new Date();
  let dayOfWeek = date.getDay();
  dayOfWeek = dayOfWeek - 1;
  if (dayOfWeek < 0) {
    dayOfWeek = 0;
  } else if (dayOfWeek > 4) {
    dayOfWeek = 4;
  }
  return dayOfWeek;
}
function WithoutLuckyNumber(props) {
  const { luckyNumbers } = props;

  switch (luckyNumbers.without.length) {
    case 1:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
        </View>
      );
    case 2:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[1]}</Text>
          </View>
        </View>
      );
    case 3:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[1]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[2]}</Text>
          </View>
        </View>
      );
    case 4:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[1]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[2]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[3]}</Text>
          </View>
        </View>
      );
    case 5:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[1]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[2]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[3]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[4]}</Text>
          </View>
        </View>
      );
    case 6:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[0]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[1]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[2]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[3]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[4]}</Text>
          </View>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>{luckyNumbers.without[5]}</Text>
          </View>
        </View>
      );
    default:
      return (
        <View style={styles.bezAll}>
          <View style={styles.bezContainer}>
            <Text style={styles.bezClass}>Wszystkie klasy mają numerki :)</Text>
          </View>
        </View>
      );
  }
}
function LuckyNumbersDisplay(props) {
  const { luckyNumbers } = props;
  return (
    <View style={styles.luckyNumbersContainer}>
      <View style={styles.luckyNumbersCard}>
        <Text style={styles.luckyNumber}>{luckyNumbers.numbers[0]}</Text>
      </View>
      <View style={styles.luckyNumbersCard}>
        <Text style={styles.luckyNumber}>{luckyNumbers.numbers[1]}</Text>
      </View>
    </View>
  );
}
export class InternetConnection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      delay: 2000,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  render() {
    return (
      <View style={styles.ehh}>
        <Image
          style={styles.imisplash}
          source={require("./assets/splash.png")}
          fadeDuration={0}
        />
        <Text style={styles.signature}>by Mikołaj Mrózek</Text>
        <Animated.View
          style={{
            opacity: this.state.fadeAnim,
          }}
        >
          <Text style={styles.infolol}>sprawdź połączenie internetowe</Text>
        </Animated.View>
        {this.fadeIn()}
      </View>
    );
  }
}

