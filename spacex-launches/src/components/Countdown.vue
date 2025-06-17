<!-- src/components/Countdown.vue -->
<template>
  <div class="countdown">
    <div v-for="(value, unit) in timeLeft" :key="unit" class="countdown-item">
      <span class="countdown-value">{{ value }}</span>
      <span class="countdown-unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    targetDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeLeft: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      interval: null
    }
  },
  mounted() {
    this.updateCountdown()
    this.interval = setInterval(this.updateCountdown, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    updateCountdown() {
      const now = new Date().getTime()
      const target = new Date(this.targetDate).getTime()
      const distance = target - now

      this.timeLeft = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }
  }
}
</script>

<style scoped>
.countdown {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.countdown-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}
.countdown-unit {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-muted);
}
</style>