using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cineNiche.API.Data;

public partial class MoviesUser
{
    [Key]
    public int user_id { get; set; }

    public string? name { get; set; }

    public string? phone { get; set; }

    public string? email { get; set; }

    public int? age { get; set; }

    public string? gender { get; set; }

    public int? Netflix { get; set; }

    public int? Amazon_Prime { get; set; }

    public int? Disney { get; set; }

    public int? Paramount { get; set; }

    public int? Max { get; set; }

    public int? Hulu { get; set; }

    public int? Apple_TV { get; set; }

    public int? Peacock { get; set; }

    public string? city { get; set; }

    public string? state { get; set; }

    public int? zip { get; set; }
}
