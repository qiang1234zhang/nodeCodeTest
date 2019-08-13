//state对象读取方法。Vue Components通过该方法读取全局state对象

export default {
  //常规基本获取状态
  userInfo: function(state){
      return state.userInfo;
    },
  //在组件中 获取新状态
    //computed:{
      //1. userInfo(){
      //    return this.$store.getters.userInfo;
      // }
      //2.引入mapMutations
       //import {mapState, mapMutations, mapGetters} from 'vuex'
      // ...mapGetters(["userInfo"]);
    // };
}



