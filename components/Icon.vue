<template>
  <i :class="'fas fa' + ' ' + [icon]"></i>
</template>

<script lang='ts'>
import {
    Vue,
    Component,
    Prop
} from 'vue-property-decorator';
@Component
export default class Icon extends Vue {
  @Prop() icon!: string
}
</script>
