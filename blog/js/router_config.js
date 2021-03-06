//テンプレートの設定
var SingleBlog = { template: `
    <div class="page page--message">
      <template v-for="(post, index) in $root.posts">
        <div class="post" v-if="post.id == $route.params.id">
          <h2>SingleBlogのテンプレートです!!</h2>
          <div class="blog_content">
            <p>投稿ID：{{post.id}}</p>
            <p>投稿日：{{post.date}}</p>
            <p>投稿タイトル：{{post.title.rendered}}</p>
            <p><img :src="post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url"></p>
          </div>

          <template v-for="(contents, index) in post.acf.コンテンツ">

            <template v-if="contents.acf_fc_layout ==='テキスト'">
              <div v-html="contents.テキスト"></div>
            </template>

            <template v-else-if="contents.acf_fc_layout ==='画像エリア'">
              <figure>
                <img :src="contents.画像.sizes.thumbnail">
                <figcaption v-if="contents.画像の注釈文">{{contents.画像の注釈文}}</figcaption>
              </figure>
            </template>

          </template>

        </div>
      </template>
    </div>`
  }

var Home = { template:  `
  <div class="page page--home">
    <h2>ここはホームです、一覧表示させます</h2>
      <ul>
        <li v-for="post in $root.posts">
          <router-link :to="'/'+post.id">
            {{post.title.rendered}}
            <img :src="post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url">
          </router-link>
        </li>
    </ul>
    <aside>
      <p>投稿日付の整形のやり方</p>
      <p>urlのアスタリスクマークを消す</p>
      <p>[解決]acfのフレキシブルコンテンツの記述法</p>
      <p>[解決]h1要素にはif文でトップページと記事ページで振り分けたい（どの要素で振り分けたらよいのか）</p>
    </aside>
  </div>
  ` }

//ルーティングの設定
var routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Home',
      desc: 'Homeの説明'
    }
  },
  {
    path: '/:id',
    component: SingleBlog,
    meta: {
      title: 'Message',
      desc: 'Messageの説明'
    }
  }
]

var router = new VueRouter({
  //mode: 'history',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

//titleとdescriptionを変更
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  document.getElementsByTagName("meta")["description"].setAttribute('content',to.meta.desc);

  next();
});

var app = new Vue({
  router,
  el:'#wrapper',
  data: {
    msg:'メッセ',
    singleid:'',
    posts: []
  },
  watch: {
    // ルートが変更されたらこのメソッドを再び呼び出します
    '$route': 'nowRoute'
  },
  created: function(){
    this.getPosts();
    this.nowRoute ();
  },
  methods: {
    getPosts: function(){
      axios.get( 'http://026.test55.net/wp-json/wp/v2/news/?_embed&per_page=7' )
      .then( response => {
        this.posts = response.data;
      } )
      .catch( error => {
        window.alert( error );
      } );
    },
    nowRoute () {
	    this.singleid = this.$route.params.id
    }
  }
})