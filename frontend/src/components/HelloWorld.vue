<template>
  <div id="app" class="container">
    <h1>ShortTech</h1>
    <h3>We shorten URL for public good.</h3>

    <input type="url" v-model="input_text" v-enabled="!loading">
    <br>
    <button @click="handleClick">Shorten!</button>

    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div
        v-else
        v-for="currency in info" :key=currency
        class="currency"
      >
        {{ currency.description }}:
        <span class="lighten">
          <span v-html="currency.symbol"></span>{{ currencydecimal(currency.rate_float) }}
        </span>
      </div>

    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  // https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
  // https://stackoverflow.com/questions/47608379/vue-language-server-elements-in-iteration-expect-to-have-v-bindkey-directiv
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      input_text: '',
      bgImgUrl: '',
      info: null,
      loading: true,
      errored: false,
    }
  },
  computed: {
    currencydecimal () {
      return (value) => {
          return value.toFixed(2)
      }
    }
  },
  mounted () {
    axios
      .get('https://www.reddit.com/r/earthporn/top/.json?limit=1')
      .then(response => {
        this.bgImgUrl = response.data.data.children[0].data.url;
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  },
  methods: {
    handleClick: function(){
      if (this.msg.length) return this.submit();
      
      this.show = !this.show;
    }, 
    submit () {
      alert('Submit Form')
    }
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

.container {
  width: 100%;
  background-color: rgba(0,0,0,255);
}
</style>