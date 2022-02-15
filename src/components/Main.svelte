<script lang="ts">
  import dayjs from "dayjs";
  import Calendar from "color-calendar";
  import { onMount } from "svelte";
  import EventBlock from "./EventBlock.svelte";
  import type { EventModel } from "@/types/Event";

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
  $: ongoingEvents = filteredEvents
    .filter((event) => dayjs().isBetween(dayjs(event.start), dayjs(event.end), "day", "[]"))
    .sort((a, b) => (dayjs(a.end).isBefore(b.end) ? -1 : 1));
  $: upcomingEvents = filteredEvents.filter((event) => dayjs().isBefore(dayjs(event.start)));

  export let calendar: Calendar | null = null;
  export let selectedDate: Date = new Date();
  export let dayEvents: Array<any> = [];

  function initCalendar() {
    calendar = new Calendar({
      id: "#calendar",
      eventsData: filteredEvents,
      theme: "glass",
      layoutModifiers: ["month-left-align"],
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
        <button on:click={() => calendar?.setDate(new Date())}>На сегодня</button>
      </h2>
      {#if dayEvents.length}
        <ul>
          {#each dayEvents as event (event.uid)}
            <EventBlock {event} />
          {/each}
        </ul>
      {:else}
        Нет событий
      {/if}
    </div>
  </section>
  {#if ongoingEvents.length}
    <section class="ongoing-events">
      <h1>Текущие</h1>
      <ul class="events-wrapper">
        {#each ongoingEvents as event (event.uid)}
          <EventBlock {event}>
            <h2 slot="header">до {dayjs(event.end).format("DD.MM.YYYY")}</h2>
          </EventBlock>
        {/each}
      </ul>
    </section>
  {/if}
  {#if upcomingEvents.length}
    <section class="upcoming-events">
      <h1>Предстоящие</h1>
      <ul class="events-wrapper">
        {#each upcomingEvents as event (event.uid)}
          <EventBlock {event}>
            <h2 slot="header">
              <button class="event-date" on:click={() => calendar?.setDate(dayjs(event.start).toDate())}>
                {dayjs(event.start).format("DD.MM.YYYY")}
              </button>
            </h2>
          </EventBlock>
        {/each}
      </ul>
    </section>
  {/if}
</main>

<style lang="scss">
  @import "color-calendar/dist/css/theme-glass.css";
  @import "@/styles/calendar.css";
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
      h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      button {
        margin: 0;
        padding: 10px;
        border-radius: 0;
        font-size: initial;
      }
      ul {
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 20px;
      }
    }
  }
  .ongoing-events,
  .upcoming-events {
    text-align: center;
    margin-top: 60px;
    .events-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      .event-date {
        margin: 0;
        padding: 0;
        background: none;
        text-decoration: underline;
        &:hover,
        &:focus {
          text-decoration: none;
        }
      }
    }
  }
</style>
