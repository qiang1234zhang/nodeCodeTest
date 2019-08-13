$("#div").html("This is new table");
class Test{
	constructor(a,b){
		this.a=a;
		this.b=b;
	}
	say(y){
		$("#div").html(y);
		console.log(y);
	}
};
let s=new Test("what","is");
s.say(4343);