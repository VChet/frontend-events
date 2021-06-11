<script lang="ts">
  import axios from "axios";
  import dayjs from "dayjs";
  import Calendar from "color-calendar";
  import { onMount } from "svelte";

  import type { EventData } from "color-calendar";
  import type { EventModel } from "./types/Event";

  import "color-calendar/dist/css/theme-glass.css";

  export let fetchComplete: boolean = false;
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
  $: if (typeof selectedLocation !== undefined) {
    setTimeout(initCalendar, 0);
  }

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
    fetchComplete = true;
    initCalendar();
  });
</script>

<main>
  <div class="calendar-wrapper" hidden={!fetchComplete}>
    <!-- svelte-ignore a11y-no-onchange -->
    <div class="filter">
      <div class="select">
        <select bind:value={selectedLocation}>
          <option disabled selected value>Фильтр по городу</option>
          {#each locations as location}
            <option value={location}>{location}</option>
          {/each}
        </select>
        <button on:click={() => (selectedLocation = "")}>❌</button>
      </div>
      Результаты: {filteredEvents.length}
    </div>
    <div id="calendar" />
  </div>
  <div class="day-events" hidden={!fetchComplete}>
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

<style lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    margin: 40px auto;
    text-align: center;
  }
  .filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .select {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      select {
        flex: 1;
        border-radius: 0;
      }
      button {
        padding: 10px;
        border-radius: 0;
      }
    }
  }
  .day-events {
    width: 300px;
    h2 {
      margin: 0 0 16px;
      font-size: 28px;
    }
    .event {
      font-size: 20px;
      + .event {
        margin-top: 20px;
      }
    }
  }
</style>
