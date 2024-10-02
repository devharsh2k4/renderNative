import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notification from "expo-notifications";
import { useState, useEffect } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegments";

const timeStamp = Date.now() + 10 * 1000;

type CountdownStatus = {
  isOverDue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [status, setStatus] = useState<CountdownStatus>({
    isOverDue: false,
    distance: {},
  });
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverDue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverDue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp }
      );
      setStatus({ isOverDue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notification.scheduleNotificationAsync({
        content: {
          title: "I am the notification of taskly",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Permission Denied",
          "Please allow notification permission to schedule notification"
        );
      }
    }
  };
  return (
    <View
      style={[
        styles.container,
        status.isOverDue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverDue ? (
        <Text style={[styles.heading,styles.whiteText]}>Thing overdue by</Text>
      ) : (
        <Text style={styles.heading}>Thing due in ...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Ive completed the work</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 24,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
