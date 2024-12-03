using Newtonsoft.Json.Linq;
using SwarmUI.Accounts;
using SwarmUI.Core;
using SwarmUI.Utils;
using SwarmUI.WebAPI;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Hartsy.Extensions.UniversalTabExtension.WebAPI
{
    [API.APIClass("API routes related to UniversalTabExtension")]
    public class UniversalTabAPI
    {
        // Define a permission group for UniversalTabAPI
        public static class UniversalTabPermissions
        {
            public static readonly PermInfoGroup UniversalTabPermGroup = new("UniversalTab", "Permissions related to URL validation and iframe compatibility checks for UniversalTabExtension.");
            public static readonly PermInfo PermURLValidation = Permissions.Register(new("universal_url_validation", "URL Validation", "Allows the user to validate URLs for iframe compatibility.", PermissionDefault.USER, UniversalTabPermGroup));
            public static readonly PermInfo PermTabData = Permissions.Register(new("universal_tab_data", "Tab Data Management", "Allows the user to save and retrieve tab data.", PermissionDefault.USER, UniversalTabPermGroup));
            public static readonly PermInfo PermSaveTab = Permissions.Register(new("universal_tab_data_admin", "Tab Data Management (Admin)", "Allows the user to manage tab data for all users.", PermissionDefault.USER, UniversalTabPermGroup));
        }

        public static void Register()
        {
            API.RegisterAPICall(CheckValidURL, false, UniversalTabPermissions.PermURLValidation);
            API.RegisterAPICall(LoadSavedTabs, false, UniversalTabPermissions.PermTabData);
            API.RegisterAPICall(SaveTabs, false, UniversalTabPermissions.PermSaveTab);
        }

        /// <summary>Validates a given URL and determines whether it can be safely loaded in an iframe.</summary>
        /// <param name="url">The URL to validate.</param>
        /// <returns>A JSON response containing the result of the validation.</returns>
        /// <remarks>This method checks the <c>X-Frame-Options</c> header of the URL to determine whether it can be loaded in an iframe.
        /// If the header is present and set to "DENY" or "SAMEORIGIN", the method returns a response indicating that the URL does not support iframe loading under certain conditions.</remarks>
        public async static Task<JObject> CheckValidURL(
            [API.APIParameter("URL to check")] string url)
        {
            JObject response = [];
            try
            {
                Uri uri = new(url);
                response["valid"] = true;
                response["message"] = "The URL is valid.";
                using HttpClient httpClient = new();
                HttpRequestMessage request = new(HttpMethod.Head, url);
                HttpResponseMessage responseHttp = await httpClient.SendAsync(request);
                HttpStatusCode statusCode = responseHttp.StatusCode;
                Logs.Debug($"Response status code: {statusCode}");
                if (responseHttp.IsSuccessStatusCode)
                {
                    HttpResponseHeaders headers = responseHttp.Headers;
                    string frameOptions = headers.Contains("X-Frame-Options")
                        ? headers.GetValues("X-Frame-Options").FirstOrDefault()
                        : null;
                    if (frameOptions != null)
                    {
                        Logs.Debug($"X-Frame-Options header: {frameOptions}");
                        if (frameOptions.Equals("DENY", StringComparison.OrdinalIgnoreCase))
                        {
                            response["iframeSupported"] = false;
                            response["iframeMessage"] = "This URL does not support being loaded in an iframe (X-Frame-Options: DENY).";
                            Logs.Error("The URL does not support being loaded in an iframe (X-Frame-Options: DENY).");
                        }
                        else if (frameOptions.Equals("SAMEORIGIN", StringComparison.OrdinalIgnoreCase))
                        {
                            response["iframeSupported"] = false;
                            response["iframeMessage"] = "This URL does not support being loaded in an iframe on different-origin sites (X-Frame-Options: SAMEORIGIN). It can only be loaded in an iframe if the parent page shares the same origin.";
                            Logs.Error("The URL does not support being loaded in an iframe on different-origin sites (X-Frame-Options: SAMEORIGIN). It can only be loaded in an iframe if the parent page shares the same origin.");
                        }
                        else
                        {
                            response["iframeSupported"] = true;
                            response["iframeMessage"] = $"This URL supports being loaded in an iframe (X-Frame-Options: {frameOptions}).";
                        }
                    }
                    else
                    {
                        Logs.Debug("X-Frame-Options header not present. Assuming it supports being loaded in an iframe.");
                        response["iframeSupported"] = true;
                        response["iframeMessage"] = "This URL likely supports being loaded in an iframe, but the X-Frame-Options header is not present.";
                    }
                }
                else
                {
                    Logs.Error($"Failed to retrieve URL headers. Status code: {statusCode}");
                    response["valid"] = false;
                    response["message"] = "Failed to retrieve URL headers.";
                    response["error"] = $"The URL returned a status code of {statusCode}.";
                }
            }
            catch (UriFormatException ex)
            {
                Logs.Error($"Invalid URL format: {ex.Message}");
                response["valid"] = false;
                response["message"] = "Invalid URL format.";
                response["error"] = ex.Message;
            }
            catch (Exception ex)
            {
                Logs.Error($"An unexpected error occurred: {ex.Message}");
                response["valid"] = false;
                response["message"] = "An unexpected error occurred.";
                response["error"] = ex.Message;
            }
            return response;
        }

        /// <summary>Loads saved tab data from the user's session storage.</summary>
        /// <returns>A JSON response containing the saved tabs data or error information.</returns>
        public static Task<JObject> LoadSavedTabs()
        {
            try
            {
                string data = Program.Sessions.GenericSharedUser.GetGenericData("UniversalTab", "SavedTabs");
                return Task.FromResult(new JObject
                {
                    ["success"] = true,
                    ["data"] = data ?? "[]"
                });
            }
            catch (Exception ex)
            {
                Logs.Error($"Error loading saved tabs: {ex.Message}");
                return Task.FromResult(new JObject
                {
                    ["success"] = false,
                    ["message"] = "Failed to load saved tabs",
                    ["error"] = ex.Message
                });
            }
        }

        /// <summary>Saves tab data to the user's session storage.</summary>
        /// <param name="data">The tab data to save as a string (typically JSON).</param>
        /// <returns>A JSON response indicating success or failure.</returns>
        public static Task<JObject> SaveTabs(
            [API.APIParameter("Tab data to save")] string data)
        {
            try
            {
                Program.Sessions.GenericSharedUser.SaveGenericData("UniversalTab", "SavedTabs", data);
                return Task.FromResult(new JObject
                {
                    ["success"] = true,
                    ["message"] = "Tabs saved successfully"
                });
            }
            catch (Exception ex)
            {
                Logs.Error($"Error saving tabs: {ex.Message}");
                return Task.FromResult(new JObject
                {
                    ["success"] = false,
                    ["message"] = "Failed to save tabs",
                    ["error"] = ex.Message
                });
            }
        }
    }
}
