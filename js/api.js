const BASE_URL = "http://localhost:1337/api";
const RESOURCE_URL = `${BASE_URL}/cars`; // URL для роботи з машинами

const baseRequest = async ({ urlPath = "", method = "GET", body = null }) => {
  try {
    const reqParams = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      reqParams.body = JSON.stringify(body);
    }

    const response = await fetch(`${RESOURCE_URL}${urlPath}`, reqParams);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("HTTP ERROR:", error);
    return null;
  }
};



// Отримати всі машини
export const getAllCars = () => baseRequest({ method: "GET" });

// Додати нову машину
export const postCar = (body) => baseRequest({ method: "POST", body });

// Оновити машину за ID
export const updateCar = (id, body) =>
  baseRequest({ urlPath: `/${id}`, method: "PATCH", body });

// Видалити машину за ID
export const deleteCar = (id) =>
  baseRequest({ urlPath: `/${id}`, method: "DELETE" });
