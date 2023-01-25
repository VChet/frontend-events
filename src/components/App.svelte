<script lang="ts">
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import Main from "./Main.svelte";

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
</script>

<Main />
<footer>
  <a href="https://web-standards.ru/calendar.ics" rel="noopener">iCal</a>
  <a href="https://github.com/VChet/frontend-events" rel="noopener">Репозиторий</a>
  <a href="https://github.com/web-standards-ru/calendar" rel="noopener">Мероприятия</a>
</footer>

<style lang="scss">
  @import "@/styles/global.css";
</style>
