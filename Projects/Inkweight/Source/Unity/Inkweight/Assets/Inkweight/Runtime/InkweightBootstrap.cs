// Starts the prototype in any scene: after the first scene has loaded, one
// GameObject with the game component is created from code. No prefab, no scene
// wiring and no imported asset is needed.
using UnityEngine;

namespace Inkweight.Runtime
{
    public static class InkweightBootstrap
    {
        private static bool started;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Start()
        {
            if (started) return;
            started = true;
            GameObject go = new GameObject("Inkweight");
            Object.DontDestroyOnLoad(go);
            go.AddComponent<InkweightGame>();
        }

        // Entering Play mode without a domain reload keeps static fields, so the
        // flag is cleared before every start.
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        private static void ResetStatics()
        {
            started = false;
        }
    }
}
