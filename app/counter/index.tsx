import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notification from "expo-notifications";
import { useState, useEffect } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegments";
import { getFromStorage, saveToStorage } from "../../utils/storage";

//10secs
const frequency = 10 * 1000;

const countdownStorageKey = "taskly-countdown";

type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CountdownStatus = {
  isOverDue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverDue: false,
    distance: {},
  });
  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      const isOverDue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverDue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverDue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notification.scheduleNotificationAsync({
        content: {
          title: "The thing is due",
        },
        trigger: {
          seconds: frequency / 1000,
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
    if (countdownState?.currentNotificationId) {
      await Notification.cancelScheduledNotificationAsync(
        countdownState?.currentNotificationId
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);  
  };
  return (
    <View
      style={[
        styles.container,
        status.isOverDue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverDue ? (
        <Text style={[styles.heading, styles.whiteText]}>Thing overdue by</Text>
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
