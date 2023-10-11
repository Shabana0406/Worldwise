import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const Base_URL = "http://localhost:8000";

const CityContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/current":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/create":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "reject":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${Base_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "reject",
          payload: "There was an error in loading city data...",
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      console.log(Number(id), currentCity.id);
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${Base_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/current", payload: data });
      } catch {
        dispatch({
          type: "reject",
          payload: "There was an error in loading city data....",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${Base_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "city/create", payload: data });
    } catch {
      dispatch({
        type: "reject",
        payload: "There was an error in creating city data....",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${Base_URL}/cities/${id}`, {
        method: "DELETE",
      });
      await res.json();

      dispatch({ type: "city/delete", payload: id });
    } catch {
      dispatch({
        type: "reject",
        payload: "There was an error in deleting city data....",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const value = useContext(CityContext);
  if (value === undefined)
    throw new Error("CityContext was used outside of the CityProvider");
  return value;
}

export { CityProvider, useCities };
