<script lang="ts">
  import dayjs from "dayjs";
  import localeData from "dayjs/plugin/localeData";
  dayjs.extend(localeData);
  import "dayjs/locale/ru";
  dayjs.locale("ru");

  import Calendar from "color-calendar";
  import "color-calendar/dist/css/theme-glass.css";

  import { onMount } from "svelte";

  import type { EventModel } from "./types/Event";

  let events: Array<EventModel> = [];
  function fetchEvents() {
    return fetch("https://web-standards.ru/calendar.json")
      .then((response) => response.json())
      .then((data) => {
        events = data;
      })
      .catch((response) => {
        console.error(response);
      });
  }

  $: locations = [...new Set(events.map((event) => event.location))].filter((event) => event).sort();

  export let selectedLocation: string = localStorage.getItem("location") ?? "";
  $: if (typeof selectedLocation !== undefined) {
    localStorage.setItem("location", selectedLocation);
    if (calendar) calendar.setEventsData(filteredEvents);
  }

  $: filteredEvents = selectedLocation ? events.filter((event) => event.location === selectedLocation) : events;

  $: upcomingEvents = filteredEvents.filter((event) => dayjs().isBefore(dayjs(event.start)));

  export let calendar: Calendar | null = null;
  export let selectedDate: Date = new Date();
  export let dayEvents: Array<any> = [];

  function initCalendar() {
    calendar = new Calendar({
      id: "#calendar",
      eventsData: filteredEvents,
      theme: "glass",
      primaryColor: "#41adff",
      headerBackgroundColor: "#FFFFFF",
      headerColor: "#000000",
      startWeekday: 1,
      customMonthValues: dayjs.months(),
      customWeekdayValues: dayjs.weekdaysMin(),
      dateChanged: (currentDate: Date, events: Array<any>) => {
        selectedDate = currentDate;
        dayEvents = events;
      },
    });
  }

  onMount(async () => {
    initCalendar();
    await fetchEvents();
  });
</script>

<main>
  <section class="calendar-events">
    <h1>Календарь событий по фронтенду</h1>
    <div>
      <div class="filter" hidden={!locations.length}>
        <div class="select">
          <select bind:value={selectedLocation}>
            <option disabled selected value>Фильтр по городу</option>
            {#each locations as location}
              <option value={location}>{location}</option>
            {/each}
          </select>
          <button on:click={() => (selectedLocation = "")}>
            <span aria-label="Сброс фильтра" title="Сброс фильтра">❌</span>
          </button>
        </div>
        Результаты: {filteredEvents.length}
      </div>
      <div id="calendar" />
    </div>
    <div class="day-events">
      <h2>
        {dayjs(selectedDate).format("DD.MM.YYYY")}
        <button on:click={() => calendar?.reset(new Date())}>
          <span aria-label="К сегодняшнему дню" title="К сегодняшнему дню">📅</span>
        </button>
      </h2>
      <ul>
        {#each dayEvents as event (event.uid)}
          <li class="event">
            <h3>
              <a href={event.description} rel="noopener">{event.summary}</a>
            </h3>
            <div>{event.location}</div>
            <div>
              {#if dayjs(event.start).isSame(event.end, "day")}
                {dayjs(event.start).format("HH:mm")}
                &mdash;
                {dayjs(event.end).format("HH:mm")}
              {:else}
                {dayjs(event.start).format("DD.MM HH:mm")}
                &mdash;
                {dayjs(event.end).format("DD.MM HH:mm")}
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>
  {#if upcomingEvents.length}
    <section class="upcoming-events">
      <h1>Предстоящие мероприятия</h1>
      <ul class="events-wrapper">
        {#each upcomingEvents as event (event.uid)}
          <li class="event">
            <h2>{dayjs(event.start).format("DD.MM.YYYY")}</h2>
            <h3>
              <a href={event.description} rel="noopener">{event.summary}</a>
            </h3>
            <div>{event.location}</div>
            <div>
              {#if dayjs(event.start).isSame(event.end, "day")}
                {dayjs(event.start).format("HH:mm")}
                &mdash;
                {dayjs(event.end).format("HH:mm")}
              {:else}
                {dayjs(event.start).format("DD.MM HH:mm")}
                &mdash;
                {dayjs(event.end).format("DD.MM HH:mm")}
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</main>
<footer>
  <a href="https://web-standards.ru/calendar.ics" rel="noopener">iCal</a>
  <a href="https://github.com/VChet/frontend-events" rel="noopener">Репозиторий</a>
  <a href="https://github.com/web-standards-ru/calendar" rel="noopener">Мероприятия</a>
</footer>

<style lang="scss">
  main {
    margin: 40px auto;
  }
  h1 {
    margin: 0 0 20px;
    text-align: center;
  }
  h2 {
    margin: 0 0 16px;
    font-size: 28px;
  }
  h3 {
    margin: 0 0 12px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  .calendar-events {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px 40px;
    text-align: center;
    h1 {
      flex-basis: 100%;
    }
    .filter {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .select {
        flex: 1;
        display: flex;
        > * {
          border-radius: 0;
          margin-bottom: 0;
        }
        select {
          flex: 1;
        }
        button {
          padding: 10px;
          margin: 0;
        }
      }
    }
    .day-events {
      width: 300px;
      button {
        margin: 0;
        padding: 10px;
        border-radius: 0;
        font-size: initial;
      }
      .event {
        font-size: 20px;
        + .event {
          margin-top: 20px;
        }
      }
    }
  }
  .upcoming-events {
    text-align: center;
    margin-top: 60px;
    .events-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
  }
  footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px 20px;
    flex-wrap: wrap;
  }
</style>
