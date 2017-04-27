<template>
  <div class="control-ball" :class="{active : active}" @click.stop="open">8</div>
</template>

<script>
export default {
  name: 'control-ball',
  data () {
    return {
      active: false,
    }
  },
  methods: {
    open() {
      this.active = !this.active;
    },
  }
}
</script>