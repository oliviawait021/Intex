using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using cineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace cineNiche.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Authorize]
    public class MovieController : ControllerBase
    {
        private readonly MoviesContext _movieContext;

        public MovieController(MoviesContext temp)
        {
            _movieContext = temp;
        }

        // Get paginated and filtered movies
        [HttpGet("AllMovies")]
        public IActionResult Get(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? movieTypes = null)
        {
            HttpContext.Response.Cookies.Append("favMovieType", "Movie", new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.Now.AddMinutes(5)
            });

            var query = _movieContext.MoviesTitles.AsQueryable();

            if (movieTypes is { Count: > 0 })
            {
                query = query.Where(m => movieTypes.Contains(m.type));
            }

            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumber = query.Count();

            return Ok(new
            {
                Movies = movies,
                TotalNumber = totalNumber
            });
        }

        // Get distinct movie types
        [HttpGet("GetMovieTypes")]
        public IActionResult GetMovieTypes()
        {
            var movieTypes = _movieContext.MoviesTitles
                .Select(m => m.type)
                .Distinct()
                .ToList();

            return Ok(movieTypes);
        }

        // Add a new movie
        [HttpPost("AddMovie")]
        // [Authorize(Roles = "Admin")]
        public IActionResult AddMovie([FromBody] MoviesTitle newMovie)
        {
            _movieContext.MoviesTitles.Add(newMovie);
            _movieContext.SaveChanges();

            return Ok(newMovie);
        }

        // Update an existing movie
        [HttpPut("UpdateMovie/{showId}")]
        // [Authorize(Roles = "Admin")]
        public IActionResult UpdateMovie(string showId, [FromBody] MoviesTitle updatedMovie)
        {
            var existingMovie = _movieContext.MoviesTitles.Find(showId);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            existingMovie.type = updatedMovie.type;
            existingMovie.title = updatedMovie.title;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;

            _movieContext.SaveChanges();

            return Ok(updatedMovie);
        }

        // Delete a movie
        [HttpDelete("DeleteMovie/{showId}")]
        // [Authorize(Roles = "Admin")]
        public IActionResult DeleteMovie(string showId)
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

        // Get the next available showId (e.g. "s8809")
        [HttpGet("GetMaxShowId")]
        public IActionResult GetMaxShowId()
        {
            var max = _movieContext.MoviesTitles
                .Select(m => m.show_id)
                .Where(id => id.StartsWith("s"))
                .AsEnumerable()
                .Select(id =>
                {
                    var numberPart = id.Substring(1);
                    return int.TryParse(numberPart, out var num) ? num : 0;
                })
                .DefaultIfEmpty(0)
                .Max();

            return Ok($"s{max + 1}");
        }

        [AllowAnonymous]
        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser([FromBody] MoviesUser user)
        {
            try
            {
                if (user == null)
                    return BadRequest("User data is null");

                var maxId = _movieContext.MoviesUsers.Max(u => u.user_id);
                user.user_id = maxId + 1;

                _movieContext.MoviesUsers.Add(user);
                _movieContext.SaveChanges();

                return Ok(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get movie details by ShowId
        [HttpGet("GetMovieById/{showId}")]
        public IActionResult GetMovieById(string showId)
        {
            var movie = _movieContext.MoviesTitles.FirstOrDefault(m => m.show_id == showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            return Ok(movie);
        }

        [HttpGet("TrendingNow")]
        public IActionResult GetTrendingNow()
        {
            var trendingShowIds = _movieContext.MoviesRatings
                .Where(r => r.rating == 5)
                .Select(r => r.show_id)
                .Distinct()
                .ToList();

            if (!trendingShowIds.Any())
            {
                return Ok(new List<MoviesTitle>());
            }

            var trendingMovies = _movieContext.MoviesTitles
                .Where(m => trendingShowIds.Contains(m.show_id))
                .Take(20)
                .ToList();

            return Ok(trendingMovies);
        }

        [HttpGet("NewReleases")]
        [AllowAnonymous]
        public IActionResult GetNewReleases()
        {
            try
            {
                var newMovies = _movieContext.MoviesTitles
                    .OrderByDescending(m => m.release_year)
                    .Take(20)
                    .ToList();

                return Ok(newMovies);
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 Error in NewReleases endpoint: " + ex.Message);
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        public class RatingRequest
        {
            public int user_id { get; set; }
            public int rating { get; set; }
        }
        [HttpPost("{showId}/rating")] // Adjusted route to match frontend
        public async Task<IActionResult> PostRating(string showId, [FromBody] RatingRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var movie = await _movieContext.MoviesTitles.FirstOrDefaultAsync(m => m.show_id == showId);
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }
            var movieRating = new MoviesRating
            {
                show_id = showId,
                user_id = request.user_id,
                rating = request.rating
            };
            _movieContext.MoviesRatings.Add(movieRating);
            await _movieContext.SaveChangesAsync();
            return Ok(movieRating); // return ok.
        }

    }
}
