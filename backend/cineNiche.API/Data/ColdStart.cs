using System.Text.Json.Serialization;
public class ColdStartUserModel
{
    [JsonPropertyName("age")]
    public int Age { get; set; }
    [JsonPropertyName("Male")]
    public int Male { get; set; }
    [JsonPropertyName("Other")]
    public int Other { get; set; }
    [JsonPropertyName("Netflix")]
    public int Netflix { get; set; }
    [JsonPropertyName("Amazon Prime")]
    public int AmazonPrime { get; set; }
    [JsonPropertyName("Disney+")]
    public int DisneyPlus { get; set; }
    [JsonPropertyName("Paramount+")]
    public int ParamountPlus { get; set; }
    [JsonPropertyName("Max")]
    public int Max { get; set; }
    [JsonPropertyName("Hulu")]
    public int Hulu { get; set; }
    [JsonPropertyName("Apple TV+")]
    public int AppleTVPlus { get; set; }
    [JsonPropertyName("Peacock")]
    public int Peacock { get; set; }
}
public class MovieRecommendation
{
    [JsonPropertyName("show_id")]
    public int ShowId { get; set; }
    [JsonPropertyName("rating")]
    public double Rating { get; set; }
}