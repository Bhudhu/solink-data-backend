import { fetchSolcastData } from "./fetchData";

const testFetch = async () => {
  const data = await fetchSolcastData();
  console.log("Fetched Data:", data);
};

testFetch();
