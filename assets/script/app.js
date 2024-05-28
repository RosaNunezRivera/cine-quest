'use strict';

import {
    onEvent,
    select,
    selectById,
    selectAll,
    create,
} from "./utils.js";

//Import movies from array 
import movies from "../data/movies.js";

/*--------------------------------------------------------------------------------*/
/* Const Global variables                                                  */
/*--------------------------------------------------------------------------------*/
//Other Global variables
let moviesSuggestionsArray = [];

//Creating HTML elements
const movieInput = select(".movie-typed");

/*--------------------------------------------------------------------------------*/
/* Function: Set Initial Values                                                   */
/*--------------------------------------------------------------------------------*/
function setValues() {
    movieInput.value = '';
    let actualMovie = 'no selected';
}

setValues();

/*--------------------------------------------------------------------------------*/
/* Function: Event listener Enter letters in input text                           */
/*--------------------------------------------------------------------------------*/
movieInput.addEventListener('input', function (e) {
    e.preventDefault();
    movieInput.focus();
    let cleanMovieInput = movieInput.value.trim();

    if (cleanMovieInput.length>=3){
        MoviesSuggestions();
    }
    else {
        MoviesListDiv.style.visibility = "hidden";
    }
});


/*--------------------------------------------------------------------------------*/
/* Function: Event listener to avoid reload the page                              */
/*--------------------------------------------------------------------------------*/
onEvent('beforeunload', window, function (e) {
    e.returnValue = undefined;
    e.preventDefault();
    movieInput.focus();
});

onEvent('load', window, function (ev) {
    ev.returnValue = undefined;
    ev.preventDefault();
    movieInput.focus();
});


/*--------------------------------------------------------------------------------*/
/* Function: MoviesSuggestions()                                                  */
/* To Find the word(s) input by the user in each title in the array               */
/* to return the movies suggested in the search input text                        */
/*--------------------------------------------------------------------------------*/
function MoviesSuggestions() {
    let cleanMovieInput = movieInput.value.trim();
    
    //|| actualMovie !== movieInput.value
    if (cleanMovieInput !== "" ) {
        let regex = new RegExp(cleanMovieInput, "i"); // Ignora mayúsculas y minúsculas
    
        moviesSuggestionsArray = movies
        .filter(element => regex.test(element.title)) // Set filter the matched movies
        .map(element => element.title) // To get only titles
        .slice(0, 5); 

        if (moviesSuggestionsArray.length === 0) {    
            moviesSuggestionsArray.push("Movie not found");
            MoviesListDiv.classList.remove('hover-effect');
            movieInput.classList.add('input-typed');
            MoviesListDiv.dataset.miData = 'NoMatchs';
        }
        else {
            //Adding the hover and pointer style in case of suggested movies
            MoviesListDiv.classList.add('hover-effect');
            MoviesListDiv.dataset.miData = 'Match';
        }
        printSuggestedMovies();
    }   
    else 
    {
        console.log("la misma movie");
    }

    return;

}

/*-------------------------------------------------------*/
/*  Function: Display Suggested movies                     */
/*-------------------------------------------------------*/
const MoviesListDiv = select(".suggested-movies");

function printSuggestedMovies() {
    MoviesListDiv.innerHTML = ''; //To clean previous content
    MoviesListDiv.style.visibility = "visible";
    
    let rows = moviesSuggestionsArray.length;

    for (const element of moviesSuggestionsArray) {
        // Setting rows
        MoviesListDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        // Adding the suggested movies
        const movieSuggestedElement = document.createElement("p");
        movieSuggestedElement.classList.add('single-suggested-movie');
        movieSuggestedElement.dataset.movieTitle = element;
        movieSuggestedElement.innerHTML = element;
        MoviesListDiv.appendChild(movieSuggestedElement); 
    }
}

/*----------------------------------------------------------------------------------*/
/* Function: MoviesListDiv even listener to get the movie suggested selected */
/*----------------------------------------------------------------------------------*/
MoviesListDiv.addEventListener('click', function (e) {
    e.preventDefault();

    //Clicked movie 
    GetMovie(e);
});

function GetMovie(e){
    const clickedElement = e.target;

    const miDataValue = clickedElement.dataset.movieTitle;
    if (miDataValue ===undefined){
        return;
    }
    movieInput.value = miDataValue;
    MoviesListDiv.style.visibility = "hidden";
    //actualMovie = movieInput.value;
}


//*----------------------------------------------------------------------------------*/
/* Function: Find Movie-Button even listener to find the info of the movie selected */
/*----------------------------------------------------------------------------------*/
const findMovieBtn = select(".find-btn");
findMovieBtn.addEventListener('click', function (e) {
    e.preventDefault();
   
    console.log("Desde find movie btn");
    PrintInfoMovie();
});


 

function PrintInfoMovie(){  

    //Adding the Grid Container 
    const gridContainer = select(".grid-container");
    gridContainer.innerHTML = ''; //To clean previous content
    gridContainer.style.visibility = "visible";

    if (!gridContainer) {
        console.error('Grid container not found');
        return;
    }


    //Adding the Element Container 
    // const gridElementContainer = create("div");
    // gridElementContainer.classList.add('grid-element-container');


    const foundMovie = movies.find(movie => movie.title === movieInput.value);
  
    if (!foundMovie){
        return;
    }

    //Adding element container 

    const posterMovie = document.createElement("div");
    posterMovie.classList.add('grid-element-col-img');
    gridContainer.appendChild(posterMovie);

    const movieInfo =   document.createElement("div");
    movieInfo.classList.add('grid-element-col-info');
    gridContainer.appendChild(movieInfo); 

    // Adding the movie poster img
    const imgElement =  document.createElement("img");
    imgElement.src = foundMovie.poster;
    imgElement.alt = `${foundMovie.title} Poster`;
    posterMovie.appendChild(imgElement);


    const titleMovie =   document.createElement("div"); 
    titleMovie.classList.add('row-title');
    titleMovie.innerHTML = foundMovie.title;
    movieInfo.appendChild(titleMovie); 

    const yearMovie =   document.createElement("div"); 
    yearMovie .classList.add('row-year-duration');
    yearMovie .innerHTML = foundMovie.year+" | "+foundMovie.runningTime;
    movieInfo.appendChild(yearMovie); 

    const descriptionMovie =   document.createElement("div"); 
    descriptionMovie.classList.add('row-description');
    descriptionMovie.innerHTML = foundMovie.description;
    movieInfo.appendChild(descriptionMovie); 
 
    const genresMovieDiv =  document.createElement("div"); 
    genresMovieDiv.classList.add('row-genres');
    movieInfo.appendChild(genresMovieDiv);

   
    //Printing the genres'
    for (const item of foundMovie.genre) {
        const genresMovie =  document.createElement("div"); 
        genresMovie.classList.add('genre');
        genresMovie.innerHTML = item;
        genresMovieDiv.appendChild(genresMovie); 
    }

    console.log("Géneros:", foundMovie.genre.join(', '));
}







 
    
 





