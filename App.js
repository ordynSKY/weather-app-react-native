import axios from "axios";
import moment from "moment/moment";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ScrollView,
    RefreshControl,
} from "react-native";

export default function App() {
    const [counter, setCounter] = useState(0);
    const [weatherData, setWeatherData] = useState({});
    const [forecastData, setForecastData] = useState([]);
    const [temp, setTemp] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);
    const [wind, setWind] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [deg, setDeg] = useState(0);
    const [description, setDescription] = useState([]);
    const [icons, setIcons] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const increment = () => {
        setCounter(counter + 1);
    };

    const decrement = () => {
        setCounter(counter - 1);
    };

    const backgroundImage = {
        uri: "https://cdn.dribbble.com/users/925716/screenshots/3333720/attachments/722376/after_noon.png?compress=1&resize=400x300&vertical=top",
    };

    const getWeatherData = () => {
        axios
            .get(
                "https://api.openweathermap.org/data/2.5/weather?id=709930&lang=uk&appid=3e2909ec6da410a461651c53de1520bf&units=metric"
            )
            .then((res) => {
                setWeatherData(res.data);
                setTemp(Math.ceil(res.data.main.temp));
                setDescription(res.data.weather[0].description);
                setWind(res.data.wind.speed);
                setHumidity(res.data.main.humidity);
                setFeelsLike(Math.ceil(res.data.main.feels_like));

                if (res.data.wind.deg >= 0 && res.data.wind.deg <= 90) {
                    setDeg("ПC");
                } else if (
                    res.data.wind.deg >= 91 &&
                    res.data.wind.deg <= 180
                ) {
                    setDeg("СП");
                } else if (
                    res.data.wind.deg >= 181 &&
                    res.data.wind.deg <= 270
                ) {
                    setDeg("ПЗ");
                } else if (
                    res.data.wind.deg >= 271 &&
                    res.data.wind.deg <= 360
                ) {
                    setDeg("ЗХ");
                }
            });

        axios
            .get(
                "https://api.openweathermap.org/data/2.5/forecast?id=709930&lang=uk&cnt=9&appid=3e2909ec6da410a461651c53de1520bf&units=metric"
            )
            .then((res) => {
                setForecastData(res.data.list);
                setIcons(res.data.list[0].weather[0].icon);
                // console.log("icon", res.data.list[0].weather[0].icon);
            });
    };

    useEffect(() => {
        getWeatherData();
    }, []);

    const iconRef = `https://openweathermap.org/img/wn/${icons}.png`;

    console.log("desc", weatherData);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            getWeatherData();
            setRefreshing(false);
        }, 1000);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <ImageBackground
                source={backgroundImage}
                resizeMode="cover"
                style={styles.backgroundImage}
            >
                <View style={styles.cityContainer}>
                    <Text style={styles.text}>{weatherData.name}</Text>
                    <View style={styles.info}>
                        <Text style={styles.degree}>{temp}°C</Text>
                        <Text style={styles.infoText}>{description}</Text>
                    </View>
                    <View style={styles.separator}></View>
                </View>
                {/* <View style={styles.buttons}>
                    <View style={styles.increment}>
                        <Button
                            title="INCREMENT"
                            onPress={() => increment()}
                            color="red"
                        />
                    </View>
                    <View>
                        <Button title="DECREMENT" onPress={() => decrement()} />
                    </View>
                </View> */}
                <View style={styles.moreInfo}>
                    <View style={styles.meters}>
                        <Text style={styles.wind}>{deg}</Text>
                        <Text style={styles.wind}>{wind} m/s</Text>
                    </View>
                    <View style={styles.meters}>
                        <Text style={styles.wind}>Вологість</Text>
                        <Text style={styles.wind}>{humidity}%</Text>
                    </View>
                    <View style={styles.meters}>
                        <Text style={styles.deg}>Відчувається</Text>
                        <Text style={styles.deg}>{feelsLike}°</Text>
                    </View>
                </View>
                {Object.keys(forecastData).map((i, idx) => (
                    <View style={styles.forecast} key={idx}>
                        <View>
                            <Text style={styles.forecastText}>
                                {moment(forecastData[i].dt_txt).format(
                                    "DD/MM HH:mm"
                                )}
                            </Text>
                        </View>
                        <Image
                            source={{
                                uri: `https://openweathermap.org/img/wn/${icons}.png`,
                            }}
                            style={{ width: 40, height: 40 }}
                        />
                        <View>
                            <Text style={styles.forecastText}>
                                {Math.ceil(forecastData[i].main.temp)}/
                                {Math.ceil(forecastData[i].main.feels_like)}°
                            </Text>
                        </View>
                    </View>
                ))}

                <StatusBar style="auto" />
            </ImageBackground>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        // alignItems: "center",
        // justifyContent: "center",
    },
    text: {
        color: "white",
        // borderWidth: 1,
        // borderColor: "white",
        // padding: 5,
        // borderStyle: "dashed",
        textAlign: "center",
        margin: 15,
        fontSize: 20,
        fontFamily: "Oswald",
    },
    buttons: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        justifyContent: "center",
    },
    increment: {
        marginRight: 5,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
    },
    info: {
        paddingBottom: 20,
        marginLeft: 10,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: "white",
    },
    degree: {
        color: "white",
        textAlign: "left",
        fontSize: 40,
    },
    infoText: {
        color: "white",
        textAlign: "left",
        fontSize: 15,
    },
    cityContainer: {
        // alignContent: "flex-start",
        // marginBottom: 500,
        // bottom: 10,
        top: 20,
    },
    moreInfo: {
        borderBottomWidth: 1,
        borderColor: "white",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        padding: 10,
        // bottom: 30,
        top: 20,
    },
    wind: {
        borderRightWidth: 1,
        borderColor: "white",
        paddingRight: 30,
        color: "white",
        textAlign: "center",
    },
    deg: {
        paddingRight: 10,
        color: "white",
        textAlign: "center",
    },
    forecast: {
        borderBottomWidth: 1,
        borderColor: "white",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        // bottom: 30,
        top: 20,
    },
    forecastText: {
        color: "white",
    },
});
