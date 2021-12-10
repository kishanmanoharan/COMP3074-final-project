import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ReactAnimatedWeather from "react-animated-weather";
import { Col, Row, Grid } from "react-native-easy-grid";

import {
  TextInput,
  Button,
  List,
  ActivityIndicator,
  Colors,
} from "react-native-paper";

import * as Location from "expo-location";

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

export default function App() {
  const [data, setData] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  React.useEffect(() => {
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
        <div style={{ marginTop: "32px" }} className="weather-icon">
          {/* <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "300",
              display: "block",
            }}
          >
            Location: {data.timezone}
          </Text> */}
          <ReactAnimatedWeather
            icon={setIcon(data.current.weather[0].icon)}
            color={"goldenrod"}
            size={256}
            animate={true}
          />
        </div>
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
                backgroundColor: "#303030",
                borderRadius: 32,
                marginTop: 16,
              }}
            >
              <Grid
                style={{
                  margin: 6,
                  marginTop: 16,
                  marginBottom: 16,
                  alignItems: "center",
                }}
              >
                <Col size={1} style={{ marginLeft: 10 }}>
                  <ReactAnimatedWeather
                    icon={setIcon(item.weather[0].icon)}
                    color={"#fff"}
                    size={64}
                    animate={true}
                  />
                </Col>
                <Col size={4} style={{ marginLeft: 10, alignItems: "right" }}>
                  <Text style={styles.dayText}>
                    {getDay(item.dt)}
                    {"  "}
                  </Text>
                </Col>
                <Col size={2} style={{}}>
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

const styles = StyleSheet.create({
  container: {
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
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#fff",
    display: "block",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "middle",
  },
});
