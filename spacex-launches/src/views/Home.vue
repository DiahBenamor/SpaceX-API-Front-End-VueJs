<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 space-y-10 overflow-x-hidden">

    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-white">🚀 SpaceX Launch Dashboard</h1>
      <p class="text-gray-400 text-sm mt-2">All launches, stats, and filters in one place</p>
    </div>

    <!-- Filters and Sort -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in ['all', 'success', 'failure', 'upcoming']"
          :key="type"
          @click="filters.status = type"
          :class="[ 
            'px-4 py-2 rounded-full text-sm font-semibold transition',
            filters.status === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          ]"
        >
          {{ type }}
        </button>
      </div>

      <select
        v-model="filters.sort"
        class="bg-gray-800 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-500"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>

    <!-- Stats Panel -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="(value, key) in stats"
        :key="key"
        class="bg-gray-800 p-4 rounded-xl shadow text-center"
      >
        <h3 class="text-gray-400 uppercase text-xs tracking-wider">{{ key }}</h3>
        <p class="text-2xl font-bold mt-1">
          {{ value }}<span v-if="key === 'successRate'">%</span>
        </p>
      </div>
    </div>

    <!-- Launch Cards Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      style="width: 100%;"
    >
      <LaunchCard
        v-for="launch in filteredLaunches"
        :key="launch.id"
        :launch="launch"
      />
    </div>
  </div>
</template>

<script>
import LaunchCard from '../components/LaunchCard.vue';

export default {
  components: { LaunchCard },
  data() {
    return {
      launches: [],
      filters: {
        status: 'all',
        sort: 'desc',
      },
    };
  },
  computed: {
    stats() {
      const total = this.launches.length;
      const success = this.launches.filter((l) => l.success).length;
      const failures = this.launches.filter((l) => l.success === false).length;
      const upcoming = this.launches.filter((l) => l.upcoming).length;
      const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

      return { total, success, failures, upcoming, successRate };
    },
    filteredLaunches() {
      let list = [...this.launches];
      const { status } = this.filters;

      if (status === 'success') list = list.filter((l) => l.success);
      else if (status === 'failure') list = list.filter((l) => l.success === false);
      else if (status === 'upcoming') list = list.filter((l) => l.upcoming);

      if (this.filters.sort === 'asc') {
        list.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
      } else {
        list.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
      }

      return list;
    },
  },
  async mounted() {
    const res = await fetch('https://api.spacexdata.com/v5/launches');
    this.launches = await res.json();
  },
};
</script>
