<script lang="ts">
  import axios from "axios";
  import dayjs from "dayjs";
  import Calendar from "color-calendar";
  import { onMount } from "svelte";

  import type { EventData } from "color-calendar";
  import type { EventModel } from "./types/Event";

  import "color-calendar/dist/css/theme-glass.css";

  let events: Array<EventModel> = [];
  export let fetchComplete: boolean = false;
  function fetch() {
    return axios
      .get("https://web-standards.ru/calendar.json")
      .then(({ data }: { data: Array<EventModel> }) => {
        events = data;
      })
      .catch(({ response }) => {
        console.log(response);
      });
  }

  $: locations = [...new Set(events.map((event) => event.location))]
    .filter((event) => event)
    .sort();

  export let selectedLocation: string = localStorage.getItem("location");
  $: if (typeof selectedLocation !== undefined) {
    localStorage.setItem("location", selectedLocation);
    if (calendar) calendar.setEventsData(filteredEvents);
  }

  $: filteredEvents = selectedLocation
    ? events.filter((event) => event.location === selectedLocation)
    : events;

  $: upcomingEvents = filteredEvents.filter((event) =>
    dayjs().isBefore(dayjs(event.start))
  );

  export let calendar: Calendar | null = null;
  export let selectedDate: Date = new Date();
  export let dayEvents: Array<EventData> = [];

  function initCalendar() {
    calendar = new Calendar({
      id: "#calendar",
      eventsData: filteredEvents,
      startWeekday: 1,
      theme: "glass",
      primaryColor: "#16676F",
      headerBackgroundColor: "#FFFFFF",
      headerColor: "#000000",
      dateChanged: (currentDate, events) => {
        selectedDate = currentDate;
        dayEvents = events;
      },
    });
  }

  onMount(async () => {
    initCalendar();
    await fetch();
    fetchComplete = true;
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
        <button on:click={() => calendar.reset(new Date())}>
          <span aria-label="К сегодняшнему дню" title="К сегодняшнему дню">
            📅
          </span>
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
      <h1>Все предстоящие мероприятия</h1>
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
</style>
