<template>
  <w-app id="app">
    <w-flex basis-zero wrap justify-center>
      <w-flex column align-center justify-center class="wrapper">
    <w-card id="appbody" class="sh-1 bd2">
    <h1>ShortTech</h1>
    <h3>We shorten URLs for public good</h3>
    <w-form v-model="valid">
    <w-input label="url" type="url" v-model="input_text" :validators="[validators.url]">Your URL</w-input>
    <w-button
      type="submit"
      :disabled="valid === false"
      class="ma1 px4"
      bg-color="primary"
      :loading="button2loading"
      @click="buttonDoLoading(2)">
      <w-icon class="mr1" >wi-check</w-icon>
      Submit
      <template #loading>Generating...</template>
    </w-button>
    </w-form>
    </w-card>
      </w-flex>
    </w-flex>

    <w-dialog
      v-model="dialog.show"
      :title="dialog.title"
      :fullscreen="dialog.fullscreen"
      :width="dialog.width"
      :persistent="dialog.persistent"
      :persistent-no-animation="dialog.persistentNoAnimation"
      title-class="primary-light1--bg white">
      {{dialogMsg}}
      <template #actions>
        <div class="spacer" />
        <w-button @click="dialog.show = false">Close</w-button>
      </template>
    </w-dialog>

  </w-app>
</template>

<script>
import axios from 'axios'

export default {
  // https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
  // https://stackoverflow.com/questions/47608379/vue-language-server-elements-in-iteration-expect-to-have-v-bindkey-directiv
  name: 'App',
  data () {
    return {
      input_text: '',
      bgImgUrl: '',
      dialogMsg: "",
      info: null,
      valid: false,
      button2loading: false,
      validators: {
        url: value => {
            const regex = RegExp('(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*(\\?[;&a-z\\d%_.~+=-@]*)?(\\#[-a-z\\d_@]*)?$', 'i');
            if (value.match(regex)) {
              return null;
            }
            return "This field requires a valid URL.";
        }
      },
      dialog: {
        title: "Message",
        show: false,
        fullscreen: false,
        persistent: false,
        persistentNoAnimation: false,
        width: 300
      }
    }
  },
  mounted () {
    // this.$route.query.test || 
    const urlParams = new URLSearchParams(window.location.search);
    this.dialogMsg = urlParams.get('msg') || "";
    if (this.dialogMsg) {
      this.dialog.title = "Error";
      this.dialog.show = true;
    }
    axios
      .get('https://www.reddit.com/r/earthporn/top/.json?limit=1')
      .then(response => {
        this.bgImgUrl = response.data.data.children[0].data.url;
        document.body.style.backgroundImage = `url(${this.bgImgUrl})`;
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    buttonDoLoading () {
      this[`button2loading`] = true
      axios
      .post('/', {
        url: this.input_text
      })
      .then(response => {
        this.dialog.title = "Your shortened URL is";
        this.dialogMsg = `${window.location.hostname}/${response.data.shortUrl}`;
        this.dialog.show = true;
      })
      .catch(error => {
        console.log(error)
        this.dialog.title = "Error";
        this.dialogMsg = `${error.message}`;
        this.dialog.show = true;
      })
      .finally(() => this[`button2loading`] = false)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#appbody {
  padding: 32px;
  background-color: rgba(255, 255, 255, .8);
}

</style>
