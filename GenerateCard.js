import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Overlay } from "react-native-elements";

export default function GenerateLessonCard(props) {
  const [visible, setVisible] = useState(false); //dane o widoczności overlaya
  const { elementData } = props; //objekt z informacjami na temat generowanej lekcji
  const { dayIdx } = props; //indeks dnia szkolnego
  const { classIdx } = props; //indeks oddziału w szkole
  const { replacements } = props; //JSON z zastępstwami
  const { firstLesson } = props; //godzina rozpoczęcia lekcji danego oddziału w dany dzień
  const { lastLesson } = props; //godzina zakończenia lekcji danego oddziału w dany dzień
  const { classLabels } = props; //tablica z indeksami oddziałów w szkole
  const { schoolDays } = props; //tablica z dniami w jakich odbywają się lekcje
  const { lessonTime } = props; //tablica z godznami lekcji w placówce [lekcja 0-11][rozpoczęcie-zakończenie 0-1]
  const date = new Date(); //inforacje o dzisiejszym dniu
  const day = date.getDay() - 1; //numer dnia tygodnia [niedziela-sobota (-1)-5]
  const hours = date.getHours(); //aktualna godzina
  const minutes = date.getMinutes(); //aktualna minuta
  const currTime = Number(hours * 100 + minutes); //aktualny czas w formacie xxxx
  const { subjectName, roomNumber, noLesson } = elementData; //deklaracja obiektów w mapowanym
  const lessonNumber = noLesson; //TYMCZASOWE -=- zamiana starej nazwy na nową, czeka na nowy typ JSON
  const isCurrentLesson = _isCurrentLesson(
    lessonNumber,
    lessonTime,
    firstLesson,
    lastLesson,
    currTime
  ); //czy dana karta jest w godzinach aktualnej lekcji 0=inny dzień lub poza szkołą, 1=aktualna, 2=inna w czasie szkoły

  let groupsThatHaveReplacement = []; //tablica z numerami grup które mają zastępstwa 0=cała klasa 1+ = kolejne grupy
  let groupsThatHaveReplacementCopy;
  let replacementIdx = []; //tablica z numerem elementu zastępstwa w JSONie
  let finalSubjectArr = []; //tablica wszystkich przedmiotów, zamienionych i nie
  let finalRoomArr = []; //tablica wszystkich klas, zamienionych i nie
  let isReplacement = false;

  //końcowy stylesheet karty z lekcją
  let outputStyle = {
    container: [],
    subject: [],
    room: [],
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //przeczesanie tablicy JSONa z zastępstawami i zapisanie jakiej grupy ono dotyczy
  for (let i = 0; i < replacements.length; i++) {
    if (
      replacements[i].classLabel === classLabels[classIdx] &&
      replacements[i].day === schoolDays[dayIdx] &&
      replacements[i].lessonNumber === lessonNumber
    ) {
      groupsThatHaveReplacement.push(replacements[i].groupNumber);
      replacementIdx.push(i);
      isReplacement = true;
    }
  }

  //stworzenie kopii tablicy z numerami grup posiadających zastępstwo
  groupsThatHaveReplacementCopy = groupsThatHaveReplacement;

  //ustawienie koloru tekstu przedmiotu i klasy, oraz generacja tekstu zastępstwa i lekcji
  for (let i = 0; i < subjectName.length; i++) {
    // console.log(groupsThatHaveReplacementCopy)
    if (groupsThatHaveReplacementCopy.includes(0)) {
      outputStyle.subject.push(cardStyles.replacement);
      outputStyle.room.push(cardStyles.replacement);
      if (replacements[replacementIdx[0]].newSubject !== "" && replacements[replacementIdx[0]].newRoom !== "") {
        finalSubjectArr.push(replacements[replacementIdx[0]].newSubject);
        finalRoomArr.push(replacements[replacementIdx[0]].newRoom);
      } else if (replacements[replacementIdx[0]].newSubject === "" && replacements[replacementIdx[0]].newRoom !== "") {
        finalSubjectArr.push(subjectName[i]);
        finalRoomArr.push(replacements[replacementIdx[0]].newRoom);
      } else if (replacements[replacementIdx[0]].newSubject !== "" && replacements[replacementIdx[0]].newRoom === "") {
        finalRoomArr.push(roomNumber[i]);
        finalSubjectArr.push(replacements[replacementIdx[0]].newSubject);
      } else {
        finalSubjectArr.push("-zwolniono-");
        finalRoomArr.push("-");
      }
      replacementIdx.shift();
      groupsThatHaveReplacementCopy.shift();
      break;
    } else {
      if (groupsThatHaveReplacementCopy.includes(i + 1)) {
        outputStyle.subject.push(cardStyles.replacement);
        outputStyle.room.push(cardStyles.replacement);
        if (replacements[replacementIdx[0]].newSubject !== "" && replacements[replacementIdx[0]].newRoom !== "") {
          finalSubjectArr.push(replacements[replacementIdx[0]].newSubject);
          finalRoomArr.push(replacements[replacementIdx[0]].newRoom);
        } else if (replacements[replacementIdx[0]].newSubject === "" && replacements[replacementIdx[0]].newRoom !== "") {
          finalSubjectArr.push(subjectName[i]);
          finalRoomArr.push(replacements[replacementIdx[0]].newRoom);
        } else if (replacements[replacementIdx[0]].newSubject !== "" && replacements[replacementIdx[0]].newRoom === "") {
          finalRoomArr.push(roomNumber[i]);
          finalSubjectArr.push(replacements[replacementIdx[0]].newSubject);
        } else {
          finalSubjectArr.push("-zwolniono-");
          finalRoomArr.push("-");
        }
        replacementIdx.shift();
        groupsThatHaveReplacementCopy.shift();
      } else {
        outputStyle.subject.push(cardStyles.normalSbj);
        outputStyle.room.push(cardStyles.normalRm);
        finalSubjectArr.push(subjectName[i]);
        finalRoomArr.push(roomNumber[i]);
      }
    }

  }


  //ustawienie szerokości karty z lekcją w zależności od aktualnego czasu

  // console.log(
  //   String(day) + "\t\t" + String(dayIdx) + "\t\t" + String(day === dayIdx)
  // );

  if (day === dayIdx) {
    if (isCurrentLesson === 1) {
      outputStyle.container.push(cardStyles.wide);
    } else if (isCurrentLesson === 2) {
      outputStyle.container.push(cardStyles.short);
    } else {
      outputStyle.container.push(cardStyles.standard);
    }
  } else {
    outputStyle.container.push(cardStyles.standard);
  }

  function generateYEET(yes) {
    if (yes) {
      return (
        <View style={[cardStyles.container, { width: "100%" }]}>
          <View style={[cardStyles.sideContent, { maxWidth: 60 }]}>
            <Text style={cardStyles.beginningHour}>
              {lessonTime[lessonNumber][0]}
            </Text>
            <Text style={cardStyles.endingHour}>
              {lessonTime[lessonNumber][1]}
            </Text>
          </View>
          {_generateMultiComponents(
            finalSubjectArr,
            outputStyle.subject,
            cardStyles.subjectBox,
            cardStyles.subjectText
          )}
          {_generateMultiComponents(
            finalRoomArr,
            outputStyle.room,
            [cardStyles.roomBox, { maxWidth: 60 }],
            cardStyles.roomText
          )}
        </View>);
    }
  }
  function generateYEEEET(yes) {
    if (yes) {
      return (<Text style={cardStyles.addInfo}>vvv   zmiana na   vvv</Text>);
    }
  }

  // console.log(finalSubjectArr.length);

  let height = (32 * finalSubjectArr.length) * 1.9 + 180;

  if (isReplacement) {
    height = (32 * finalSubjectArr.length) * 1.9 + 180;
  } else {
    height = (32 * finalSubjectArr.length) + 105;
  }

  //wizualne generowanie karty lekcji
  return (
    <View>
      <TouchableOpacity
        onPress={toggleOverlay}
        style={[cardStyles.container, outputStyle.container[0]]}
        activeOpacity={0.8}
      >
        <View style={cardStyles.sideContent}>
          <Text style={cardStyles.beginningHour}>
            {lessonTime[lessonNumber][0]}
          </Text>
          <Text style={cardStyles.endingHour}>
            {lessonTime[lessonNumber][1]}
          </Text>
        </View>
        {_generateMultiComponents(
          finalSubjectArr,
          outputStyle.subject,
          cardStyles.subjectBox,
          cardStyles.subjectText
        )}
        {_generateMultiComponents(
          finalRoomArr,
          outputStyle.room,
          cardStyles.roomBox,
          cardStyles.roomText
        )}
      </TouchableOpacity>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        backdropStyle={cardStyles.backdrop}
        overlayStyle={[cardStyles.overlay, { maxHeight: height }]}
      >
        <View style={cardStyles.overlayBox}>
          <Text style={cardStyles.infoHeader}>Lekcja: {lessonNumber}</Text>
          <View style={[cardStyles.container, { width: "100%" }]}>
            <View style={[cardStyles.sideContent, { maxWidth: 60 }]}>
              <Text style={cardStyles.beginningHour}>
                {lessonTime[lessonNumber][0]}
              </Text>
              <Text style={cardStyles.endingHour}>
                {lessonTime[lessonNumber][1]}
              </Text>
            </View>
            {_generateMultiComponents(
              subjectName,
              [cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj, cardStyles.normalSbj],
              cardStyles.subjectBox,
              cardStyles.subjectText
            )}
            {_generateMultiComponents(
              roomNumber,
              [cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm, cardStyles.normalRm],
              [cardStyles.roomBox, { maxWidth: 60 }],
              cardStyles.roomText
            )}
          </View>
          {generateYEEEET(isReplacement)}
          {generateYEET(isReplacement)}

        </View>
      </Overlay>
    </View>
  );
}



function _isCurrentLesson(
  lessonNumber,
  lessonTime,
  firstLessson,
  lastLessson,
  currTime
) {
  const firstLesson = Number(lessonTime[firstLessson][0].replace(":", ""));
  const lastLesson = Number(lessonTime[lastLessson][0].replace(":", ""));
  let lessonEndBefore;
  let lessonEndNow;
  if (lessonNumber === 0) {
    lessonEndBefore = firstLesson;
    lessonEndNow = Number(lessonTime[lessonNumber][1].replace(":", ""));
  } else {
    lessonEndBefore = Number(lessonTime[lessonNumber - 1][1].replace(":", ""));
    lessonEndNow = Number(lessonTime[lessonNumber][1].replace(":", ""));
  }
  // console.log(
  //   String(currTime) +
  //     "\t" +
  //     String(lessonEndBefore) +
  //     "\t" +
  //     String(lessonEndNow)
  // );
  if (currTime >= firstLesson && currTime <= lastLesson) {
    if (currTime > lessonEndBefore && currTime <= lessonEndNow) {
      return 1;
    } else {
      return 2;
    }
  } else return 0;
}

//generuje multi lekcje dla jednednego oddziału w tym samym czasię tj. lekcje grupowe
//pewnie da się to zrobić optymalniej ale ciągle mam problemy ze sobą XD
function _generateMultiComponents(
  arr,
  textStyle,
  containerStyle,
  anotherTextStyle
) {
  switch (arr.length) {
    case 1:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
        </View>
      );
    case 2:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
        </View>
      );
    case 3:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
        </View>
      );
    case 4:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
          <Text style={[anotherTextStyle, textStyle[3]]}>{arr[3]}</Text>
        </View>
      );
    case 5:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
          <Text style={[anotherTextStyle, textStyle[3]]}>{arr[3]}</Text>
          <Text style={[anotherTextStyle, textStyle[4]]}>{arr[4]}</Text>
        </View>
      );
    case 6:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
          <Text style={[anotherTextStyle, textStyle[3]]}>{arr[3]}</Text>
          <Text style={[anotherTextStyle, textStyle[4]]}>{arr[4]}</Text>
          <Text style={[anotherTextStyle, textStyle[5]]}>{arr[5]}</Text>
        </View>
      );
    case 7:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
          <Text style={[anotherTextStyle, textStyle[3]]}>{arr[3]}</Text>
          <Text style={[anotherTextStyle, textStyle[4]]}>{arr[4]}</Text>
          <Text style={[anotherTextStyle, textStyle[5]]}>{arr[5]}</Text>
          <Text style={[anotherTextStyle, textStyle[6]]}>{arr[6]}</Text>
        </View>
      );
    case 8:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
          <Text style={[anotherTextStyle, textStyle[1]]}>{arr[1]}</Text>
          <Text style={[anotherTextStyle, textStyle[2]]}>{arr[2]}</Text>
          <Text style={[anotherTextStyle, textStyle[3]]}>{arr[3]}</Text>
          <Text style={[anotherTextStyle, textStyle[4]]}>{arr[4]}</Text>
          <Text style={[anotherTextStyle, textStyle[5]]}>{arr[5]}</Text>
          <Text style={[anotherTextStyle, textStyle[6]]}>{arr[6]}</Text>
          <Text style={[anotherTextStyle, textStyle[7]]}>{arr[7]}</Text>
        </View>
      );
    default:
      return (
        <View style={containerStyle}>
          <Text style={[anotherTextStyle, textStyle[0]]}>{arr[0]}</Text>
        </View>
      );
  }
}

const cardStyles = StyleSheet.create({
  container: {
    marginTop: 5,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "space-around",
  },
  wide: { width: "92.5%" },
  short: { width: "88.5%" },
  standard: { width: "90%" },
  subjectBox: {
    flex: 1,
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
    borderColor: "#f5f0e7",
  },
  roomBox: {
    paddingVertical: "auto",
    alignItems: "center",
    justifyContent: "center",
    width: 75,
  },
  subjectText: {
    fontFamily: "jaapokki-regular",
    fontWeight: "200",
    letterSpacing: 1,
    fontSize: 21,
  },
  roomText: {
    fontFamily: "jaapokki-regular",
    fontWeight: "200",
    fontSize: 19,
    letterSpacing: 0.5,
    paddingVertical: 1.2,
    paddingHorizontal: 5,
  },
  normalSbj: { color: "#DBC196" },
  normalRm: { color: "#D3CDC3" },
  replacement: { color: "#ff6961" },
  beginningHour: {
    color: "#D3CDC3",
    fontFamily: "jaapokki-regular",
    fontWeight: "200",
    letterSpacing: 0.6,
    fontSize: 18,
    padding: 0,
    margin: 0,
  },
  endingHour: {
    color: "#D3CDC3",
    fontFamily: "jaapokki-regular",
    fontWeight: "200",
    letterSpacing: 0.6,
    fontSize: 14,
    padding: 0,
    margin: 0,
    marginTop: -10,
    opacity: 0.9,
  },
  sideContent: {
    paddingVertical: "auto",
    alignItems: "center",
    justifyContent: "center",
    width: 75,
  },
  backdrop: {
    opacity: 0.25,
  },
  overlay: {
    padding: 15,
    margin: 0,
    borderRadius: 10,
    backgroundColor: "#f5f0e7",
    // maxHeight: 330,
    width: "89%",
    elevation: 6,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  overlayBox: {
    padding: 0,
    margin: 0,
    borderRadius: 10,
    maxHeight: "100%",
    width: "100%",
    elevation: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  infoHeader: {
    fontFamily: "jaapokki-regular",
    fontSize: 28,
    padding: 0,
    margin: 5,
    marginTop: -5,
    color: "#534833",
  },
  addInfo: {
    fontFamily: "jaapokki-regular",
    fontSize: 24,
    padding: 0,
    margin: 2,
    color: "#D3CDC3",
  },
});
