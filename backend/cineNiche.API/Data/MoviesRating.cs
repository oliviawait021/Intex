using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public partial class MoviesRating
{
    [Key]
    public int? user_id { get; set; }

    [Key]
    public string? show_id { get; set; }

    public int? rating { get; set; }
}
