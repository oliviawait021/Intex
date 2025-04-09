using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public partial class MoviesRating
{
    [Key]
    public int? UserId { get; set; }

    [Key]
    public string? ShowId { get; set; }

    public int? Rating { get; set; }
}
