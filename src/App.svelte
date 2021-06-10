<script lang="ts">
  import axios from "axios";
  import dayjs from "dayjs";
  import Calendar from "color-calendar";
  import { onMount } from "svelte";

  import type { EventData } from "color-calendar";
  import type { EventModel } from "./types/Event";

  import "color-calendar/dist/css/theme-glass.css";

  let events: Array<EventModel> = [];
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
  export let selectedLocation: string = "";
  $: filteredEvents = selectedLocation
    ? events.filter((event) => event.location === selectedLocation)
    : events;

  export let selectedDate: Date | null = null;
  export let dayEvents: Array<EventData> = [];

  function initCalendar() {
    new Calendar({
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
    await fetch();
    initCalendar();
  });
</script>

<main>
  <div class="filter">
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      bind:value={selectedLocation}
      on:change={() => setTimeout(initCalendar, 0)}
    >
      <option disabled selected value>Фильтр по городу</option>
      {#each locations as location}
        <option value={location}>{location}</option>
      {/each}
    </select>
    Результаты: {filteredEvents.length}
  </div>
  <div id="calendar" />
  <div class="day-events">
    <h2>{dayjs(selectedDate).format("DD.MM.YYYY")}</h2>
    {#each dayEvents as event (event.uid)}
      <div class="event">
        <h2>
          <a href={event.description} rel="noopener">{event.summary}</a>
        </h2>
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
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    gap: 40px;
    max-width: 75%;
    margin: auto;
    margin-bottom: 40px;
  }
  @media (max-width: 767px) {
    main {
      max-width: none;
    }
  }

  .filter {
    width: 100%;
  }
  .day-events {
    width: 300px;
  }
  .event {
    font-size: 20px;
  }
  .event + .event {
    margin-top: 20px;
  }
  h2 {
    margin: 0 0 16px;
    font-size: 28px;
  }
</style>
