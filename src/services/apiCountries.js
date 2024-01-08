import axios from "axios";

const COUNTRIES_URL =
  "https://restcountries.com/v3.1/independent?status=true&fields=name";

const COUNTRY_URL = "https://restcountries.com/v3.1/name";

export async function getCountries() {
  try {
    const { data, statusText } = await axios.get(COUNTRIES_URL);

    const countries = data.map((country) => country.name.common).sort();
    countries.unshift("");

    if (statusText !== "OK") throw new Error("Fail to fetch flag");

    return countries;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getFlag(countryName) {
  try {
    const { data, statusText } = await axios.get(
      `${COUNTRY_URL}/${countryName}?fields=flags`
    );

    if (statusText !== "OK") throw new Error("Fail to fetch flag");

    return data.at(0)?.["flags"]?.["svg"] || "";
  } catch (error) {
    console.log(error);
    throw error;
  }
}
