<!-- src/components/LaunchModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">×</button>
      
      <div class="modal-header">
        <h2>{{ launch.name }}</h2>
        <p class="launch-date">
          {{ new Date(launch.date_utc).toLocaleDateString('fr-FR') }}
        </p>
      </div>

      <div class="modal-body">
        <div class="image-container">
          <img 
            v-if="launch.links.patch.large" 
            :src="launch.links.patch.large" 
            alt="Mission patch"
          >
        </div>

        <div class="details-section">
          <h3>Mission Details</h3>
          <p>{{ launch.details || 'No details available' }}</p>
          
          <h3>Launch Site</h3>
          <p>{{ launchpadName }}</p>
          
          <h3>Payloads</h3>
          <ul>
            <li v-for="payload in payloads" :key="payload.id">
              {{ payload.name }} (Customers: {{ payload.customers.join(', ') }})
            </li>
          </ul>
          
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
          
          <a 
            v-if="launch.links.article" 
            :href="launch.links.article" 
            target="_blank"
            class="article-link"
          >
            Read Article
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    launch: Object,
    launchpadName: String,
    payloads: Array
  },
  data() {
    return {
      showVideo: false
    }
  },
  computed: {
    youtubeId() {
      if (!this.launch.links.webcast) return null
      const url = this.launch.links.webcast
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return (match && match[2].length === 11) ? match[2] : null
    }
  }
}
</script>

<style scoped>
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

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1rem 2rem 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.details-section {
  color: var(--color-muted);
}

.details-section h3 {
  color: var(--color-light);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.video-container {
  margin-top: 1rem;
  aspect-ratio: 16/9;
}

.article-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
}
</style>