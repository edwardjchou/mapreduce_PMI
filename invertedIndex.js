// map
var MyMapInvIndex = function() {
	var additionalInfo = this.additionalInfo;
	var words = {};
	var frequencies = {};
	if (additionalInfo.length > 0) {
		var counter = 0;
		additionalInfo_worded = additionalInfo.split(" ");
		var wordIndex = 0;
		for (wordIndex = 0; wordIndex < additionalInfo_worded.length; wordIndex++) {
			frequencies[additionalInfo_worded[wordIndex]] = frequencies[additionalInfo_worded[wordIndex]] || 0;
			if(frequencies[additionalInfo_worded[wordIndex]] == 0){
				words[counter] = additionalInfo_worded[wordIndex];
				counter++;
			}
			frequencies[additionalInfo_worded[wordIndex]]++;
			//emit(words[wordIndex], {"docIds" : [this._id]});
		}
		var idx = 0;
		for (idx = 0; idx < counter; idx++){
			emit(words[idx], {"docId" : [this._id], "TF" : [frequencies[words[idx]]]});
		}
	}
}

// reduce
var MyReduceInvIndex = function (key, values) {
	var reducedValue = {"docIds" :  []};
	for (var idx = 0; idx < values.length; idx++) {
		if(values[idx].TF >= 0){
			reducedValue.docIds = reducedValue.docIds.concat({"docId" : values[idx].docId, "TF" : values[idx].TF});
		}
	};
	return reducedValue;
}
// run
db.inverted_index.drop();
db.resumes.mapReduce(MyMapInvIndex, MyReduceInvIndex,
	{"out" : {"reduce" : "inverted_index"}, query: { location: 'New York, NY' }});
db.inverted_index.aggregate([
	{$unwind: "$value.docIds"},
	{$group: {_id:"$_id", "docs": {$push:"$value.docIds"}, size: {$sum:1}}},{$sort:{size:-1}}]).pretty();
