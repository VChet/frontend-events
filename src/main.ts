import App from "./App.svelte";

import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(localeData);
dayjs.extend(isBetween);

import "dayjs/locale/ru";
dayjs.locale("ru");

import "color-calendar/dist/css/theme-glass.css";
import "./calendar.css";

const app = new App({ target: document.body });

export default app;
