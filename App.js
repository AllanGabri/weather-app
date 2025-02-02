import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(""); // State for city input
    const API_KEY = "126419f6cd9d10a92a5add24529d3cef";

    useEffect(() => {
        // Function to get current location
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                        });
                    },
                    (err) => {
                        setError("Não foi possível obter sua localização");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocalização não é suportada pelo seu navegador");
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    useEffect(() => {
        if (location.lat && location.lon) {
            fetchWeatherData(location.lat, location.lon);
        }
    }, [location]);

    // Function to fetch weather data based on coordinates or city
    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=pt_br`
            );
            setWeatherData(response.data);
            setLoading(false);
        } catch (error) {
            setError("Erro ao buscar os dados climáticos");
            setLoading(false);
        }
    };

    // Function to handle search by city
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (city.trim() === "") return; // Do not fetch if input is empty

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`
            );
            setWeatherData(response.data);
            setLoading(false);
            setCity(""); // Clear input after search
        } catch (error) {
            setError("Erro ao buscar os dados climáticos");
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Condições Climáticas</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Digite o nome da cidade"
                />
                <button type="submit">Buscar</button>
            </form>

            {weatherData ? (
                <div>
                    <h2>{weatherData.name}</h2>
                    <p><b>Temperatura</b>: {weatherData.main.temp} °C</p>
                    <p><b>Clima</b>: {weatherData.weather[0].description}</p>
                    <p><b>Umidade</b>: {weatherData.main.humidity}%</p>
                    <p><b>Vento</b>: {weatherData.wind.speed} m/s</p>
                </div>
            ) : (
                <p>Não foi possível obter os dados climáticos</p>
            )}
        </div>
    );
};

export default WeatherApp;
