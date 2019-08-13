class Tstest{
	a:number;
	b:string;
	constructor(a:number,b:string){
		this.a=a;
		this.b=b;
	}
	say(y:string):string{
		return y;
	}
};
let s=new Tstest(6,"what");
console.log(s);
let r=s.say("is");
