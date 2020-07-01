<template>
  <v-card width="270px" max-width="300px">
    <v-card-title style="background-color:#63B0B0; color:white;">
      <span>Item de Informação</span>
    </v-card-title>
    <v-list>
      <v-row>
        <v-col v-for="(item,i) in items" :key="i" :cols="item.cols">
          <v-list-item>
            <v-btn outlined color="blue" @click="option(item)" class="mx-1">
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.name }}
            </v-btn>
          </v-list-item>
        </v-col>
      </v-row>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "MenuFiles",
  props: ["optionCall", "type"],

  data: () => ({
    items: [
      {
        cols: 5,
        icon: "mdi-file-image",
        name: "Imagem"
      },
      {
        cols: 5,
        icon: "mdi-file-music",
        name: "Audio"
      },
      {
        cols: 5,
        icon: "mdi-file-video",
        name: "Video"
      },
      {
        cols: 6,
        icon: "mdi-file-document",
        name: "Texto"
      },
      {
        cols: 4,
        icon: "mdi-link-variant",
        name: "Link"
      }
    ]
  }),
  methods: {
    option(value) {
      this.$emit("dialogoption", {
        name: value.name,
        optionCall: this.optionCall,
        type: this.type
      });
    }
  }
};
</script>
