import { FormControl, Select, MenuItem, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  // console.log(country)

  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then((data) => {
          const Countries = data.map((country) => (
            {
              name: country.country, //United States , United Kingdom
              value: country.countryInfo.iso2 // UK , USA , AF , IND
            }
          ))
          setCountries(Countries);
        });
    }

    getCountries();

  }, []);

  useEffect(() => {

    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(countryCode);

    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // console.log(url);

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
      });

  }

  // console.log(countryInfo);

  return (
    <div className="app">

      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app_dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}> {country.name} </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        {/* Status Card Component */}
        <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          {/* Table */}

          <h3>Worlwide new cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
