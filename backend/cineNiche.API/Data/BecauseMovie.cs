using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public class BecauseMovie
{
    public string? source_show_id { get; set; }
    public string? recommended_show_id { get; set; }
    public float? similarity_score { get; set; }
}