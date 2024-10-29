using Hartsy.Extensions.UniversalTabExtension.WebAPI;
using SwarmUI.Core;
using SwarmUI.Utils;

namespace Hartsy.Extensions.UniversalTabExtension
{
    public class UniversalTabExtension : Extension
    {
        public override void OnFirstInit()
        {
            Logs.Info("UniversalTabExtension Version 0.2 started.");
            ScriptFiles.Add("Assets/universalTab.js");
        }

        public override void OnInit()
        {
            UniversalTabAPI.Register();
        }
    }
}