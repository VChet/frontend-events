<script lang="ts">
  import dayjs from "dayjs";
  import type { EventModel } from "@/types/Event";

  function formatLongDate(date: string) {
    return dayjs(date).format(dayjs(date).hour() === 5 ? "DD MMM" : "DD MMM HH:mm");
  }

  export let event: EventModel | null = null;
</script>

{#if event}
  <li class="event">
    <slot name="header" />
    <h3>
      <a href={event.description} rel="noopener">{event.summary}</a>
    </h3>
    {#if event.location}
      <div>{event.location}</div>
    {/if}
    <div>
      {#if dayjs(event.start).isSame(event.end, "day")}
        {dayjs(event.start).format("HH:mm")} &mdash; {dayjs(event.end).format("HH:mm")}
      {:else}
        {formatLongDate(event.start)} &mdash; {formatLongDate(event.end)}
      {/if}
    </div>
  </li>
{/if}
