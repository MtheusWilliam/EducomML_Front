<template>
  <v-card width="220px">
    <v-card-title style="background-color:#63B0B0; color:white;">
      <span>Item de Informação</span>
    </v-card-title>
    <v-list>
      <v-row v-for="(item,i) in items" :key="i">
        <v-list-item @click="option(item)">
          <v-spacer></v-spacer>
          <v-list-item-title class="ml-2" style="color: #2196F3
">
            <v-icon color="blue">{{item.icon}}</v-icon>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
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
        icon: "mdi-file-image",
        name: "Imagem"
      },
      {
        icon: "mdi-file-music",
        name: "Audio"
      },
      {
        icon: "mdi-file-video",
        name: "Video"
      },
      {
        icon: "mdi-file-document",
        name: "Texto"
      },
      {
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
