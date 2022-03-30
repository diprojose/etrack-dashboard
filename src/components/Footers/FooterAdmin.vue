<template>
  <footer class="block py-4">
    <div class="container mx-auto px-4">
      <hr class="mb-4 border-b-1 border-blueGray-200" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4">
          <div
            class="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left"
          >
            Copyright © {{ date }}
          </div>
        </div>
        <div class="w-full md:w-8/12 px-4">
          <ul class="flex flex-wrap list-none md:justify-end justify-center">
            <li>
              <a
                href="https://www.facebook.com/etrackanalytics"
                target="_blank"
              >
                <img class="mx-1" src="../../assets/img/facebook.png" alt="">
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/showcase/e-tracka"
                target="_blank"
              >
                <img class="mx-1" src="../../assets/img/linkedin.png" alt="">
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/etrackanalytics/"
                target="_blank"
              >
                <img class="mx-1" src="../../assets/img/instagram.png" alt="">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>
