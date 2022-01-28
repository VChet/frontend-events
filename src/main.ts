import App from "./App.svelte";

import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(localeData);
dayjs.extend(isBetween);

import "dayjs/locale/ru";
dayjs.locale("ru");

import "color-calendar/dist/css/theme-glass.css";
import "./styles/global.css";
import "./styles/calendar.css";

import { useRegisterSW } from "virtual:pwa-register/svelte";

useRegisterSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      /* eslint-disable no-console */
      console.log("Service worker registered");
    }
  },
  onRegisterError(error) {
    /* eslint-disable no-console */
    console.error(error);
  },
});

const app = new App({ target: document.body });

export default app;
