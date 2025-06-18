<!-- src/views/Home.vue -->
<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1 class="dashboard-title">🚀 SpaceX Launch Dashboard</h1>
      <p class="dashboard-subtitle">Comprehensive launch statistics and mission details</p>
    </header>

    <!-- Next Launch Section -->
    <section v-if="nextLaunch" class="next-launch-section">
      <h2 class="section-title">Next Launch</h2>
      <div class="next-launch-content">
        <div>
          <h3>{{ nextLaunch.name }}</h3>
          <p class="launch-date">
            {{ new Date(nextLaunch.date_utc).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}
          </p>
          <div class="countdown">
            <div class="countdown-item">
              <span>{{ countdown.days }}</span>
              <span>Days</span>
            </div>
            <div class="countdown-item">
              <span>{{ countdown.hours }}</span>
              <span>Hours</span>
            </div>
            <div class="countdown-item">
              <span>{{ countdown.minutes }}</span>
              <span>Minutes</span>
            </div>
            <div class="countdown-item">
              <span>{{ countdown.seconds }}</span>
              <span>Seconds</span>
            </div>
          </div>
        </div>
        <img 
          v-if="nextLaunch.links.patch.small" 
          :src="nextLaunch.links.patch.small" 
          alt="Next mission patch"
          class="mission-patch"
        >
      </div>
    </section>

    <!-- Controls -->
    <div class="control-bar">
      <div class="filter-group">
        <button
          v-for="type in filterOptions"
          :key="type.value"
          @click="filters.status = type.value"
          :class="[
            'filter-button',
            filters.status === type.value ? 'active' : ''
          ]"
        >
          {{ type.label }}
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
        @click="openModal(launch)"
      />
    </div>

    <!-- Launch Modal -->
    <div v-if="selectedLaunch" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">✕</button>
        
        <h2 class="modal-title">{{ selectedLaunch.name }}</h2>
        <p class="modal-date">
          {{ new Date(selectedLaunch.date_utc).toLocaleDateString('fr-FR') }}
        </p>
        
        <div class="modal-image" v-if="selectedLaunch.links.patch.large">
          <img :src="selectedLaunch.links.patch.large" alt="Mission patch">
        </div>
        
        <p class="modal-details" v-if="selectedLaunch.details">
          {{ selectedLaunch.details }}
        </p>
        
        <div class="modal-links">
          <a 
            v-if="selectedLaunch.links.article" 
            :href="selectedLaunch.links.article" 
            target="_blank"
            class="article-link"
          >
            Read Article
          </a>
        </div>
        
        <div class="video-toggle">
          <label>
            <input type="checkbox" v-model="showVideo">
            Show Launch Video
          </label>
        </div>
        
        <div v-if="showVideo && youtubeId" class="video-container">
          <iframe 
            width="100%" 
            height="315" 
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            frameborder="0" 
            allowfullscreen
          ></iframe>
        </div>
        
        <div class="additional-info">
          <div v-if="launchpadName">
            <h3>Launch Site</h3>
            <p>{{ launchpadName }}</p>
          </div>
          
          <div v-if="payloads.length">
            <h3>Payloads</h3>
            <ul>
              <li v-for="payload in payloads" :key="payload.id">
                {{ payload.name }} (Customers: {{ payload.customers.join(', ') }})
              </li>
            </ul>
          </div>
        </div>
      </div>
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
      nextLaunch: null,
      selectedLaunch: null,
      showVideo: false,
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      countdownInterval: null,
      launchpadName: '',
      payloads: [],
      filters: {
        status: 'all',
        sort: 'desc',
      },
      filterOptions: [
        { value: 'all', label: 'All Launches' },
        { value: 'success', label: 'Successful' },
        { value: 'failure', label: 'Failed' },
        { value: 'upcoming', label: 'Upcoming' }
      ]
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

  if (status === 'success') {
    list = list.filter((l) => l.success);
  } else if (status === 'failure') {
    list = list.filter((l) => l.success === false);
  } else if (status === 'upcoming') {
    list = list.filter((l) => l.upcoming);
  }

  if (this.filters.sort === 'asc') {
    list.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
  } else {
    list.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
  }

  // Only limit to 10 for upcoming launches
  return status === 'upcoming' ? list.slice(0, 10) : list;
},
    youtubeId() {
      if (!this.selectedLaunch?.links?.webcast) return null;
      const url = this.selectedLaunch.links.webcast;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
  },
  async mounted() {
    // Fetch all launches
    const res = await fetch('https://api.spacexdata.com/v5/launches');
    this.launches = await res.json();
    
    // Fetch next launch
    const nextRes = await fetch('https://api.spacexdata.com/v5/launches/next');
    this.nextLaunch = await nextRes.json();
    
    // Start countdown
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
  },
  methods: {
    updateCountdown() {
      if (!this.nextLaunch) return;
      
      const target = new Date(this.nextLaunch.date_utc).getTime();
      const now = new Date().getTime();
      const distance = target - now;
      
      this.countdown = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    },
    async openModal(launch) {
      this.selectedLaunch = launch;
      this.showVideo = false;
      
      // Fetch launchpad details
      if (launch.launchpad) {
        const padRes = await fetch(`https://api.spacexdata.com/v5/launchpads/${launch.launchpad}`);
        const padData = await padRes.json();
        this.launchpadName = padData.full_name;
      }
      
      // Fetch payloads details
      this.payloads = [];
      if (launch.payloads && launch.payloads.length) {
        const payloadPromises = launch.payloads.map(async payloadId => {
          const payloadRes = await fetch(`https://api.spacexdata.com/v5/payloads/${payloadId}`);
          return payloadRes.json();
        });
        
        this.payloads = await Promise.all(payloadPromises);
      }
    },
    closeModal() {
      this.selectedLaunch = null;
      this.launchpadName = '';
      this.payloads = [];
    }
  }
};
</script>

<style>
/* Next Launch Section */
.next-launch-section {
  background: var(--color-dark);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-light);
}

.next-launch-content {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.mission-patch {
  max-width: 150px;
}

.launch-date {
  color: var(--color-muted);
  margin-bottom: 1rem;
}

.countdown {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-item span:first-child {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}

.countdown-item span:last-child {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-dark);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.modal-date {
  color: var(--color-muted);
  margin-bottom: 1.5rem;
}

.modal-image {
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-image img {
  max-width: 100%;
  max-height: 300px;
}

.modal-details {
  color: var(--color-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.article-link {
  display: inline-block;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.video-toggle {
  margin-bottom: 1rem;
}

.video-container {
  margin-top: 1rem;
  aspect-ratio: 16/9;
}

.additional-info {
  margin-top: 1.5rem;
}

.additional-info h3 {
  color: var(--color-light);
  margin-bottom: 0.5rem;
}

.additional-info p, 
.additional-info ul {
  color: var(--color-muted);
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .next-launch-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .mission-patch {
    max-width: 100px;
  }
  
  .countdown {
    gap: 0.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
}
</style>