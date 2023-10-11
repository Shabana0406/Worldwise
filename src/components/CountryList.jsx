import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CityContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message="Add your first City 
  by clicking on a city on the map"
      />
    );

  const countries = cities.reduce((arr, crrcity) => {
    if (!arr.map((el) => el.country).includes(crrcity.country))
      return [...arr, { country: crrcity.country, emoji: crrcity.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
