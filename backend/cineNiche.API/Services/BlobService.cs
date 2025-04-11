using Azure.Storage.Blobs;
using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace cineNiche.API.Services;

public class BlobService
{
    private readonly string _storageConnectionString;
    private readonly string _containerName = "movieposters9";
    private readonly BlobServiceClient _blobServiceClient;
    private readonly BlobContainerClient _blobContainerClient;

    public BlobService(string azureStorageKey)
    {
        _storageConnectionString = azureStorageKey;
        _blobServiceClient = new BlobServiceClient(_storageConnectionString);
        _blobContainerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
    }

    public string GenerateMoviePosterBlobName(string movieTitle)
    {
        string processedTitle = movieTitle.Replace(" ", "%20");
        processedTitle = Regex.Replace(processedTitle, "[^a-zA-Z0-9%]", "");
        return $"{processedTitle}.jpg";
    }

    public string GetMoviePosterBlobUrl(string blobName)
    {
        return $"{_blobContainerClient.Uri.AbsoluteUri}/{blobName}";
    }

    public async Task<string> GetMoviePosterUrlByTitleAsync(string movieTitle)
    {
        string blobName = GenerateMoviePosterBlobName(movieTitle);
        var blobClient = _blobContainerClient.GetBlobClient(blobName);
        if (await blobClient.ExistsAsync())
        {
            return GetMoviePosterBlobUrl(blobName);
        }
        else
        {
            return "/images/default-poster.png"; // Make sure this image exists in React public/
        }
    }

    public BlobClient GetBlobClient(string blobName)
{
    return _blobContainerClient.GetBlobClient(blobName);
}
}

