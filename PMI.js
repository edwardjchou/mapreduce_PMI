//PMI Code
//Input each part one by one

//Part 1
var Map1 = function() {
	var additionalInfo = this.additionalInfo;
	if (additionalInfo.length > 0) {
		additionalInfo_worded = additionalInfo.split(" ");
		for (idx1 = 0; idx1 < additionalInfo_worded.length - 1; idx1++) {
			
			var remove_punctuations1 = additionalInfo_worded[idx1].replace(/[,•&-*.●\/#!$%\^&\*;:{}=\-_`~()]/g, "");
			//var remove_stop = remove_punctuations.replace(/and|of|to|in|with|the|a|for|I|as|on|at/gi, "");
			var word1 = remove_punctuations1.toLowerCase();

			var remove_punctuations2 = additionalInfo_worded[idx1 + 1].replace(/[,•&-*.●\/#!$%\^&\*;:{}=\-_`~()]/g, "");
			//var remove_stop = remove_punctuations.replace(/and|of|to|in|with|the|a|for|I|as|on|at/gi, "");
			var word2 = remove_punctuations2.toLowerCase();

			emit({"w1" : word1, "w2" : word2}, 1);
			emit({"w1" : word1, "w2" : '$'}, 1);
		}
		var remove_punctuations = additionalInfo_worded[additionalInfo_worded.length - 1].replace(/[,•&-*.●\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		//var remove_stop = remove_punctuations.replace(/and|of|to|in|with|the|a|for|I|as|on|at/gi, "");
		var word = remove_punctuations.toLowerCase();
		emit({"w1" : word, "w2" : '$'}, 1);
	}
}
var Reduce1 = function(key, values) {
	var totalCnt = 0;
	for (var i = 0; i < values.length; i++) {
		totalCnt += values[i];
	}
	return totalCnt;
}
db.mapreduce1.drop();
db.resumes.mapReduce(Map1, Reduce1,
	{"out" : {"reduce" : "mapreduce1"}, query: { location: 'New York, NY' }});
//db.mapreduce1.find().sort({"value" : -1}).pretty();

//Part 2
var Map2 = function() {
	var id = this._id;
	var id1 = this._id.w1;
	var id2 = this._id.w2;
	var value = this.value;
	if(id2 == "$"){
		emit(id1, {"value" : [[id, value]]});
		//emit(id1, value);
	}
	else{
		emit(id1, {"value" : [[id, value]]});
		emit(id2, {"value" : [[id, value]]});
	}
}
//Map2.apply(db.mapreduce1.findOne());
var Reduce2 = function(key, values) {
	var ret = {"value" : []};
	for (var idx = 0; idx < values.length; idx ++){
		ret.value = ret.value.concat(values[idx].value);
	}
	return ret
}
db.mapreduce2.drop();
db.mapreduce1.mapReduce(Map2, Reduce2, {"out" : {"reduce" : "mapreduce2"}});
//db.mapreduce2.find().sort({"value" : -1}).pretty();

//Part 3
var Map3 = function() {
	var values = this.value.value;
	var case2;
	for (value in values){
		//0 is the id, 1 is val
		if(values[value][0].w2 == "$"){
			case2 = values[value][1];
			break;
		}
	}
	for (value in values){
		if(values[value][0].w2 != "$"){
			emit(values[value][0], {"value" : [case2, values[value][1]]});
		}
	}
}
//Map3.apply(db.mapreduce2.findOne());
var Reduce3 = function(key, values) {
	var result = values[0]["value"][1]; // ["value"] because it's dic
	result = result / values[0]["value"][0] / values[1]["value"][0];
	var PMI = Math.log(result);
	if(values[0]["value"][1] < 100 || values[1]["value"][1] < 100){
		return -1000;
	}
	else{
		
		return PMI;
	}
}
db.mapreduce3.drop();
db.mapreduce2.mapReduce(Map3, Reduce3, {"out" : {"reduce" : "mapreduce3"}});
db.mapreduce3.find().sort({"value" : -1}).pretty();

///////////////////////////

//Top 20 word pairs
/*
problem solving
power point
social media
i am
new york
team player
such as
operating systems
customer service
i have
adobe photoshop
as well
well as
web services
sql server
office suite
word excel
microsoft office
excel powerpoint
ability to

Some observations we can notice is the high amount of software names like power point, adobe photoshop, and microsoft office,
which are often two words long and must be highly correlated because they always have to come one after another.  
Another type of pair that comes up frequently are resume buzzwords, like problem solving, team player, and social media
which are also often two words long and thrown around in many resumes together.
We can also observe a lot of technical terminolgy like operating system, web services, customer service, and sql server being used, with similar
causes behind them.
Finally, we observe the cases like 'i am', 'as well', 'i have' which are two stop words and are often used in many normal sentences, but might
not be so relevant in this case, so we might consider adding stop word removals as well as punctuations although I think it's not too necessary 
to demonstrate that our PMI works.

*/


