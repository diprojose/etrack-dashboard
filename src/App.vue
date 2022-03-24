<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Montserrat;
  color: #000000;
  font-family: "Montserrat";
}

.button-primary {
  color: #96FFFF;
  background-color: #14329B;
}

.background-primary {
  color: #96FFFF;
  background-color: #14329B;
}

.button-secondary {
  color: #14329B;
  background-color: #96FFFF;
}

.first-color {
  color: #2864FF;
}
.second-color {
  color: #14329B;
}
.third-color {
  color: #96FFFF;
}

@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),
    url(./assets/fonts/Montserrat-Regular.ttf) format("truetype");
}

@font-face {
  font-family: "Montserrat Bold";
  src: local("Montserrat Bold"),
    url(./assets/fonts/Montserrat-Bold.ttf) format("truetype");
  font-weight: bold;
}

@font-face {
  font-family: "Montserrat Black";
  src: local("Montserrat Black"),
    url(./assets/fonts/Montserrat-Black.ttf) format("truetype");
  font-weight: black;
}

@font-face {
  font-family: "Montserrat Italic";
  src: local("Montserrat Italic"),
    url(./assets/fonts/Montserrat-Italic.ttf) format("truetype");
  font-style: italic;
}

</style>
