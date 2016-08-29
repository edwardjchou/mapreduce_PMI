//First 20 words based on frequency
/*
{ "_id" : "", "value" : 1937027 }
{ "_id" : "and", "value" : 496792 }
{ "_id" : "•", "value" : 401250 }
{ "_id" : "of", "value" : 160029 }
{ "_id" : "to", "value" : 159210 }
{ "_id" : "in", "value" : 155086 }
{ "_id" : "with", "value" : 99890 }
{ "_id" : "the", "value" : 92252 }
{ "_id" : "a", "value" : 73692 }
{ "_id" : "Microsoft", "value" : 68484 }
{ "_id" : "for", "value" : 65599 }
{ "_id" : "&", "value" : 56584 }
{ "_id" : "-", "value" : 56315 }
{ "_id" : "*", "value" : 55230 }
{ "_id" : "Skills", "value" : 43562 }
{ "_id" : "skills", "value" : 42947 }
{ "_id" : "I", "value" : 38448 }
{ "_id" : "as", "value" : 36869 }
{ "_id" : "SKILLS", "value" : 33853 }
{ "_id" : "Office", "value" : 32222 }
*/

////////////////////////////

//Improved WordCount code
var MyMap = function() {
	// get the additionalInfo attribute/field of the resume (it contains sentences with text)
	var additionalInfo = this.additionalInfo;
	// only do stuff if non-empty (has some words)
	if (additionalInfo.length > 0) {
		// iterate over words in a document
		additionalInfo_worded = additionalInfo.split(" ");
		for (wordIndex = 0; wordIndex < additionalInfo_worded.length; wordIndex++) {
			// send to the reducer(s) a tuple (word, 1)

			var remove_punctuations = additionalInfo_worded[wordIndex].replace(/[,•&-*.●\/#!$%\^&\*;:{}=\-_`~()]/g, "");
			
			//var remove_stop = remove_punctuations.replace(/and|of|to|in|with|the|a|for|I|as|on|at/gi, "");

			var lowercase = remove_punctuations.toLowerCase();
			
			var emit_bool = 1;
			var myStopWords = ["", "and", "of", "to", "in", "with", "the", "a", "for", "i", "as", "on", "at", "[…]"];
			for (stopWordIndex = 0; stopWordIndex < myStopWords.length; stopWordIndex++){
				if(lowercase == myStopWords[stopWordIndex]){
					emit_bool = 0
				}
			}
			if(emit_bool == 1){
				emit(lowercase, 1);
			}
		}
	}
}
var MyReduce = function(key, values) {
	var totalCnt = 0;
	for (var i = 0; i < values.length; i++) {
		totalCnt += values[i];
	}
	return totalCnt;
}
// Each time we run a MapReduce job, we have to remove the previous version of the collection.
db.word_counts.drop();
// word_count is the name of the MapReduce output collection/table.
db.resumes.mapReduce(MyMap, MyReduce, {"out" : {"reduce" : "word_counts"}});
// print the sorted list of words
db.word_counts.find().sort({"value" : -1}).pretty()

///////////////////////////////////

//New top 20 words
/*
{ "_id" : "skills", "value" : 168925 }
{ "_id" : "microsoft", "value" : 70778 }
{ "_id" : "management", "value" : 63983 }
{ "_id" : "experience", "value" : 54406 }
{ "_id" : "office", "value" : 50865 }
{ "_id" : "excel", "value" : 46611 }
{ "_id" : "word", "value" : 45753 }
{ "_id" : "customer", "value" : 37698 }
{ "_id" : "work", "value" : 37215 }
{ "_id" : "ability", "value" : 35837 }
{ "_id" : "service", "value" : 35544 }
{ "_id" : "computer", "value" : 33508 }
{ "_id" : "team", "value" : 31467 }
{ "_id" : "software", "value" : 30679 }
{ "_id" : "communication", "value" : 29879 }
{ "_id" : "knowledge", "value" : 29777 }
{ "_id" : "ms", "value" : 29315 }
{ "_id" : "excellent", "value" : 29250 }
{ "_id" : "years", "value" : 28035 }
{ "_id" : "proficient", "value" : 26582 }
*/

// 3- 5 sentence explanation
//We can observe that the new results are much more telling than the initial 20 results, which was very cluttered with stop words and punctuations.  
//It is highly evident in the second run compared to the first run that the job attracted many applicants with experience in Microsoft Office, 
//with words like 'microsoft', 'office', 'excel', 'word', 'ms', 'computer', and 'software' populating the top 20 charts.  
//Also, we can see some benefits from lower casing, 
//which crunched words like 'skills' and 'Skills' together instead of having both be in the top 20 results.

