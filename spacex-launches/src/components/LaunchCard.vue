<template>
  <div
    class="bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col h-full max-w-[250px]"
  >
    <!-- Image -->
    <div class="h-36 bg-gray-900 flex items-center justify-center p-4">
      <img
        v-if="launch.links.patch.small"
        :src="launch.links.patch.small"
        alt="Mission Patch"
        class="max-h-full max-w-full object-contain"
      />
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col justify-between flex-grow">
      <div class="space-y-2">
        <h2 class="text-lg font-semibold truncate">{{ launch.name }}</h2>
        <p class="text-sm text-gray-400">{{ new Date(launch.date_utc).toLocaleDateString() }}</p>
      </div>

      <div class="mt-4">
        <span
          class="inline-block px-2 py-1 text-xs font-medium rounded-full"
          :class="{
            'bg-green-500 text-white': launch.success,
            'bg-red-500 text-white': launch.success === false,
            'bg-yellow-400 text-black': launch.upcoming
          }"
        >
          {{ launch.success ? 'Success' : launch.upcoming ? 'Upcoming' : 'Failure' }}
        </span>
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
      required: true,
    },
  },
};
</script>
