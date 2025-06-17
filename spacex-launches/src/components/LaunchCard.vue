<template>
  <div 
    class="launch-card"
    @click="$emit('click', launch)"
    role="button"
    tabindex="0"
    @keydown.enter="$emit('click', launch)"
  >
    <div class="card-image-container">
      <img
        v-if="launch.links.patch.small"
        :src="launch.links.patch.small"
        :alt="`${launch.name} mission patch`"
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
        {{ formattedDate }}
      </p>
      <div class="card-footer">
        <span class="status-badge" :class="statusClass">
          {{ statusText }}
        </span>
        <span class="flight-number">
          #{{ launch.flight_number }}
        </span>
      </div>
      
      <!-- Additional quick info -->
      <div v-if="showQuickInfo" class="quick-info">
        <div class="info-item" v-if="launchpadName">
          <span class="info-label">Launch Site:</span>
          <span class="info-value">{{ launchpadName }}</span>
        </div>
        <div class="info-item" v-if="payloadNames">
          <span class="info-label">Payloads:</span>
          <span class="info-value">{{ payloadNames }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LaunchCard",
  props: {
    launch: {
      type: Object,
      required: true
    },
    launchpadName: {
      type: String,
      default: ""
    },
    payloads: {
      type: Array,
      default: () => []
    },
    showQuickInfo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
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
    },
    formattedDate() {
      return new Date(this.launch.date_utc).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    payloadNames() {
      return this.payloads.map(p => p.name).join(', ')
    }
  }
}
</script>

<style scoped>
.launch-card {
  background: var(--color-dark);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  outline: none;
}

.launch-card:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.launch-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.card-image-container {
  height: 160px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.card-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.launch-card:hover .card-image {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji {
  font-size: 2rem;
  opacity: 0.5;
}

.card-body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex-grow: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-light);
  margin-bottom: var(--space-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: var(--space-sm);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-success {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--color-success-light);
}

.status-failure {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-danger-light);
  animation: pulse-red 2s infinite;
}

.status-upcoming {
  background-color: rgba(245, 158, 11, 0.15);
  color: var(--color-warning-light);
}

.flight-number {
  font-size: 0.75rem;
  color: var(--color-muted);
  font-weight: 500;
}

.quick-info {
  margin-top: var(--space-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--space-sm);
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.info-label {
  color: var(--color-muted);
  margin-right: var(--space-xs);
}

.info-value {
  color: var(--color-light);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

@media (max-width: 640px) {
  .card-image-container {
    height: 120px;
  }
  
  .quick-info {
    display: none;
  }
}
</style>