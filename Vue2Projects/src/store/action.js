//action ---行为处理模块。 向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作
import {getUser,getAddressList} from '../service/getData'
import {GET_USERINFO,SAVE_ADDRESS} from './mutation-types.js'
//创建驱动方法异步改变mutations
export default {
    //包括异步PROMISE等异步行为
	async getUserInfo({commit,state}){
		let res = await getUser();//返回json格式数据
    //commit---是唯一改变mutation状态的提交方法，在mutation.js文件只需编写方法实例即可
		commit(GET_USERINFO, res)  // GET_USERINFO--方法名，res--状态数据
	},

	async saveAddress({commit,state}){
		if(state.removeAddress.length > 0) return;
		let addres = await getAddressList(state.userInfo.user_id);
		commit(SAVE_ADDRESS, addres);
	},
  a:()=>{

 },
  aa(){

  },
  n:{
    s(){

    },
    p(){

    }
  }
}
