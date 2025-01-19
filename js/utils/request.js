let BASE_URL = "https://67878ce8c4a42c9161074578.mockapi.io/asaxiy";
const useFetch = () => {
  const response = ({ url, method = "GET", data }) => {
    return fetch(`${BASE_URL}/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .catch((error) => console.log(error));
  };
  return response;
};

export { useFetch };
