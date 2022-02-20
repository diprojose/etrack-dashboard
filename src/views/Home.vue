<template>
  <div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import testData from '../../test-data.json';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  created() {
    const arrayString = JSON.stringify(testData);
    const encodedData = btoa(arrayString);
    console.log(encodedData);
  },
};
</script>
