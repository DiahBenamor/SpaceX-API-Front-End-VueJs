<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1 class="dashboard-title">🚀 SpaceX Launch Dashboard</h1>
      <p class="dashboard-subtitle">Comprehensive launch statistics and mission details</p>
    </header>

    <!-- Controls -->
    <div class="control-bar">
      <div class="filter-group">
        <button
          v-for="type in ['all', 'success', 'failure', 'upcoming']"
          :key="type"
          @click="filters.status = type"
          :class="[
            'filter-button',
            filters.status === type ? 'active' : ''
          ]"
        >
          {{ type }}
        </button>
      </div>

      <select
        v-model="filters.sort"
        class="sort-select"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div 
        v-for="(value, key) in stats" 
        :key="key" 
        class="stat-card"
      >
        <p class="stat-label">{{ key }}</p>
        <p class="stat-value">
          {{ value }}<span v-if="key === 'successRate'">%</span>
        </p>
      </div>
    </div>

    <!-- Launches Grid -->
    <div class="launches-grid">
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
