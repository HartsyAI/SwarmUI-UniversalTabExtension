using Newtonsoft.Json.Linq;
using SwarmUI.WebAPI;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Hartsy.Extensions.UniversalTabExtension.WebAPI
{
    [API.APIClass("API routes related to UniversalTabExtension")]
    public class UniversalTabAPI
    {
        public static void Register()
        {
            API.RegisterAPICall(CheckValidURL);
        }

        /// <summary>Validates a given URL and determines whether it can be safely loaded in an iframe.</summary>
        /// <param name="url">The URL to validate.</param>
        /// <returns>A JSON response containing the result of the validation.</returns>
        /// <remarks>This method checks the <c>X-Frame-Options</c> header of the URL to determine whether it can be loaded in an iframe.
        /// If the header is present and set to "DENY", the method returns a response indicating that the URL does not support iframe loading.</remarks>
        public async static Task<JObject> CheckValidURL(
            [API.APIParameter("URL to check")] string url)
        {
            JObject response = [];
            try
            {
                Uri uri = new(url);
                // Check the headers of the URL to see if it supports being loaded in an iframe
                using HttpClient httpClient = new();
                HttpRequestMessage request = new(HttpMethod.Head, url);
                HttpResponseMessage responseHttp = await httpClient.SendAsync(request);
                if (responseHttp.IsSuccessStatusCode)
                {
                    HttpResponseHeaders headers = responseHttp.Headers;
                    string frameOptions = headers.GetValues("X-Frame-Options").FirstOrDefault();
                    if (frameOptions != null)
                    {
                        response["iframeSupported"] = !frameOptions.Equals("deny", StringComparison.CurrentCultureIgnoreCase);
                        response["iframeMessage"] = frameOptions.Equals("deny", StringComparison.CurrentCultureIgnoreCase) ? "This URL does not support being loaded in an iframe." : "This URL supports being loaded in an iframe.";
                    }
                    else
                    {
                        response["iframeSupported"] = true;
                        response["iframeMessage"] = "This URL likely supports being loaded in an iframe, but the X-Frame-Options header is not present.";
                    }
                }
                else
                {
                    // Handle when the URL is not reachable
                    response["valid"] = false;
                    response["message"] = "Failed to retrieve URL headers.";
                }
                response["valid"] = true;
                response["message"] = "The URL is valid.";
            }
            catch (UriFormatException ex)
            {
                response["valid"] = false;
                response["message"] = "Invalid URL format.";
                response["error"] = ex.Message;
            }
            catch (Exception ex)
            {
                response["valid"] = false;
                response["message"] = "An unexpected error occurred.";
                response["error"] = ex.Message;
            }
            return await Task.FromResult(response);
        }
    }
}
