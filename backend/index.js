const express = require("express");

require('dotenv').config();


const Note = require('./models/note');



const app = express();

app.use(express.json({strict: false}));

const cors = require('cors');
app.use(cors());

app.use(express.static('build'));





// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true
//   }
// ];


app.get("/", (request, response ) => {
		response.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (request, response) => {
	
		
		Note.find({}).then(notes => {
				response.json(notes);
			
		})
});

app.get('/api/notes/:id', (request, response) => {
 

	Note.findById(request.params.id).then(note => {
    response.json(note)
  })


});


app.delete('/api/notes/:id', (request, response) => {

		Note.findById(request.params.id)
			.then(note => {
						if(!note){
								return response.status(400).json({ 
									error: 'note not found' 
								});
						}				

						Note.findByIdAndRemove(request.params.id , function (err, note) {
							if (err) return console.log(err);
							response.status(204).end();
						});
						
			}).catch(error => {
					console.log(error)
					return response.status(400).json({ 
						error: 'an error ocurred' 
					});
			})




});


// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }



app.post('/api/notes', (request, response) => {
		const body = request.body;

		if (!body.content) {
			return response.status(400).json({ 
				error: 'content missing' 
			});
		}

		const newNoteContent = {
			content: body.content,
			important: body.important || false,
			date: new Date()
		};

		const note = new Note(newNoteContent);

		note.save().then(savedNote => {
			response.json(savedNote)
		});

})



app.put('/api/notes/:id', (request, response) => {



		Note.findById(request.params.id)
			.then(note => {
						if(!note){
								return response.status(400).json({ 
									error: 'note not found' 
								});
						}				

						const important = !note.important ;
			
						Note.findByIdAndUpdate(
								request.params.id,
								{ $set:	{	"important": important} },
								{new: true},
								function (err, note) {
									if (err) return console.log(err);
									response.json(note)
						})

			}).catch(error => {
					console.log(error)
					return response.status(400).json({ 
						error: 'an error ocurred' 
					});
			})

	

})




const PORT  =  process.env.PORT;

app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
});
