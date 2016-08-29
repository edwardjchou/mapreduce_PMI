//Number of resumes from New York: db.resumes.find({location : "New York, NY"}).count()
//6139

//Query
db.resumes.find({"education.university_location" : "Champaign, IL"}).pretty()

//First 20 lines of output
/*
{
	"_id" : ObjectId("56b6767a5d134274640bea69"),
	"additionalInfo" : "",
	"additionalInfo_html" : null,
	"awards" : [ ],
	"certifications" : [ ],
	"education" : [
		{
			"degree" : "Juris Doctor",
			"start_finish_dates" : "January 2007",
			"university" : "DePaul University",
			"university_location" : "Chicago, IL"
		},
		{
			"degree" : "Bachelor of Science in Biology",
			"start_finish_dates" : "January 1999",
			"university" : "University of Illinois",
			"university_location" : "Champaign, IL"
		},
*/
		