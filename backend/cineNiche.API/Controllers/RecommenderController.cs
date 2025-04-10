using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // Add logging
using System.Net; //Add error code enumeration.

[ApiController]
[Route("recommend")] //Updated Route.
public class RecommenderController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<RecommenderController> _logger; // Add logger

    public RecommenderController(HttpClient httpClient, ILogger<RecommenderController> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> GetColdStartRecommendations([FromBody] ColdStartUserModel user)
    {
        if (user == null)
        {
            _logger.LogError("ColdStartUserModel is null.");
            return BadRequest("Invalid input.");
        }

        try
        {
            var flaskUrl = "https://cold-start-recommender-esbaczgkgkhcdyhh.eastus-01.azurewebsites.net/recommend";
            var response = await _httpClient.PostAsJsonAsync(flaskUrl, user);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Recommender API error: {response.StatusCode}, {await response.Content.ReadAsStringAsync()}");
                return StatusCode((int)response.StatusCode, "Recommender API error");
            }

            var recommendations = await response.Content.ReadFromJsonAsync<List<MovieRecommendation>>();

            if (recommendations == null)
            {
                _logger.LogError("Recommender API returned null recommendations.");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Recommender API error");
            }

            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError($"An error occurred: {ex.Message}");
            return StatusCode((int)HttpStatusCode.InternalServerError, "An internal server error occurred.");
        }
    }
}