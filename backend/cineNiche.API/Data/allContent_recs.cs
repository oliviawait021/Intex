using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public class allContent_recs
{
    [Key]
    public string source_show_id { get; set; }
    [Key]
    public string recommended_show_id { get; set; }
    public float? similarity_score { get; set; }
}