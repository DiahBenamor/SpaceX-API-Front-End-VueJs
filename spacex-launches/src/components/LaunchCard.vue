<template>
  <div class="launch-card">
    <div class="card-image-container">
      <img
        v-if="launch.links.patch.small"
        :src="launch.links.patch.small"
        alt="Mission Patch"
        class="card-image"
        loading="lazy"
      />
      <div v-else class="no-image">
        <span class="emoji">🛰️</span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ launch.name }}</h3>
      <p class="card-date">
        {{ new Date(launch.date_utc).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) }}
      </p>
      <div class="card-footer">
        <span class="status-badge" :class="statusClass">
          {{ statusText }}
        </span>
        <span class="flight-number">
          #{{ launch.flight_number }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    launch: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusText() {
      if (this.launch.upcoming) return 'Upcoming'
      return this.launch.success ? 'Success' : 'Failure'
    },
    statusClass() {
      return {
        'status-success': this.launch.success,
        'status-failure': !this.launch.success && !this.launch.upcoming,
        'status-upcoming': this.launch.upcoming
      }
    }
  }
}
</script>