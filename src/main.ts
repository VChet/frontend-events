import App from "./components/App.svelte";

import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(localeData);
dayjs.extend(isBetween);

import "dayjs/locale/ru";
dayjs.locale("ru");

const app = new App({ target: document.body });

export default app;
