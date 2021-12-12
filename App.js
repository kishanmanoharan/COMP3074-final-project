import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { AppRegistry, StyleSheet, Text, View, FlatList } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ActivityIndicator, Colors } from "react-native-paper";
import * as Location from "expo-location";

AppRegistry.registerComponent("Appname", () => App);

async function getWeather(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=b5c89be9250b907452aa127d02c412c8`
  ).then((res) => res.json());
}

function setColor(icon) {
  if (icon.includes("n")) {
    return "#282A4C";
  } else if (icon.includes("d")) {
    return "#FC9601";
  } else {
    return "#303030";
  }
}

function setIcon(icon) {
  switch (icon) {
    case "01d":
      return "day-sunny";
    case "01n":
      return "night-clear";
    case "02d":
      return "day-cloudy";
    case "02n":
      return "night-alt-cloudy";
    case "03d":
      return "day-cloudy";
    case "03n":
      return "night-alt-cloudy";
    case "04d":
      return "cloudy";
    case "04n":
      return "cloudy";
    case "09d":
      return "rain";
    case "09n":
      return "rain";
    case "10d":
      return "day-rain";
    case "10n":
      return "night-alt-rain";
    case "11d":
      return "lightnings";
    case "11n":
      return "lightnings";
    case "13d":
      return "day-snow";
    case "13n":
      return "night-alt-snow";
    case "50d":
      return "fog";
    case "50n":
      return "fog";
  }
}

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDay(datetime) {
  var date = new Date(datetime * 1000);
  return weekday[date.getDay()];
}

function getTime(datetime) {
  var date = new Date(datetime * 1000);
  return date.getHours() + ":" + date.getMinutes();
}

export default function App() {
  const [data, setData] = React.useState(null);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setData(
        await getWeather(location.coords.latitude, location.coords.longitude)
      );
    })();
  }, []);

  if (data != null) {
    var key = 0;
    while (key < 8) {
      data.daily[key].id = key;
      key += 1;
    }

    const renderItem = ({ item }) => (
      <View
        style={{
          backgroundColor: "#222",
          borderRadius: 32,
          marginTop: 16,
          minWidth: "100%",
          width: "100%",
        }}
      >
        <Grid
          style={{
            marginTop: 16,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Col size={1} style={{ marginLeft: 10, alignItems: "center" }}>
            <Fontisto
              name={setIcon(item.weather[0].icon)}
              size={40}
              color="white"
            />
          </Col>
          <Col size={4} style={{ marginLeft: 10 }}>
            <Text style={styles.dayText}>
              {getDay(item.dt)}
              {"  "}
            </Text>
            <Text style={styles.daySubText}>{item.weather[0].main}</Text>
          </Col>
          <Col size={2} style={{}}>
            <Text style={styles.smallTemp}>{Math.round(item.temp.day)} °C</Text>
          </Col>
        </Grid>
      </View>
    );

    return (
      <View style={styles.main}>
        <View
          style={{
            alignSelf: "center",
            backgroundColor: setColor(data.current.weather[0].icon),
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 600,
            width: "95%",
            height: "100%",
            borderRadius: 36,
            paddingBottom: 16,
            padding: 30,
          }}
        >
          <View style={styles.mainIcon}>
            <Fontisto
              name={setIcon(data.current.weather[0].icon)}
              size={175}
              color="white"
            />
          </View>
          <Text style={styles.mainTemp}>
            {Math.round(data.current.temp)} °C
          </Text>
          <Text style={styles.subtemp}>
            {data.current.weather[0].main}, Feels like{" "}
            {Math.round(data.current.feels_like)} °C
          </Text>
          <Text style={styles.subtemp}>{data.timezone}</Text>

          <FlatList
            style={{ margin: 4, width: "100%" }}
            data={data.daily}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}
          />
          <StatusBar style="light" />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator
          animating={true}
          size={"large"}
          color={Colors.blue800}
        />
        <Text style={styles.dayText}>Loading...</Text>
        <Text style={styles.textWhite}>
          Please allow location to get weather details.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: "#000",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  main: {
    alignContent: "center",
    backgroundColor: "#000",
    paddingTop: 55,
    paddingBottom: 10,
    alignSelf: "center",
    width: "100%",
  },
  textWhite: {
    color: "#fff",
  },
  mainTemp: {
    color: "#fff",
    fontSize: 48,
  },
  subtemp: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
  },
  smallTemp: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "400",
  },
  iconContainer: {
    height: "30vh",
    margin: "20px",
  },
  dayItem: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#fff",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  daySubText: {
    color: "#ddd",
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  mainIcon: {
    margin: 32,
  },
});
