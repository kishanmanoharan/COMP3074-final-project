import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import { AppRegistry, StyleSheet, Text, View, FlatList } from "react-native";
import { ReactAnimatedWeather } from "react-animated-weather";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ActivityIndicator, Colors } from "react-native-paper";
import * as Location from "expo-location";

AppRegistry.registerComponent("main", () => App);

export default function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
      setData(
        await getWeather(location.coords.latitude, location.coords.longitude)
      );
    })();
  }, []);
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (data != null) {
    console.log(data);

    return (
      <View style={styles.container}>
        <div
          style={{ height: "35vh", margin: "20px" }}
          className="weather-icon"
        >
          <Text style={styles.subtemp}>Location: {data.timezone}</Text>
          <ReactAnimatedWeather
            icon={setIcon(data.current.weather[0].icon)}
            color={"goldenrod"}
            size={256}
            animate={true}
          />
        </div>
        {/* <Text style={styles.textWhite}>DONE</Text> */}
        <Text style={styles.mainTemp}>{data.current.temp} °C</Text>
        <Text style={styles.subtemp}>
          {data.current.weather[0].main}, Feels like {data.current.feels_like}{" "}
          °C
        </Text>
        <FlatList
          style={{ margin: 8, width: "90%" }}
          data={data.daily}
          contentContainerStyle={{ alignItems: "left" }}
          renderItem={({ item }) => (
            <div
              style={{
                backgroundColor: "#444",
                borderRadius: 16,
                marginTop: 16,
              }}
            >
              <Grid style={{ margin: 6, marginTop: 16, marginBottom: 16 }}>
                <Col size={1}>
                  <ReactAnimatedWeather
                    icon={setIcon(item.weather[0].icon)}
                    color={"#fff"}
                    size={32}
                    animate={true}
                  />
                </Col>
                <Col size={4} style={{ marginLeft: 10 }}>
                  <Text style={styles.subtemp}>
                    {getDay(item.dt)}
                    {"  "}
                  </Text>
                </Col>
                <Col size={3}>
                  <Text style={styles.subtemp}>{item.temp.day} °C</Text>
                </Col>
              </Grid>
            </div>
          )}
        />
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          size={"large"}
          color={Colors.blue800}
        />
        <Text style={styles.textWhite}>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

async function getWeather(latitude, longitude) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=b5c89be9250b907452aa127d02c412c8`
  ).then((res) => res.json());
}

function setIcon(icon) {
  if (icon == "01d") {
    return "CLEAR_DAY";
  } else if (icon == "01n") {
    return "CLEAR_NIGHT";
  } else if (icon == "02d") {
    return "PARTLY_CLOUDY_DAY";
  } else if (icon == "02n") {
    return "PARTLY_CLOUDY_NIGHT";
  } else if (icon == "03d" || icon == "03n" || icon == "04d" || icon == "04n") {
    return "CLOUDY";
  } else if (
    icon == "09d" ||
    icon == "09n" ||
    icon == "10d" ||
    icon == "10n" ||
    icon == "11d" ||
    icon == "11n"
  ) {
    return "RAIN";
  } else if (icon == "13d" || icon == "13n") {
    return "SNOW";
  } else if (icon == "50d" || icon == "50n") {
    return "FOG";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // minHeight: "100vh",
    // padding: "30px",
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
  iconContainer: {
    height: "30vh",
    margin: "20px",
  },
  dayItem: {
    width: 100,
  },
});

// export default App();
