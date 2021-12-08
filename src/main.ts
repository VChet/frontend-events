import App from "./App.svelte";

import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);
import "dayjs/locale/ru";
dayjs.locale("ru");

import "color-calendar/dist/css/theme-glass.css";
import "./calendar.css";

const app = new App({ target: document.body });

export default app;
