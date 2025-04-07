using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using cineNiche.API.Data;

namespace cineNiche.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class MovieController : ControllerBase
    {
        private MoviesContext _movieContext;
        public MovieController(MoviesContext temp)
        {
            _movieContext = temp;
        }
        
        [HttpGet("AllMovies")]
        public IActionResult Get(int pageHowMany = 10, int pageNum = 15,  [FromQuery] List<string>? movieTypes = null)
        {
            IQueryable<MoviesTitle> query = _movieContext.MoviesTitles.AsQueryable();

            if (movieTypes != null && movieTypes.Any())
            {
                query = query.Where(m => movieTypes.Contains(m.Type));
            }
            
            HttpContext.Response.Cookies.Append("FavoriteMovieType", "Movie", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(5),
                
            });
            
            string? favMovieType = Request.Cookies["FavoriteMovieType"];
            
            if (string.IsNullOrEmpty(favMovieType))
            {
                Console.WriteLine("-----Cookie----- \n No cookie found.");
            }
            else
            {
                Console.WriteLine("-----Cookie----- \n" + favMovieType);
            }
            var something = query
                .Skip((pageNum -1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();
            
            var totalNumber = query.Count();
            
            return Ok(new
            {
                Movies = something,
                TotalNumber = totalNumber
            });
        }

        [HttpGet("GetMovieTypes")]
        public IActionResult GetMovieTypes()
        {
            var movieTypes = _movieContext.MoviesTitles
                .Select(m => m.Type)
                .Distinct()
                .ToList();
            return Ok(movieTypes);
        }

        [HttpPost("AddMovie")]
        public IActionResult AddMovie ( [FromBody] MoviesTitle newMovie )
        {
            _movieContext.MoviesTitles.Add(newMovie);
            _movieContext.SaveChanges();
            
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(int showId, [FromBody] MoviesTitle updatedMovie)
        {
            var existingMovie = _movieContext.MoviesTitles.Find(showId);
            
            existingMovie.Type = updatedMovie.Type;
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;
            
            _movieContext.MoviesTitles.Update(existingMovie);
            _movieContext.SaveChanges();
            
            return Ok(updatedMovie);
        }

        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(int showId)
        {
            var movie = _movieContext.MoviesTitles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Not found" });
            }
            _movieContext.MoviesTitles.Remove(movie);
            _movieContext.SaveChanges();
            
            return NoContent();
        }
    }
}
