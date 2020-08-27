<template>
  <div class="text-center">
    <v-dialog v-model="$store.state.loading.dialog" max-width="290" persistent="persistent">
      <v-card color="primary" dark>
        <v-card-text style="color:white;">
          <v-row class="pt-2 pb-3">
            <br />
            <v-spacer></v-spacer>
            <span style="font-size: 1.3em; color:white;">{{ $store.state.loading.message }}</span>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-progress-circular indeterminate color="white" class="mb-0"></v-progress-circular>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>