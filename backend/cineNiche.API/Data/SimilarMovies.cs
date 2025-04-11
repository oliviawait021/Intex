using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public class SimilarMovies
{
    public string? show_id { get; set; }
    public string? recommendation { get; set; }
    public string? distance_content { get; set; }
    public string? distance_collab { get; set; }
    public string? norm_content { get; set; }
    public string? norm_collab { get; set; }
    public string? final_score { get; set; }
}