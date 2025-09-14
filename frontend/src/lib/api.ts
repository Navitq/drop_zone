import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BACKEND_PATHS } from "@/utilites/urls";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;  // на сервере (SSR) document нет
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  // ищем в document.cookie запись вида "name=значение"
  return match ? decodeURIComponent(match[2]) : null;
  // если нашли — возвращаем значение, иначе null
}


api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method || "")) {
    // #### Получаем CSRF из куки
    let csrftoken = getCookie("csrftoken");

    // #### Если нет csrftoken, делаем GET на /csrf/ для установки куки
    if (!csrftoken) {
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/csrf/`, { withCredentials: true });
      csrftoken = getCookie("csrftoken");
    }

    // #### Подставляем CSRF в заголовок
    if (csrftoken) {
      config.headers = config.headers || {};
      config.headers["X-CSRFToken"] = csrftoken;
    }
  }

  // #### Подставляем JWT в Authorization
  return config;
});



api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retryCsrf?: boolean };

    // #### Проверяем, что это 403 из-за CSRF и ещё не пытались повторить
    if (error.response?.status === 403 && !originalRequest._retryCsrf) {
      originalRequest._retryCsrf = true;

      // Получаем новый CSRF
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/csrf/`, { withCredentials: true });

      // Берём токен из куки
      const csrftoken = getCookie("csrftoken");
      if (csrftoken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["X-CSRFToken"] = csrftoken;
      }

      // Повторяем исходный запрос
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);


// Response interceptor — обработка 401 и обновление токена
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если 401 и запрос ещё не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw error;

        // Запрос на обновление токена
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${BACKEND_PATHS.refreshTocken}`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = res.data.access;

        // Сохраняем новый токен
        localStorage.setItem("jwt", newAccessToken);

        // Подставляем новый токен в заголовок и повторяем исходный запрос
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
